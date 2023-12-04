import { ReactNode } from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

import Header from "./Header.tsx"

export default function ErrorPage(): ReactNode {
  const error = useRouteError()

  return (
    <div className="container mx-auto mt-8 h-screen">
      <Header />
      <div className="flex h-4/6 items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Oops!</h1>
          <p className="mt-2">Sorry, an unexpected error has occurred</p>
          <p className="mt-2">
            {isRouteErrorResponse(error) ? (
              <em>{error.statusText}</em>
            ) : error instanceof Error ? (
              <em>{error.message}</em>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  )
}
