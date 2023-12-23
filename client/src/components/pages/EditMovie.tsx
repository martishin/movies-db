import React, { ReactNode, useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import Genre from "../../models/Genre"
import Movie from "../../models/Movie"
import OutletContext from "../../state/OutletContext"
import GenreResponse from "../../types/GenreResponse"
import Checkbox from "../form/Checkbox"
import Input from "../form/Input"
import Select from "../form/Select"
import TextArea from "../form/TextArea"
import PageHeader from "../layout/PageHeader"

export default function EditMovie(): ReactNode {
  const navigate = useNavigate()
  const { jwtToken } = useOutletContext() as OutletContext

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState<string[]>([])

  const mpaaOptions = [
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
    { id: "18A", value: "18A" },
  ]

  const hasError = (key: string) => {
    return errors.indexOf(key) !== -1
  }

  const [movie, setMovie] = useState<Movie>({
    id: 0,
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    description: "",
    image: "",
    genres: [],
    genres_array: [],
  })

  // get id from the URL
  const { id } = useParams()

  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login")
      return
    }

    if (id === "0") {
      // adding a movie
      setMovie({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        image: "",
        genres: [],
        genres_array: [],
      })

      const headers = new Headers()
      headers.append("Content-Type", "application/json")

      const requestOptions = {
        method: "GET",
        headers: headers,
      }

      fetch("/api/genres", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const genres = data.map((g: GenreResponse) => new Genre(g.id, g.genre, false))

          setMovie((currentMovie) => ({
            ...currentMovie,
            genres: genres,
          }))
        })
        .catch((err) => console.log(err))
    } else {
      // editing an existing movie
    }
  }, [id, jwtToken, navigate])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value
    const name = event.target.name
    setMovie({
      ...movie,
      [name]: value,
    })
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const updatedGenres = movie.genres.map((genre, index) => {
      if (index === idx) {
        return { ...genre, checked: !genre.checked }
      }
      return genre
    })

    const updatedGenresArray = [...movie.genres_array]
    const genreId = parseInt(event.target.value, 10)
    if (event.target.checked) {
      updatedGenresArray.push(genreId)
    } else {
      updatedGenresArray.splice(updatedGenresArray.indexOf(genreId))
    }

    setMovie({
      ...movie,
      genres: updatedGenres,
      genres_array: updatedGenresArray,
    })
  }

  return (
    <div className="mb-3">
      <PageHeader title={id === "0" ? "Add Movie" : "Edit Movie"} />
      <pre className="text-left">{JSON.stringify(movie, null, 3)}</pre>

      <form className="max-w-l ml-auto mr-auto w-4/5" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={movie.id} id="id" />

        <Input
          title="Title"
          name="title"
          type="text"
          value={movie.title}
          onChange={handleChange}
          hasError={hasError("title")}
          errorMsg="Please enter a title"
        />

        <Input
          title="Release Date"
          name="release_date"
          type="date"
          value={movie.release_date}
          onChange={handleChange}
          hasError={hasError("release_date")}
          errorMsg="Please enter a release date"
        />

        <Input
          title="Runtime"
          name="runtime"
          type="text"
          value={movie.runtime}
          onChange={handleChange}
          hasError={hasError("runtime")}
          errorMsg="Please enter a runtime"
        />

        <Select
          title="MPAA Rating"
          name="mpaa_rating"
          value={movie.mpaa_rating}
          options={mpaaOptions}
          onChange={handleChange}
          placeHolder={"Choose..."}
          hasError={hasError("mpaa_rating")}
          errorMsg="Please choose MPAA rating"
        />

        <TextArea
          title="Description"
          name="description"
          value={movie.description}
          rows={3}
          onChange={handleChange}
          hasError={hasError("description")}
          errorMsg="Please enter a description"
        />

        <div className="mt-3">
          <h3 className="block text-center text-sm font-medium leading-6 text-gray-900">Genres</h3>
          <div className="grid gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movie.genres && movie.genres.length > 1 && (
              <>
                {movie.genres.map((g, idx) => (
                  <Checkbox
                    title={g.genre}
                    name="genre"
                    key={idx}
                    id={"genre-" + idx}
                    onChange={(event) => handleCheck(event, idx)}
                    value={g.id}
                    checked={g.checked}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
