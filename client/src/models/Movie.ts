export class Movie {
  id: number
  title: string
  release_date: string
  runtime: number
  mpaa_rating: string
  description: string

  constructor(
    id: number,
    title: string,
    release_date: string,
    runtime: number,
    mpaa_rating: string,
    description: string,
  ) {
    this.id = id
    this.title = title
    this.release_date = release_date
    this.runtime = runtime
    this.mpaa_rating = mpaa_rating
    this.description = description
  }
}
