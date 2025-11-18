"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/home")
      return
    }
    router.push("/login")
  }, [])
  return (
    <div></div>
  );
}
