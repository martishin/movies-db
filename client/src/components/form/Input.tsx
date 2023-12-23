import React from "react"

interface InputProps {
  title: string
  name: string
  type: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  hasError: boolean
  errorMsg: string
  autoComplete?: string
  placeholder?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <div className="mt-3">
      <label
        htmlFor={props.name}
        className="block text-center text-sm font-medium leading-6 text-gray-900"
      >
        {props.title}
      </label>
      <div className="mt-2">
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
          type={props.type}
          name={props.name}
          id={props.name}
          value={props.value}
          autoComplete={props.autoComplete}
          onChange={props.onChange}
          ref={ref}
          placeholder={props.placeholder}
        />
        {props.hasError && <p className="mt-2 text-sm text-red-600">{props.errorMsg}</p>}
      </div>
    </div>
  )
})

Input.displayName = "Input"

export default Input
