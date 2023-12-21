import { ReactNode } from "react"
import { Link } from "react-router-dom"

import ticketLogo from "./../../assets/movie_tickets.jpg"

export default function Home(): ReactNode {
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Find a movie to watch tonight!</h2>
        <hr />
        <Link to="/movies">
          <img src={ticketLogo} alt="movie tickets" className="m-auto w-40 pt-3"></img>
        </Link>
      </div>
    </>
  )
}
