import Genre from "../models/Genre"

export default interface MovieRequest {
  id: number
  title: string
  release_date: string
  runtime: number
  mpaa_rating: string
  description: string
  image: string
  genres: Genre[]
  genres_array: number[]
}
