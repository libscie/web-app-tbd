import { resolver } from "blitz"
import db, { MembershipRole } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async ({ editorId, role }: { editorId: number; role: MembershipRole }, ctx) => {
    const oldEditorship = await db.editorship.findFirst({
      where: {
        id: editorId,
      },
      include: {
        collection: {
          include: {
            editors: true,
          },
        },
      },
    })

    let ownerAdmins = 0
    for (const element of oldEditorship?.collection.editors!) {
      if (element.role === "OWNER" || element.role === "ADMIN") {
        ownerAdmins += 1
      }
    }
    if (ownerAdmins === 1) throw new Error("Cannot change your role as last admin or owner.")

    const editorship = await db.editorship.update({
      where: {
        id: editorId,
      },
      data: {
        role,
      },
    })

    return editorship
  }
)