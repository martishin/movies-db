# MoviesDB
Website with information about movies, using *React.js* on the frontend and *Go* on the backend.   
You can explore existing movies on the [website](https://movies-db.martishin.com/) and even register and add a new movie to the Database 😃

<div>
  <img src="https://github.com/tty-monkey/movies-db/blob/main/screenshot-2.png" width="350" style="display: inline-block; margin-right: 10px;"/>
  <img src="https://github.com/tty-monkey/movies-db/blob/main/screenshot-1.png" width="342" style="display: inline-block;"/>
</div>

## 🚀 Running Locally
### Server
* Navigate to server folder: `cd server`
* Build the server with: `make build`
* Start a PostgreSQL database and the server: `make run`
* API will be available at http://localhost:8080/
### Client
* Navigate to client folder: `cd client`
* Install dependencies `npm install`
* Start the client `npm run dev`
* UI will be available at https://localhost:5173/

## ⚙️ Features
* User registration
* JWT authentication with a periodic token refresh
* Browsing a list of movies
* Viewing information for an individual movie
* Searching movies by genre
* Adding new movies
* Fetching the movie's poster image from TMDB
* Updating existing movies
* Deleting movies from the database
* Searching movies by title using GraphQL API
