import { NavLink } from "react-router-dom"

interface NavigationProps {
  jwtToken: string
}

export default function Navigation({ jwtToken }: NavigationProps) {
  const commonLinks = [
    ["Home", "/"],
    ["Movies", "/movies"],
    ["Genres", "/genres"],
    ["GraphQL", "/graphql"],
  ]

  const loggedInLinks = [
    ["Add a movie", "/admin/movie/0"],
    ["Manage Catalogue", "/manage-catalogue"],
  ]

  const links = jwtToken !== "" ? [...commonLinks, ...loggedInLinks] : commonLinks

  return (
    <div className="ml-4 mr-4">
      <nav aria-label="Main navigation">
        <ul className="border-x border-t border-gray-200 bg-white text-gray-900">
          {links.map(([title, path]) => (
            <li key={title}>
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
