import { useState } from "react"

interface AppProps {
  title: string
}

function App({ title }: AppProps) {
  const [isTrue, setIsTrue] = useState(true)

  const toggleTrue = () => {
    setIsTrue(!isTrue)
  }

  return (
    <div className="text-center">
      <h1 className="text-xl text-red-600">{title}</h1>
      <hr />
      {isTrue ? (
        <p>The current value of isTrue is true</p>
      ) : (
        <p>The current value of isTrue is false</p>
      )}
      <hr />
      <a
        href="#!"
        className="mb-2 me-2 mt-2 inline-block rounded-lg bg-blue-700 px-5 py-2.5 text-sm
          font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4
          focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700
          dark:focus:ring-blue-800"
        onClick={toggleTrue}
      >
        Toggle isTrue
      </a>
    </div>
  )
}

export default App
