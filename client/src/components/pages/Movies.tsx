import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Movie as MovieModel } from "../../models/Movie"

export default function Movies(): ReactNode {
  const [movies, setMovies] = useState<MovieModel[]>([])

  useEffect(() => {
    const moviesList = [
      new MovieModel(1, "Highlander", "1986-03-06", 116, "R", "Some long description"),
      new MovieModel(
        2,
        "Raiders of the Lost Ark",
        "1981-06-12",
        115,
        "PG-13",
        "Some long description",
      ),
    ]

    setMovies(moviesList)
  }, [])

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Movies</h2>
        <hr />
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
      </div>
    </>
  )
}
