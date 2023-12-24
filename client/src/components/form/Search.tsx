import React, { ReactNode } from "react"

interface SearchProps {
  searchTerm: string
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function Search({ searchTerm, handleChange, handleSubmit }: SearchProps): ReactNode {
  return (
    <div className="mt-3 px-6">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <label htmlFor="search" className="sr-only mb-2 text-sm font-medium text-gray-900">
          Search
        </label>
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="search"
          className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-20 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search Movies..."
          value={searchTerm}
          onChange={handleChange}
        />
        <input
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none"
          value="Search"
        />
      </form>
    </div>
  )
}
