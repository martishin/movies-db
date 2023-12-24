import { Link } from "react-router-dom"

import Movie from "../models/Movie"

interface MoviesTableProps {
  movies: Movie[]
  urlTemplate: string
}

export default function MoviesTable({ movies, urlTemplate }: MoviesTableProps) {
  return (
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
                to={`${urlTemplate}/${m.id}`}
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
  )
}
