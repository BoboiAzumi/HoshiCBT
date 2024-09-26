"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/AdminNavbar"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classes, setClasses] = useState([] as ClassroomData[])

    function loadClassList(){
        fetch("/api/user/class/")
            .then((r) => r.json())
            .then((json) => {
                setClasses(json.data as ClassroomData[])
            })
    }

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "user":
                        setUserData(json.data)
                        setLoad(!load)
                        break
                    case "instructor":
                        document.location.href = "/dashboard/instructor"
                        break
                    case "admin":
                        document.location.href = "/dashboard/admin"
                        break
                }
            })
    }, [])

    useEffect(() => {
        loadClassList()
    }, [load])

    return (
    <>
        <Splash isLoad={load}></Splash>
        <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
            <UserData.Provider value={userData as Users}>
                <Navbar/>
            </UserData.Provider>
            <div className="w-full z-0">
                <div className="flex flex-col items-center">
                    <h2 className="mt-[10rem] mb-5 text-2xl font-semibold text-gray-600">Classroom List</h2>
                    <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                        {classes.map((v: ClassroomData) => (
                            <div className="flex flex-col justify-center items-center border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                {v.is_blocked? (
                                    <h3 className="text-center text-red-600 font-semibold">
                                        {v.classes.name}
                                    </h3>
                                ): (
                                    <a href={"/dashboard/user/class/"+v.classes._id}> 
                                        <h3 className="text-center text-gray-600 font-semibold">
                                            {v.classes.name}
                                        </h3>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
