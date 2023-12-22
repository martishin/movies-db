import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import MovieModel from "../../models/Movie"
import PageHeader from "../layout/PageHeader"

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
      .then((data) => {
        setMovies(data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsFetchingMovies(false))
  }, [])

  return (
    <div>
      <PageHeader title="Movies" />
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
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      to={`/movies/${m.id}`}
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
