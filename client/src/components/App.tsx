import { ReactNode, useCallback, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

import { TokenResponse } from "../types/TokenResponse"
import Alert from "./Alert"
import Header from "./layout/Header"
import Navigation from "./layout/Navigation"

export default function App(): ReactNode {
  // const { jwtToken } = useContext(AuthContext) as JwtContext
  const [jwtToken, setJwtToken] = useState("")
  const [isFetchingAuth, setIsFetchingAuth] = useState(true)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertClassName, setAlertClassName] = useState("hidden")

  const [tickInterval, setTickInterval] = useState<number | null>(null)

  const toggleRefresh = useCallback(
    (refreshEnabled: boolean) => {
      if (refreshEnabled) {
        console.log("started auth refresh")
        const i = setInterval(
          () => {
            const requestOptions: RequestInit = {
              method: "GET",
              credentials: "include",
            }

            fetch("/api/refresh", requestOptions)
              .then((response) => response.json())
              .then((data) => {
                if ("access_token" in data) {
                  const tokenResponse = data as TokenResponse
                  setJwtToken(tokenResponse.access_token)
                }
              })
              .catch((error) => {
                console.log("user is not logged in", error)
              })
          },
          1000 * 60 * 10,
        ) as unknown as number

        setTickInterval(i)
      } else {
        console.log("stopped auth refresh")
        setTickInterval(null)
        if (tickInterval !== null) {
          clearInterval(tickInterval)
        }
      }
    },
    [tickInterval],
  )

  useEffect(() => {
    if (alertClassName === "fadeIn") {
      const timer = setTimeout(() => {
        setAlertClassName("fadeOut")
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [alertClassName])

  useEffect(() => {
    if (jwtToken === "") {
      const requestOptions: RequestInit = {
        method: "GET",
        credentials: "include",
      }

      fetch("/api/refresh", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if ("access_token" in data) {
            const tokenResponse = data as TokenResponse
            setJwtToken(tokenResponse.access_token)
            toggleRefresh(true)
          }
        })
        .catch((error) => {
          console.log("user is not logged in", error)
        })
        .finally(() => {
          setIsFetchingAuth(false)
        })
    } else {
      setIsFetchingAuth(false)
    }
  }, [jwtToken, toggleRefresh])

  if (isFetchingAuth) {
    return null
  }

  return (
    <div className="container mx-auto mt-8 max-w-screen-lg">
      <Alert message={alertMessage} alertClassName={alertClassName} />
      <Header jwtToken={jwtToken} setJwtToken={setJwtToken} toggleRefresh={toggleRefresh} />
      <div className="mt-4 flex">
        <div className="w-48">
          <Navigation jwtToken={jwtToken} />
        </div>
        <div className="ml-4 mr-4 w-min flex-grow">
          <Outlet
            context={{ jwtToken, setJwtToken, setAlertMessage, setAlertClassName, toggleRefresh }}
          />
        </div>
      </div>
    </div>
  )
}
