import React from "react"

interface TextAreaProps {
  name: string
  title: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows: number
  hasError: boolean
  errorMsg: string
}

export default function TextArea(props: TextAreaProps) {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="block text-sm font-medium leading-6 text-gray-900">
        {props.title}
      </label>
      <div className="mt-2">
        <textarea
          className="block w-full rounded-md border border-gray-300 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          rows={props.rows}
        />
        {props.hasError && <p className="mt-2 text-sm text-red-600">{props.errorMsg}</p>}
      </div>
    </div>
  )
}
