"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/navbar"
import { useParams } from "next/navigation"
import { Exam } from "@/app/api/[[...route]]/types/exam"

export default function ClassView() {
    const { classid } = useParams()
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [exam, setExam] = useState([] as Exam[])

    function loadClassList(){
        fetch("/api/user/class/"+classid)
            .then((r) => r.json())
            .then((json) => {
                setExam(json.data as Exam[])
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
                    <h2 className="mt-[10rem] mb-5 text-2xl font-semibold text-gray-600">Exam List</h2>
                    <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                        {exam.map((v: Exam) => (
                            <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/user/exam/"+classid+"/"+v._id} className="flex flex-col justify-center items-center min-h-[3rem]"> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        {v.exam_name}
                                    </h3>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
