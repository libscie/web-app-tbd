import { api } from "app/blitz-server"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "@blitzjs/auth"
import db from "../../db"

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const date = req.query.from as string

  let collections
  if (date) {
    collections = await db.collection.findMany({
      where: {
        updatedAt: {
          gte: new Date(date),
        },
        public: true,
      },
    })
  } else {
    collections = await db.collection.findMany({})
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(
    JSON.stringify({
      collections,
    }),
  )
}

export default api(webhook)
