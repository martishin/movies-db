import { ReactNode, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"

import Movie from "../../models/Movie"
import MovieModel from "../../models/Movie"
import JsonResponse from "../../types/JsonResponse"
import MovieDto from "../../types/MovieDto"
import PageHeader from "../layout/PageHeader"
import MoviesTable from "../MoviesTable"

export default function Genre(): ReactNode {
  // get the prop passed to the component
  const location = useLocation()
  const [isFetchingMovies, setIsFetchingMovies] = useState(true)
  const { genreName } = location.state

  // set stateful variable
  const [movies, setMovies] = useState<Movie[]>([])

  // get the id from the url
  const { id } = useParams()

  // useEffect to get a list of movies
  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`/api/movies/genres/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ("error" in data) {
          const errorResponse = data as JsonResponse
          console.log(errorResponse.message)
        } else {
          const moviesResponse = data as MovieDto[]
          const movies = moviesResponse.map((movie) => {
            return new MovieModel(
              movie.id,
              movie.title,
              new Date(movie.release_date).toISOString().split("T")[0],
              String(movie.runtime),
              movie.mpaa_rating,
              movie.description,
              movie.image,
              movie.genres,
            )
          })

          setMovies(movies)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsFetchingMovies(false))
  }, [id])

  return (
    <div>
      <PageHeader title={`Genre: ${genreName}`} />
      {!isFetchingMovies && <MoviesTable movies={movies} urlTemplate="/movies" />}
    </div>
  )
}
