import { fireEvent, render, screen } from "@testing-library/react"

import Form from "../components/form/Form"

describe("Form component", () => {
  test("renders the title passed to it", () => {
    render(<Form title="Test Title" />)
    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })

  test("initially shows isTrue is true", () => {
    render(<Form title="Test Title" />)
    expect(screen.getByText("The current value of isTrue is true")).toBeInTheDocument()
  })

  test("changes the value of isTrue on button click", () => {
    render(<Form title="Test Title" />)
    fireEvent.click(screen.getByText("Toggle isTrue"))
    expect(screen.getByText("The current value of isTrue is false")).toBeInTheDocument()
  })
})
