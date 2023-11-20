import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./components/App.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ErrorPage from "./components/ErrorPage.tsx"
import Home from "./components/Home.tsx"
import Movies from "./components/Movies.tsx"
import Genres from "./components/Genres.tsx"
import EditMovie from "./components/EditMovie.tsx"
import ManageCatalogue from "./components/ManageCatalogue.tsx"
import GraphQL from "./components/GraphQL.tsx"
import Login from "./components/Login.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/movies", element: <Movies /> },
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
