import React, { ReactNode, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

import OutletContext from "../../state/OutletContext"
import JsonResponse from "../../types/JsonResponse"
import { TokenResponse } from "../../types/TokenResponse"
import LoginInput from "../form/LoginInput"
import PageHeader from "../layout/PageHeader"

export default function SignUp(): ReactNode {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [errors, setErrors] = useState<Map<string, string>>(new Map())

  const { setJwtToken, setAlertMessage, setAlertClassName, toggleRefresh } =
    useOutletContext() as OutletContext

  const navigate = useNavigate()

  const hasError = (key: string): boolean => {
    return errors.has(key) && errors.get(key) !== ""
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newErrors = new Map<string, string>()

    const required = [
      { field: firstName, name: "first_name", message: "Please enter your first name" },
      { field: lastName, name: "last_name", message: "Please enter your last name" },
      { field: email, name: "email", message: "Please enter your email address" },
      { field: password1, name: "password1", message: "Please enter a password" },
      { field: password2, name: "password2", message: "Please enter repeated password" },
    ]

    required.forEach((obj) => {
      if (obj.field === "") {
        newErrors.set(obj.name, obj.message)
      }
    })

    if (password1 !== password2) {
      newErrors.set("password2", "Passwords do not match")
    }

    setErrors(newErrors)

    if (newErrors.size > 0) {
      return false
    }

    // build the request payload
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password1,
    }

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }

    fetch(`/api/signup`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ("error" in data) {
          const errorResponse = data as JsonResponse
          setAlertClassName("fadeIn")
          setAlertMessage(errorResponse.message)
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
          title="First Name"
          type="text"
          name="first-name"
          autoComplete="given-name"
          onChange={(event) => setFirstName(event.target.value)}
          hasError={hasError("first_name")}
          errorMsg={errors.get("first_name")}
        />

        <LoginInput
          title="Last Name"
          type="text"
          name="last-name"
          autoComplete="family-name"
          onChange={(event) => setLastName(event.target.value)}
          hasError={hasError("last_name")}
          errorMsg={errors.get("last_name")}
        />

        <LoginInput
          title="Email Address"
          type="email"
          name="email"
          autoComplete="email-new"
          onChange={(event) => setEmail(event.target.value)}
          hasError={hasError("email")}
          errorMsg={errors.get("email")}
        />

        <LoginInput
          title="Password"
          type="password"
          name="password-1"
          autoComplete="password-new"
          onChange={(event) => setPassword1(event.target.value)}
          hasError={hasError("password1")}
          errorMsg={errors.get("password1")}
        />

        <LoginInput
          title="Repeat Password"
          type="password"
          name="password-2"
          autoComplete="password-new"
          onChange={(event) => setPassword2(event.target.value)}
          hasError={hasError("password2")}
          errorMsg={errors.get("password2")}
        />

        <div className="mt-6">
          <input
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            value="Sign Up"
          />
        </div>
        <p className="mt-3 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link to="/login" className="font-semibold leading-6 text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
