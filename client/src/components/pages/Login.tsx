import React, { ReactNode, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

import OutletContext from "../../state/OutletContext"
import { TokenResponse } from "../../types/TokenResponse"
import LoginInput from "../form/LoginInput"
import PageHeader from "../layout/PageHeader"

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
    <div>
      <PageHeader title="Login" />
      <form className="ml-auto mr-auto mt-3 w-3/5 max-w-xs" onSubmit={handleSubmit}>
        <LoginInput
          title="Email Address"
          type="email"
          name="email"
          autoComplete="email-new"
          onChange={(event) => setEmail(event.target.value)}
        />

        <LoginInput
          title="Password"
          type="password"
          name="password"
          autoComplete="password-new"
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="mt-6">
          <input
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            value="Log In"
          />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link to="/sign-up" className="font-semibold leading-6 text-blue-700 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
