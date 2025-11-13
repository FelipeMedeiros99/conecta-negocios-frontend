import React, { useId } from "react"

type InputProps = React.ComponentProps<"input"> & {
  label?: string
}

export default function Input({ label, ...props }: InputProps) {

  const id = useId()

  return (
    <div className="w-full">
      {label &&
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      }

      <input id={id} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        {...props} />
    </div>
  )
}