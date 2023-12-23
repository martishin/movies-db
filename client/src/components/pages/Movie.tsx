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
          new Date(data.release_date).toISOString().split("T")[0],
          data.runtime,
          data.mpaa_rating,
          data.description,
          data.image,
          data.genres,
        )
        setMovie(movieData)
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsFetchingMovie(false)
      })
  }, [id])

  return (
    <div>
      <PageHeader title="Movie" />
      {!isFetchingMovie && (
        <div className="mt-2 flex text-left">
          {movie?.image !== "" && (
            <div className="mr-4 flex-shrink-0">
              <img src={`https://image.tmdb.org/t/p/w200/${movie?.image}`} alt="poster" />
            </div>
          )}
          <div>
            <div>
              <h3 className="text-l font-bold tracking-tight"> {movie?.title}</h3>
              <small>
                <em>
                  {movie?.release_date}, {movie?.runtime} minutes, Rated {movie?.mpaa_rating}
                </em>
              </small>
            </div>
            <div>
              {movie?.genres.map((g) => (
                <span
                  key={g.genre}
                  className="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                >
                  {g.genre}
                </span>
              ))}
            </div>
            <div className="mt-2">
              <p>{movie?.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
