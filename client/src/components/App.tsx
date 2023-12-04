import { ReactNode } from "react"
import { Outlet } from "react-router-dom"

import Header from "./Header.tsx"
import Navigation from "./Navigation.tsx"

export default function App(): ReactNode {
  return (
    <div className="container mx-auto mt-8">
      <Header />
      <div className="mt-4 flex flex-wrap">
        <Navigation />
        <div className="ml-4 mr-4 flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
