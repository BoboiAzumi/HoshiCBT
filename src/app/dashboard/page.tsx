"use client"
import Splash from "@/components/splash"
import { useEffect } from "react"

export default function DashboardSpinner(){
    useEffect(() => {
        fetch("/api/auth/", {
            method: "post",
            body: JSON.stringify({
                method: "AUTHENTICATION"
            })
        }).then((r) => r.json())
        .then((json) => {
            if(json.status != "OK") document.location.href = "./signin"
            switch(json.data.role){
                case "user":
                    document.location.href = "/dashboard/user"
                    break;
                case "instructor":
                    document.location.href = "/dashboard/instructor"
                    break;
                case "admin":
                    document.location.href = "/dashboard/admin"
                    break;
            }
        })
    })

    return (
        <Splash isLoad={true}></Splash>
    )
}