import React, { forwardRef } from "react"

interface LoginInputProps {
  title: string
  name: string
  type: string
  autoComplete: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  hasError?: boolean
  errorMsg?: string
}

const LoginInput = forwardRef<HTMLInputElement, LoginInputProps>((props, ref) => {
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
          id={props.name}
          name={props.name}
          type={props.type}
          autoComplete={props.autoComplete}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          ref={ref}
          onChange={props.onChange}
        />
        {props.hasError && <p className="mt-2 text-sm text-red-600">{props.errorMsg}</p>}
      </div>
    </div>
  )
})

LoginInput.displayName = "LoginInput"

export default LoginInput
