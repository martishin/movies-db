import { ReactNode, useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

import MovieModel from "../../models/Movie"
import OutletContext from "../../state/OutletContext"
import MovieDto from "../../types/MovieDto"
import PageHeader from "../layout/PageHeader"
import MoviesTable from "../MoviesTable"

export default function ManageCatalogue(): ReactNode {
  const [movies, setMovies] = useState<MovieModel[]>([])
  const { jwtToken } = useOutletContext() as OutletContext
  const navigate = useNavigate()
  const [isFetchingMovies, setIsFetchingMovies] = useState(true)

  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login")
      return
    }

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    headers.append("Authorization", "Bearer " + jwtToken)

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`/api/admin/movies`, requestOptions)
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
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsFetchingMovies(false))
  }, [jwtToken, navigate])

  return (
    <div>
      <PageHeader title="Manage Catalogue" />
      {!isFetchingMovies && <MoviesTable movies={movies} urlTemplate="/admin/movie" />}
    </div>
  )
}
