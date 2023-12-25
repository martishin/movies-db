import { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"

interface HeaderProps {
  jwtToken: string
  setJwtToken: (token: string) => void
  toggleRefresh: (refreshEnabled: boolean) => void
}

export default function Header({ jwtToken, setJwtToken, toggleRefresh }: HeaderProps): ReactNode {
  const navigate = useNavigate()

  const logOut = () => {
    const requestOptions: RequestInit = {
      method: "GET",
      credentials: "include",
    }

    fetch("/api/logout", requestOptions)
      .catch((error) => {
        console.log("error logging out", error)
      })
      .finally(() => {
        setJwtToken("")
        toggleRefresh(false)
      })
    navigate("/")
  }

  return (
    <>
      <div className="flex flex-wrap items-center">
        <div className="max-w-full flex-1 flex-grow px-4">
          <Link to="/">
            <h1 className="text-3xl font-bold tracking-tight">Go watch a movie!</h1>
          </Link>
        </div>
        <div className="max-w-full flex-grow px-4 text-end">
          {jwtToken === "" ? (
            <Link to="/login">
              <span className="mb-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
                Log In
              </span>
            </Link>
          ) : (
            <a href="#!" onClick={logOut}>
              <span className="mb-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200">
                Log Out
              </span>
            </a>
          )}
        </div>
      </div>
    </>
  )
}
