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
      <label
        htmlFor={props.name}
        className="text-left block mb-2 text-l font-medium text-gray-900"
      >
        {props.title}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.name}
        autoComplete={props.autoComplete}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={props.onChange}
        ref={ref}
      ></input>
    </div>
  )
})

export default Input
