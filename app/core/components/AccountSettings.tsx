import changePassword from "app/auth/mutations/changePassword"
import changeEmail from "app/users/mutations/changeEmail"
import changeBio from "app/workspaces/mutations/changeBio"
import changePronouns from "app/workspaces/mutations/changePronouns"
import changeUrl from "app/workspaces/mutations/changeUrl"
import { Link, useMutation, validateZodSchema } from "blitz"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { z } from "zod"
import DeleteModal from "../modals/delete"

const WorkspaceSettings = ({ user, setIsOpen }) => {
  const [changePasswordMutation, { isSuccess: passwordChanged }] = useMutation(changePassword)
  const [changeEmailMutation] = useMutation(changeEmail)

  const formik = useFormik({
    initialValues: {
      email: user!.email!,
      currentPassword: "",
      newPassword: "",
      newRepeat: "",
    },
    validate: validateZodSchema(
      z.object({
        email: z.string().email(),
        currentPassword: z.string(),
        newPassword: z.string(),
        newRepeat: z.string(),
      })
    ),
    onSubmit: async (values) => {
      try {
        try {
          if (user!.email! !== values.email) {
            await changeEmailMutation(values)
          }
        } catch (error) {
          toast.error("You cannot use this email")
        }

        if (values.newPassword !== values.newRepeat && values.newPassword !== "") {
          alert("Please check the new password for typo's")
        } else if (values.newPassword !== "") {
          try {
            await changePasswordMutation(values)
            setIsOpen(false)
          } catch (error) {
            toast.error("Password needs to be at least 10 characters")
          }
        }
      } catch (error) {
        alert(error.toString())
      }
    },
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="my-4">
          <label
            htmlFor="email"
            className="my-1 block text-sm font-medium bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              className="appearance-none block w-11/12 px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="font-normal text-sm">{formik.errors.email}</div>
            ) : null}
            <p className="text-xs">
              Upon changing your email address, you will need to verify it before being able to
              publish again.
            </p>
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="currentPassword"
            className=" my-1 block text-sm font-medium bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700"
          >
            Current password
          </label>
          <div className="mt-1">
            <input
              id="currentPassword"
              type="password"
              autoComplete="password"
              className="appearance-none block w-11/12 px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("currentPassword")}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <div className="font-normal text-sm">{formik.errors.currentPassword}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="newPassword"
            className=" my-1 block text-sm font-medium bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700"
          >
            New password
          </label>
          <p className="text-xs">Password needs to be at least 10 characters.</p>
          <div className="mt-1">
            <input
              id="newPassword"
              type="password"
              className="appearance-none block w-11/12 px-2 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700  dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("newPassword")}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="font-normal text-sm">{formik.errors.newPassword}</div>
            ) : null}
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="newRepeat"
            className=" my-1 block text-sm font-medium bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700"
          >
            Repeat password
          </label>
          <div className="mt-1">
            <input
              id="newRepeat"
              type="password"
              className="appearance-none block w-11/12 px-3 py-2 border border-gray-500 bg-gray-300 dark:bg-gray-300 text-gray-700 dark:text-gray-700 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 placeholder-font-normal focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  font-normal text-sm "
              {...formik.getFieldProps("newRepeat")}
            />
            {formik.touched.newRepeat && formik.errors.newRepeat ? (
              <div className="font-normal text-sm">{formik.errors.newRepeat}</div>
            ) : null}
          </div>
        </div>
        <DeleteModal />

        <div className="sticky bottom-0 py-2 bg-gray-300">
          <button
            type="submit"
            className=" py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
          <button
            className="mx-2 py-2 px-4 border border-gray-500 bg-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

export default WorkspaceSettings
