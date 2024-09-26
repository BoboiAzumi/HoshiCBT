"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/AdminNavbar"
import { Classroom } from "@/app/api/[[...route]]/types/class"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classes, setClasses] = useState([] as Classroom[])

    function loadClassList(){
        fetch("/api/instructor/class/")
            .then((r) => r.json())
            .then((json) => {
                setClasses(json.data as Classroom[])
                console.log(classes)
            })
    }

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        setUserData(json.data)
                        setLoad(!load)
                        break
                    case "user":
                        document.location.href = "/dashboard/user"
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
                    <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Classroom List</h2>
                    <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                        <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                            <a href={"/dashboard/instructor/class/add"}> 
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Add Classroom
                                </h3>
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-flow-row-dense gap-2 grid-cols-3 mt-5">
                        {classes.length != 0 ? classes.map((v: Classroom) => (
                            <div className="flex flex-col justify-center items-center border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+v._id}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        {v.name}
                                    </h3>
                                </a>
                            </div>
                        )) : (<h6 className="text-gray-600">No Classroom Found</h6>)}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
