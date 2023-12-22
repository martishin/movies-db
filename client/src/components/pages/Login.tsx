import React, { ReactNode, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

import OutletContext from "../../state/OutletContext"
import { TokenResponse } from "../../types/TokenResponse"
import LoginInput from "../form/LoginInput"

export default function Login(): ReactNode {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setJwtToken, setAlertMessage, setAlertClassName, toggleRefresh } =
    useOutletContext() as OutletContext

  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // build the request payload
    const payload = {
      email: email,
      password: password,
    }

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }

    fetch(`/api/authenticate`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ("error" in data) {
          setAlertClassName("fadeIn")
          setAlertMessage("Invalid credentials")
        } else {
          const tokenResponse = data as TokenResponse
          setJwtToken(tokenResponse.access_token)
          setAlertClassName("hidden")
          setAlertMessage("")
          toggleRefresh(true)
          navigate("/")
        }
      })
      .catch((error) => {
        setAlertClassName("fadeIn")
        setAlertMessage(error)
      })
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Login</h2>
        <hr />
        <form className="ml-auto mr-auto mt-3 w-3/5 max-w-xs" onSubmit={handleSubmit}>
          <LoginInput
            title="Email Address"
            type="email"
            className="form-control"
            name="email"
            autoComplete="email-new"
            onChange={(event) => setEmail(event.target.value)}
          />

          <LoginInput
            title="Password"
            type="password"
            className="form-control"
            name="password"
            autoComplete="password-new"
            onChange={(event) => setPassword(event.target.value)}
          />

          <div className="mt-6">
            <input
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              value="Login"
            />
          </div>
        </form>
      </div>
    </>
  )
}
