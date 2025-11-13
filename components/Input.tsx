import React from "react"

type InputProps = React.ComponentProps<"input">

export default function Input({...props}: InputProps){

  return(
    <input className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
    {...props} />
  )
}