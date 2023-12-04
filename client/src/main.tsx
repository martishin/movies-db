import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import App from "./components/App.tsx"
import EditMovie from "./components/EditMovie.tsx"
import ErrorPage from "./components/ErrorPage.tsx"
import Genres from "./components/Genres.tsx"
import GraphQL from "./components/GraphQL.tsx"
import Home from "./components/Home.tsx"
import Login from "./components/Login.tsx"
import ManageCatalogue from "./components/ManageCatalogue.tsx"
import Movie from "./components/Movie.tsx"
import Movies from "./components/Movies.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/movies", element: <Movies /> },
      { path: "/movies/:id", element: <Movie /> },
      { path: "/genres", element: <Genres /> },
      { path: "/admin/movie/0", element: <EditMovie /> },
      { path: "/manage-catalogue", element: <ManageCatalogue /> },
      { path: "/graphql", element: <GraphQL /> },
      { path: "/login", element: <Login /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
