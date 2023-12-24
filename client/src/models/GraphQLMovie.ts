export default class GraphQLMovie {
  id: number
  title: string
  release_date: string
  runtime: string
  mpaa_rating: string

  constructor(
    id: number,
    title: string,
    release_date: string,
    runtime: string,
    mpaa_rating: string,
  ) {
    this.id = id
    this.title = title
    this.release_date = release_date
    this.runtime = runtime
    this.mpaa_rating = mpaa_rating
  }
}
