import { Link } from "react-router-dom"

export default function Header() {
  return (
    <>
      <div className="flex flex-wrap items-center">
        <div className="flex-grow max-w-full flex-1 px-4">
          <Link to="/">
            <h1 className="text-3xl font-bold tracking-tight">Go watch a movie!</h1>
          </Link>
        </div>
        <div className="flex-grow max-w-full px-4 text-end">
          <Link to="/login">
            <span
              className="focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-green-300
                font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              Login
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}
