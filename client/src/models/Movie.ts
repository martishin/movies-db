import Genre from "./Genre"

export default class Movie {
  id: number
  title: string
  release_date: string
  runtime: string
  mpaa_rating: string
  description: string
  image: string
  genres: Genre[]
  genres_array: number[]

  constructor(
    id: number,
    title: string,
    release_date: string,
    runtime: string,
    mpaa_rating: string,
    description: string,
    image: string = "",
    genres: Genre[] = [],
    genres_array: number[] = [],
  ) {
    this.id = id
    this.title = title
    this.release_date = release_date
    this.runtime = runtime
    this.mpaa_rating = mpaa_rating
    this.description = description
    this.image = image
    this.genres = genres
    this.genres_array = genres_array
  }
}
