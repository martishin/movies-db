import { NavLink, Outlet } from "react-router-dom"
import Header from "./Header.tsx"

export default function App() {
  return (
    <div className="container mx-auto mt-8">
      <Header />
      <div className="flex flex-wrap mt-4">
        <div className="md:w-1/4 lg:w-1/5 pr-4 pl-4">
          <nav aria-label="Main navigation">
            <ul className="w-48 text-gray-900 bg-white border border-gray-200">
              {
                [
                  ["Home", "/"],
                  ["Movies", "/movies"],
                  ["Genres", "/genres"],
                  ["Add a movie", "/admin/movie/0"],
                  ["Manage Catalogue", "/manage-catalogue"],
                  ["GraphQL", "/graphql"],
                ].map(([title, path], index) => (
                  <li key={index}>
                    <NavLink
                      to={path}
                      className={({ isActive }) => `block px-4 py-2 text-sm font-medium border-b border-gray-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-100 hover:text-blue-700"
                      }`}
                    >
                      {title}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        <div className="md:w-4/5 pr-4 pl-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
