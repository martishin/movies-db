import React from "react"

interface InputProps {
  title: string
  name: string
  type: string
  autoComplete: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <div className="mb-6">
      <label htmlFor={props.name} className="text-l mb-2 block text-left font-medium text-gray-900">
        {props.title}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        autoComplete={props.autoComplete}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5
          text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        onChange={props.onChange}
        ref={ref}
      ></input>
    </div>
  )
})

Input.displayName = "Input"

export default Input
