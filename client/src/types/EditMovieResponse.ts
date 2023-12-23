import GenreDto from "./GenreDto"
import MovieDto from "./MovieDto"

export default interface EditMovieResponse {
  movie: MovieDto
  genres: GenreDto[]
}
