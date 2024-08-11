"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useEffect, useState } from "react";

export default function AdminEditorPage(){
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
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Admin List</h2>
                        <div className="w-[50rem]">
                        <table className="my-5 rounded-md w-full border border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-gray-600 border py-2 px-2">Username</th>
                                        <th className="text-gray-600 border py-2 px-2">Fullname</th>
                                        <th className="text-gray-600 border py-2 px-2">Email</th>
                                        <th className="text-gray-600 border py-2 px-2">Action</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}