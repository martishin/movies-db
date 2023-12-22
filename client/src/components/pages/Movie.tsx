import { ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import MovieModel from "../../models/Movie"
import PageHeader from "../layout/PageHeader"

export default function Movie(): ReactNode {
  const [movie, setMovie] = useState<MovieModel>()
  const { id } = useParams()
  const [isFetchingMovie, setIsFetchingMovie] = useState(true)

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`/api/movies/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const movieData = new MovieModel(
          data.id,
          data.title,
          data.release_date,
          data.runtime,
          data.mpaa_rating,
          data.description,
          data.genres,
        )
        setMovie(movieData)
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsFetchingMovie(false)
      })
  }, [id])

  console.log(movie)

  return (
    <div>
      <PageHeader title="Movie" />
      {!isFetchingMovie && (
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
      )}
    </div>
  )
}
