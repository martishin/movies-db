import React from "react"

interface CheckboxProps {
  name: string
  title: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  checked: boolean
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div className="mb-3">
      <input
        id={props.name}
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
        type="checkbox"
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
      />
      <label htmlFor={props.name} className="text-l ms-2 block font-medium text-gray-900">
        {props.title}
      </label>
    </div>
  )
}
