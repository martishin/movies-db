import { ReactNode } from "react"
import { Link } from "react-router-dom"

export default function Header(): ReactNode {
  return (
    <>
      <div className="flex flex-wrap items-center">
        <div className="max-w-full flex-1 flex-grow px-4">
          <Link to="/">
            <h1 className="text-3xl font-bold tracking-tight">Go watch a movie!</h1>
          </Link>
        </div>
        <div className="max-w-full flex-grow px-4 text-end">
          <Link to="/login">
            <span className="mb-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Login
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
