import React, { ReactNode, useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"

import OutletContext from "../../state/OutletContext"
import Input from "../form/Input"
import Select from "../form/Select"
import TextArea from "../form/TextArea"

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

  const [movie, setMovie] = useState({
    id: 0,
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    description: "",
  })

  // get id from the URL
  const { id } = useParams()

  useEffect(() => {
    if (jwtToken === "") {
      navigate("/login")
      return
    }
  }, [jwtToken, navigate])

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

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">
          {id === "0" ? "Add Movie" : "Edit Movie"}
        </h2>
        <hr />
        <pre className="text-left">{JSON.stringify(movie, null, 3)}</pre>

        <form className="max-w-l ml-auto mr-auto mt-3 w-4/5" onSubmit={handleSubmit}>
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
        </form>
      </div>
    </>
  )
}
