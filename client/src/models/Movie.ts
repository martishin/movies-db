import Genre from "./Genre"

export default class Movie {
  id: number
  title: string
  release_date: string
  runtime: number
  mpaa_rating: string
  description: string
  genres: Genre[]

  constructor(
    id: number,
    title: string,
    release_date: string,
    runtime: number,
    mpaa_rating: string,
    description: string,
    genres: Genre[] = [],
  ) {
    this.id = id
    this.title = title
    this.release_date = release_date
    this.runtime = runtime
    this.mpaa_rating = mpaa_rating
    this.description = description
    this.genres = genres
  }
}
