import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import Genre from "../../models/Genre"
import PageHeader from "../layout/PageHeader"

export default function Genres(): ReactNode {
  const [genres, setGenres] = useState<Genre[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const headers = new Headers()
    headers.append("Content-type", "application/json")

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch("/api/genres", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if ("error" in data) {
          setError("Cannot fetch genres")
        } else {
          setGenres(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  console.log(genres)

  return (
    <div>
      <PageHeader title="Genres" />
      {error === null ? (
        <div className="divide-y divide-gray-200 border-b border-gray-200">
          {genres.map((genre: Genre) => (
            <div
              key={genre.id}
              className="relative flex min-w-0 flex-1 items-start px-6 py-3 text-sm leading-6"
            >
              <Link
                className="font-medium text-blue-700 hover:underline"
                to={`/genres/${genre.id}`}
                state={{
                  genreName: genre.genre,
                }}
              >
                {genre.genre}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 w-full">
          <p className="text-l ml-auto mr-auto w-fit text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
