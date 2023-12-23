import React from "react"

interface CheckboxProps {
  id: string
  name: string
  title: string
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  checked: boolean
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div className="mt-3 space-x-2">
      <input
        id={props.id}
        type="checkbox"
        value={props.value}
        name={props.name}
        onChange={props.onChange}
        checked={props.checked}
        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
      />
      <label htmlFor={props.id} className="ml-3 text-sm font-medium text-gray-900">
        {props.title}
      </label>
    </div>
  )
}
