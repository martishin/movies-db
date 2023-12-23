import { ReactNode, useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

import MovieModel from "../../models/Movie"
import OutletContext from "../../state/OutletContext"
import MovieDto from "../../types/MovieDto"
import PageHeader from "../layout/PageHeader"

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
      {!isFetchingMovies && (
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
            <thead className="text-xs uppercase text-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Movie
                </th>
                <th scope="col" className="px-6 py-3">
                  Release Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {movies.map((m) => (
                <tr key={m.id} className="bg-white">
                  <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    <Link
                      className="font-medium text-blue-700 hover:underline"
                      to={`/admin/movie/${m.id}`}
                    >
                      {m.title}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{m.release_date}</td>
                  <td className="px-6 py-4">{m.mpaa_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
