import { BlitzApiRequest, BlitzApiResponse, Ctx } from "blitz"
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
import db, { Prisma } from "db"
import axios from "axios"
import FormData from "form-data"
import { Readable } from "stream"

import moment from "moment"
import algoliasearch from "algoliasearch"
import generateCrossRefXml from "../core/crossref/generateCrossRefXml"
import { Cite } from "../core/crossref/citation_list"
import { isURI } from "../core/crossref/ai_program"
import submitToCrossRef from "app/core/utils/submitToCrossRef"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const datetime = Date.now()

const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_ADMIN_KEY!)
const index = client.initIndex(`${process.env.ALGOLIA_PREFIX}_modules`)

// Many Thanks to this post 🙏
// https://www.aleksandra.codes/stripe-with-blitz
const getRawData = (req: BlitzApiRequest): Promise<string> => {
  return new Promise((resolve) => {
    let buffer = ""
    req.on("data", (chunk) => {
      buffer += chunk
    })

    req.on("end", () => {
      resolve(Buffer.from(buffer).toString())
    })
  })
}

const webhook = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const rawData: string = await getRawData(req)
  let event

  const signature = req.headers["stripe-signature"]
  try {
    event = stripe.webhooks.constructEvent(rawData, signature!, endpointSecret)
  } catch (err) {
    res.statusCode = 400
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Webhook signature verification failed" }))
    return
  }

  // https://www.tutorialsteacher.com/typescript/typescript-switch
  switch (event.type) {
    // only deal with success
    case "payment_intent.succeeded":
      switch (event.data.object.metadata.product) {
        case "collection-type":
          // TODO: Split for type of collection
          await db.collection.create({
            data: {
              title: "Your title here",
              subtitle: "Your subtitle here",
              suffix: event.data.object.metadata.suffix,
              collectionTypeId: parseInt(event.data.object.metadata.collectionId),
              icon: {
                cdnUrl: "https://ucarecdn.com/89f51e88-ab60-40fe-826d-4e86ed938424/RBadge.svg",
                originalUrl: "https://ucarecdn.com/89f51e88-ab60-40fe-826d-4e86ed938424/RBadge.svg",
                mimeType: "image/svg+xml",
              } as Prisma.JsonObject,
              header: {
                cdnUrl:
                  "https://ucarecdn.com/92add952-fe09-469d-91e9-4b86659dfe83/magipatternseamless1663788590153.jpg",
                originalUrl:
                  "https://ucarecdn.com/92add952-fe09-469d-91e9-4b86659dfe83/magipatternseamless1663788590153.jpg",
                mimeType: "image/jpeg",
              } as Prisma.JsonObject,
              editors: {
                create: {
                  role: "OWNER",
                  workspaceId: parseInt(event.data.object.metadata.workspaceId),
                },
              },
            },
          })
          break

        case "collection-upgrade":
          await db.collection.update({
            where: {
              id: parseInt(event.data.object.metadata.collectionId),
            },
            data: {
              collectionTypeId: parseInt(event.data.object.metadata.id),
              upgraded: true,
            },
          })
          break

        case "module-license":
          const datetime = Date.now()
          // TODO: Can be simplified along with publishModule.ts
          const module = await db.module.findFirst({
            where: {
              id: parseInt(event.data.object.metadata.module_id),
            },
            include: {
              license: true,
              type: true,
              authors: {
                include: {
                  workspace: true,
                },
                orderBy: {
                  authorshipRank: "asc",
                },
              },
              references: {
                include: {
                  authors: {
                    include: {
                      workspace: true,
                    },
                  },
                },
              },
            },
          })

          if (!module!.main) throw Error("Main file is empty")

          const licenseUrl = module?.license?.url ?? ""
          if (!isURI(licenseUrl)) throw Error("License URL is not a valid URI")

          const resolveUrl = `${process.env.APP_ORIGIN}/modules/${module!.suffix}`
          if (!isURI(resolveUrl)) throw Error("Resolve URL is not a valid URI")

          const xmlData = generateCrossRefXml({
            schema: "5.3.1",
            type: module!.type!.name,
            title: module!.title,
            language: module!.language,
            authors: module!.authors!.map((author) => {
              const js = {
                firstName: author.workspace?.firstName,
                lastName: author.workspace?.lastName,
                orcid: author.workspace?.orcid,
              }

              return js
            }),
            citations:
              module!.references.length === 0
                ? []
                : module?.references.map(
                    ({
                      authors,
                      authorsRaw,
                      publishedAt,
                      publishedWhere,
                      suffix,
                      prefix,
                      title,
                    }) => {
                      const refJs: Cite = {
                        publishedWhere: publishedWhere!,
                        authors:
                          publishedWhere === "ResearchEquals"
                            ? authors.map(({ workspace }) => {
                                const authJs = {
                                  name: `${workspace?.firstName} ${workspace?.lastName}`,
                                  orcid: `https://orcid.org/${workspace!.orcid}`,
                                }

                                return authJs
                              })
                            : authorsRaw!["object"].map(({ given, family, name }) => {
                                const authJs = {
                                  name: given && family ? `${given} ${family}` : `${name}`,
                                }

                                return authJs
                              }),
                        publishedAt: publishedAt!,
                        prefix: prefix!,
                        suffix: suffix!,
                        /**
                         * TODO: Should there be an isbn here?
                         */
                        // isbn: reference.isbn!,
                        title: title,
                      }
                      return refJs
                    }
                  ) ?? [],
            abstractText: module!.description!,
            license_url: licenseUrl,
            doi: `${module!.prefix}/${module!.suffix}`,
            resolve_url: resolveUrl,
          })

          await submitToCrossRef({ xmlData, suffix: module!.suffix })

          const publishedModule = await db.module.update({
            where: {
              id: parseInt(event.data.object.metadata.module_id),
            },
            data: {
              published: true,
              publishedAt: moment(datetime).format(),
              publishedWhere: "ResearchEquals",
              url: `https://doi.org/${process.env.DOI_PREFIX}/${event.data.object.metadata.suffix}`,
            },
            include: {
              license: true,
              type: true,
            },
          })

          await index.saveObject({
            objectID: publishedModule.id,
            doi: `${process.env.DOI_PREFIX}/${publishedModule.suffix}`,
            suffix: publishedModule.suffix,
            license: publishedModule.license?.url,
            type: publishedModule.type.name,
            // It's called name and not title to improve Algolia search
            name: publishedModule.title,
            description: publishedModule.description,
            publishedAt: publishedModule.publishedAt,
            displayColor: publishedModule.displayColor,
            language: publishedModule.language,
          })
          console.log(
            `[STRIPE WEBHOOK]: Publication complete; type ${event.type}, id: ${event.id}.`
          )
          break
      }
      break

    default:
      console.log(`[STRIPE WEBHOOK]: Unhandled event type ${event.type}, id: ${event.id}.`)
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ event: event.type }))
}

export default webhook

export const config = {
  api: {
    bodyParser: false,
  },
}
