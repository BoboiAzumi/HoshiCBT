"use client"
import Splash from "@/components/splash"
import { useEffect } from "react"

export default function DashboardSpinner(){
    useEffect(() => {
        fetch("/api/auth/", {
            method: "delete"
        }).then((r) => r.json())
        .then((json) => {
            document.location.href = "/signin"
        })
    })

    return (
        <Splash isLoad={true}></Splash>
    )
}