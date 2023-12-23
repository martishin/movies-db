interface Option {
  id: string
  value: string
}

import { ChangeEvent } from "react"

interface SelectProps {
  name: string
  title: string
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  hasError: boolean
  errorMsg: string
  placeHolder: string
  options: Option[]
}

export default function Select(props: SelectProps) {
  return (
    <div className="mt-3">
      <label
        htmlFor={props.name}
        className="block text-center text-sm font-medium leading-6 text-gray-900"
      >
        {props.title}
      </label>
      <div className="mt-2">
        <select
          className="block w-full rounded-md border border-gray-300 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          name={props.name}
          id={props.name}
          value={props.value}
          onChange={props.onChange}
        >
          <option value="">{props.placeHolder}</option>
          {props.options.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.value}
              </option>
            )
          })}
        </select>
        {props.hasError && <p className="mt-2 text-sm text-red-600">{props.errorMsg}</p>}
      </div>
    </div>
  )
}
