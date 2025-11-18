"use client"
import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login")
    }
  }
  )
  return (
    <>
      {children}
    </>
  )
}