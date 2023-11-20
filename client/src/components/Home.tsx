import ticketLogo from "./../assets/movie_tickets.jpg"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Find a movie to watch tonight!</h2>
        <hr />
        <Link to="/movies">
          <img src={ticketLogo} alt="movie tickets" className="m-auto"></img>
        </Link>
      </div>
    </>
  )
}
