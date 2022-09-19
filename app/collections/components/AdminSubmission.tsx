import Admin from "app/pages/admin"
import { Link } from "blitz"
import moment from "moment"
import HandleSubmissionToCollectionModal from "../../core/modals/HandleSubmissionToCollectionModal"
import DoiSubmission from "./DoiSubmission"

const AdminSubmission = ({ submission, editorIdSelf, refetchFn }) => {
  return (
    <>
      {submission.accepted === null && (
        <>
          <div>
            <Link href={`https://doi.org/${submission.module.prefix}/${submission.module.suffix}`}>
              <a
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: submission.module.title }}
              />
            </Link>
            {/* doi */}
            <div className="grid grid-cols-2">
              <div>
                <DoiSubmission submission={submission} />
                <p className="text-sm">Submitted {moment(submission.createdAt).fromNow()}</p>
                <p className="text-sm">
                  Originally published {moment(submission.module.publishedAt).fromNow()}
                </p>
                <p className="text-sm">
                  {/* TODO: Need to manage this for just name */}
                  Submitted by {submission.submittedBy!.firstName}{" "}
                  {submission.submittedBy!.lastName}
                </p>
              </div>
              <div className="right-0 mx-auto inline-block h-full w-full text-center">
                {/* accept submission */}
                <HandleSubmissionToCollectionModal
                  submission={submission}
                  editorId={editorIdSelf}
                  accept={true}
                  refetchFn={refetchFn}
                />
                {/* decline submission */}
                <HandleSubmissionToCollectionModal
                  submission={submission}
                  editorId={editorIdSelf}
                  accept={false}
                  refetchFn={refetchFn}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AdminSubmission