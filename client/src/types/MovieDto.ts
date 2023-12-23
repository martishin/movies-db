import GenreDto from "./GenreDto"

export default interface MovieDto {
  id: number
  title: string
  release_date: string
  runtime: number
  mpaa_rating: string
  description: string
  image: string
  genres: GenreDto[]
  genres_array: number[]
}
