import { ReactNode, useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

import { Movie as MovieModel } from "../../models/Movie"
import OutletContext from "../../state/OutletContext"

export default function ManageCatalogue(): ReactNode {
  const [movies, setMovies] = useState<MovieModel[]>([])
  const { jwtToken } = useOutletContext() as OutletContext
  const navigate = useNavigate()

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

    fetch(`api/admin/movies`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [jwtToken, navigate])

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Manage Catalogue</h2>
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
                      to={`/admin/movies/${m.id}`}
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
