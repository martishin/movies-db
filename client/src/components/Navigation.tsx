import { NavLink } from "react-router-dom"

export default function Navigation() {
  return (
    <div className="ml-4 mr-4">
      <nav aria-label="Main navigation">
        <ul className="w-48 border border-gray-200 bg-white text-gray-900">
          {[
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
                className={({ isActive }) =>
                  `block border-b border-gray-200 px-4 py-2 text-sm font-medium ${
                    isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 hover:text-blue-700"
                  }`
                }
              >
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
