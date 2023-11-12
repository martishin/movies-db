import { fireEvent, render, screen } from "@testing-library/react"
import App from "../App"

describe("App component", () => {
  test("renders the title passed to it", () => {
    render(<App title="Test Title" />)
    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })

  test("initially shows isTrue is true", () => {
    render(<App title="Test Title" />)
    expect(
      screen.getByText("The current value of isTrue is true"),
    ).toBeInTheDocument()
  })

  test("changes the value of isTrue on button click", () => {
    render(<App title="Test Title" />)
    fireEvent.click(screen.getByText("Toggle isTrue"))
    expect(
      screen.getByText("The current value of isTrue is false"),
    ).toBeInTheDocument()
  })
})
