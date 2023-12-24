import { ReactNode, useEffect, useState } from "react"

import MovieModel from "../../models/Movie"
import MovieDto from "../../types/MovieDto"
import PageHeader from "../layout/PageHeader"
import MoviesTable from "../MoviesTable"

export default function Movies(): ReactNode {
  const [movies, setMovies] = useState<MovieModel[]>([])
  const [isFetchingMovies, setIsFetchingMovies] = useState(true)

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`/api/movies`, requestOptions)
      .then((response) => response.json())
      .then((data: MovieDto[]) => {
        const movies = data.map((movie) => {
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
      })
      .catch((err) => console.log(err))
      .finally(() => setIsFetchingMovies(false))
  }, [])

  return (
    <div>
      <PageHeader title="Movies" />
      {!isFetchingMovies && <MoviesTable movies={movies} urlTemplate="/movies" />}
    </div>
  )
}
