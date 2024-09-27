"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/UserNavbar"
import { ClassroomData } from "@/app/api/[[...route]]/types/class"
import { ClassroomDataList } from "@/context/ClassroomDataList"
import { FaArrowRightToBracket, FaBan } from "react-icons/fa6"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classrooms, setClassrooms] = useState([] as ClassroomData[])

    function loadClassList(){
        fetch("/api/user/", {
            method: "post",
            body: JSON.stringify({
                method: "GET_CLASSROOM"
            })
        })
            .then((r) => r.json())
            .then((json) => {
                setClassrooms(json.data as ClassroomData[])
            })
    }

    useEffect(() => {
        fetch("/api/auth/", {
            method: "post",
            body: JSON.stringify({
                method: "AUTHENTICATION"
            })
        })
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
            <div
                className={
                    "bg-white w-full min-h-[100vh]" + (load ? " hidden" : "")
                }
            >
                <UserData.Provider value={userData as Users}>
                    <ClassroomDataList.Provider value={classrooms}>
                        <Navbar />
                    </ClassroomDataList.Provider>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center w-full">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">
                            Classroom List
                        </h2>
                        <div className="grid grid-flow-row-dense gap-2 grid-cols-1 mt-5 w-[80vw] sm:w-auto">
                            {classrooms.length != 0 ? (
                                classrooms.map((v: ClassroomData) => (
                                    <div className="card bg-white border w-full md:min-w-[30rem] shadow-md">
                                        <div className="card-body">
                                            <div className="card-title text-gray-600">
                                                {v.classes.name}
                                            </div>
                                            <div className="card-actions justify-end">
                                                {v.is_blocked ? (
                                                    <a className="btn btn-disabled">
                                                        <FaBan />
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={
                                                            "/dashboard/user/class/" +
                                                            v.classes._id
                                                        }
                                                        className="btn"
                                                    >
                                                        <FaArrowRightToBracket />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h6 className="text-gray-600">
                                    No Classroom Found
                                </h6>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
