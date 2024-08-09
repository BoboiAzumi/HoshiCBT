"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/navbar"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        document.location.href = "/dashboard/instructor"
                        break
                    case "user":
                        document.location.href = "/dashboard/user"
                        break
                    case "admin":
                        setUserData(json.data)
                        setLoad(!load)
                        break
                }
            })
    }, [])

    return (
    <>
        <Splash isLoad={load}></Splash>
        <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
            <UserData.Provider value={userData as Users}>
                <Navbar/>
            </UserData.Provider>
            <div className="w-full z-0">
                <div className="flex flex-col items-center">
                    <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Menu</h2>
                    <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                        <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                            <a href={"/dashboard/admin/admin"}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Admin
                                </h3>
                            </a>
                        </div>
                        <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                            <a href={"/dashboard/admin/instructor"}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Instructor
                                </h3>
                            </a>
                        </div>
                        <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                            <a href={"/dashboard/admin/user"}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    User
                                </h3>
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-flow-row-dense gap-2 grid-cols-3 mt-5">
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
