import React, { ReactNode, useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Swal from "sweetalert2"

import Genre from "../../models/Genre"
import Movie from "../../models/Movie"
import OutletContext from "../../state/OutletContext"
import EditMovieResponse from "../../types/EditMovieResponse"
import GenreDto from "../../types/GenreDto"
import JsonResponse from "../../types/JsonResponse"
import MovieDto from "../../types/MovieDto"
import Checkbox from "../form/Checkbox"
import Input from "../form/Input"
import Select from "../form/Select"
import TextArea from "../form/TextArea"
import PageHeader from "../layout/PageHeader"

export default function EditMovie(): ReactNode {
  const navigate = useNavigate()
  const { jwtToken } = useOutletContext() as OutletContext

  const [error, setError] = useState<string | null>(null)
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
      setErrors([])

      const headers = new Headers()
      headers.append("Content-Type", "application/json")

      const requestOptions = {
        method: "GET",
        headers: headers,
      }

      fetch("/api/genres", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const genres = data.map((g: GenreDto) => new Genre(g.id, g.genre, false))

          setMovie((currentMovie) => ({
            ...currentMovie,
            genres: genres,
          }))
        })
        .catch((err) => console.log(err))
    } else {
      // editing an existing movie
      const headers = new Headers()
      headers.append("Content-Type", "application/json")
      headers.append("Authorization", `Bearer ${jwtToken}`)

      const requestOptions = {
        method: "GET",
        headers: headers,
      }

      fetch(`/api/admin/movies/${id}`, requestOptions)
        .then((response) => {
          if (response.status !== 200) {
            setError("Cannot fetch a movie")
          }
          return response.json()
        })
        .then((data: EditMovieResponse) => {
          // fix release date
          data.movie.release_date = new Date(data.movie.release_date).toISOString().split("T")[0]

          const checks: Genre[] = []

          data.genres.forEach((g: GenreDto) => {
            if (data.movie.genres_array.indexOf(g.id) !== -1) {
              checks.push(new Genre(g.id, g.genre, true))
            } else {
              checks.push(new Genre(g.id, g.genre, false))
            }
          })

          // set state
          setMovie({
            ...data.movie,
            runtime: String(data.movie.runtime),
            genres: checks,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [id, jwtToken, navigate])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault()

    const errors: string[] = []
    const required = [
      { field: movie.title, name: "title" },
      { field: movie.release_date, name: "release_date" },
      { field: movie.runtime, name: "runtime" },
      { field: movie.description, name: "description" },
      { field: movie.mpaa_rating, name: "mpaa_rating" },
    ]

    required.forEach((obj) => {
      if (obj.field === "") {
        errors.push(obj.name)
      }
    })

    if (movie.genres_array.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "You must choose at least one genre!",
        icon: "error",
        confirmButtonText: "OK",
      })
      errors.push("genres")
    }

    setErrors(errors)

    if (errors.length > 0) {
      return false
    }

    const headers = new Headers()
    headers.append("Content-type", "application/json")
    headers.append("Authorization", `Bearer ${jwtToken}`)

    // addina a new movie
    const method = movie.id === 0 ? "POST" : "PATCH"
    // we need to convert the values in JSON for release date (to date)
    // and for runtime to int
    const requestBody: MovieDto = {
      ...movie,
      runtime: parseInt(movie.runtime, 10),
      release_date: new Date(movie.release_date).toISOString(),
    }

    const requestOptions: RequestInit = {
      body: JSON.stringify(requestBody),
      method: method,
      headers: headers,
      credentials: "include",
    }

    fetch(`/api/admin/movies/${movie.id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          navigate("/manage-catalogue")
        }
      })
      .catch((err) => console.log(err))

    return true
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

    let updatedGenresArray = [...movie.genres_array]
    const genreId = parseInt(event.target.value, 10)
    if (event.target.checked) {
      updatedGenresArray.push(genreId)
    } else {
      updatedGenresArray = updatedGenresArray.filter((id) => id !== genreId)
    }

    setMovie({
      ...movie,
      genres: updatedGenres,
      genres_array: updatedGenresArray,
    })
  }

  const confirmDelete = () => {
    Swal.fire({
      title: "Delete the movie?",
      text: "You cannot undo this action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#2563EB",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = new Headers()
        headers.append("Authorization", `Bearer ${jwtToken}`)

        const requestOptions = {
          method: "DELETE",
          headers: headers,
        }

        fetch(`/api/admin/movies/${id}`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            const jsonResponse = data as JsonResponse
            if (jsonResponse.error) {
              console.log(jsonResponse.error)
            } else {
              navigate("/manage-catalogue")
            }
          })
          .catch((err) => console.log(err))
      }
    })
  }

  return (
    <div className="mb-6">
      <PageHeader title={id === "0" ? "Add Movie" : "Edit Movie"} />
      {/*<pre className="text-left">{JSON.stringify(movie, null, 3)}</pre>*/}

      {error === null ? (
        <form className="ml-auto mr-auto w-5/6 max-w-lg" onSubmit={handleSubmit}>
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
            <h3 className="block text-center text-sm font-medium leading-6 text-gray-900">
              Genres
            </h3>
            <div className="grid gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movie.genres && movie.genres.length > 0 && (
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

          <div className="mt-6 flex justify-end">
            {id !== "0" && (
              <a
                href="#!"
                onClick={confirmDelete}
                className="mr-2 flex w-28 justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-800 focus-visible:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Delete
              </a>
            )}
            <input
              type="submit"
              className="w-28 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              value="Save"
            />
          </div>
        </form>
      ) : (
        <div className="mt-3 w-full">
          <p className="text-l ml-auto mr-auto w-fit text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
