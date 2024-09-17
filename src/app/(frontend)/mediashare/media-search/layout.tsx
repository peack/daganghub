import React from "react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto p-1 sm:max-w-5xl sm:px-6 lg:px-8">{children}</div>
  )
}
