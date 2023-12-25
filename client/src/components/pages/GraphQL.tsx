import React, { ReactNode, useEffect, useState } from "react"

import GraphQLMovie from "../../models/GraphQLMovie"
import GraphQLMovieResponse from "../../types/GraphQLMovieResponse"
import Search from "../form/Search"
import PageHeader from "../layout/PageHeader"
import MoviesTable from "../MoviesTable"

export default function GraphQL(): ReactNode {
  // set up stateful variables
  const [movies, setMovies] = useState<GraphQLMovie[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [fullMoviesList, setFullMoviesList] = useState<GraphQLMovie[]>([])

  // perform a search
  const performSearh = (searchTerm: string) => {
    console.log(searchTerm)
    const payload = `
      {
        search(titleContains: "${searchTerm}") {
          id
          title 
          runtime
          release_date
          mpaa_rating
        }
      }
    `

    const headers = new Headers()
    headers.append("Content-Type", "application/graphql")

    const requestOptions = {
      method: "POST",
      body: payload,
      headers: headers,
    }

    fetch("/api/graph", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.data.search.map((movie: GraphQLMovieResponse) => {
          return new GraphQLMovie(
            movie.id,
            movie.title,
            new Date(movie.release_date).toISOString().split("T")[0],
            String(movie.runtime),
            movie.mpaa_rating,
          )
        })
        setMovies(movies)
      })
      .catch((error) => console.log(error))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const value = event.target.value
    setSearchTerm(value)

    if (value.length > 0) {
      performSearh(value)
    } else {
      setMovies(fullMoviesList)
    }
  }

  // useEffect
  useEffect(() => {
    const payload = `
      {
        list {
          id
          title 
          runtime
          release_date
          mpaa_rating
        }
      }
    `

    const headers = new Headers()
    headers.append("Content-Type", "application/graphql")
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: payload,
    }

    fetch("/api/graph", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const movies = data.data.list.map((movie: GraphQLMovieResponse) => {
          return new GraphQLMovie(
            movie.id,
            movie.title,
            new Date(movie.release_date).toISOString().split("T")[0],
            String(movie.runtime),
            movie.mpaa_rating,
          )
        })
        setMovies(movies)
        setFullMoviesList(movies)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <div>
      <PageHeader title="GraphQL" />
      <div>
        {movies ? (
          <div>
            <Search
              searchTerm={searchTerm}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            <div className="mt-2">
              <MoviesTable movies={movies} urlTemplate="/movies" />
            </div>
          </div>
        ) : (
          <div className="mt-3 w-full">
            <p className="text-l ml-auto mr-auto w-fit text-gray-900">No movies (yet)!</p>
          </div>
        )}
      </div>
    </div>
  )
}
