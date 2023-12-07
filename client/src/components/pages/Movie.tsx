import { ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Movie as MovieModel } from "../../models/Movie"

export default function Movie(): ReactNode {
  const [movie, setMovie] = useState<MovieModel>()
  const { id } = useParams()

  useEffect(() => {
    const fetchedMovie = new MovieModel(
      1,
      "Highlander",
      "1986-03-06",
      116,
      "R",
      "Some long description",
    )
    setMovie(fetchedMovie)
  }, [id])

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Movie</h2>
      </div>
      <hr />
      <div className="mt-2 text-left">
        <h3 className="text-l font-bold tracking-tight"> {movie?.title}</h3>
        <small>
          <em>
            {movie?.release_date}, {movie?.runtime} minutes, Rated {movie?.mpaa_rating}
          </em>
        </small>
        <div className="mt-2">
          <p>{movie?.description}</p>
        </div>
      </div>
    </>
  )
}
