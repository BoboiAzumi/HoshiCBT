"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/InstructorNavbar"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { ClassroomList } from "@/context/ClassroomList"
import { FaArrowRightToBracket, FaCirclePlus } from "react-icons/fa6"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classrooms, setClassrooms] = useState([] as Classroom[])

    function loadClassList(){
        fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "GET_ALL_CLASSROOM"
            })
        })
            .then((r) => r.json())
            .then((json) => {
                setClassrooms(json.data as Classroom[])
                console.log(classrooms)
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
            <div
                className={
                    "bg-white w-full min-h-[100vh]" + (load ? " hidden" : "")
                }
            >
                <UserData.Provider value={userData as Users}>
                    <ClassroomList.Provider value={classrooms}>
                        <Navbar />
                    </ClassroomList.Provider>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center w-full">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">
                            Classroom List
                        </h2>
                        <div className="grid grid-flow-col-dense grid-cols-1 w-[80vw] sm:w-auto">
                            <a
                                href={"/dashboard/instructor/class/add"}
                                className="btn"
                            >
                                <FaCirclePlus />
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Add Classroom
                                </h3>
                            </a>
                        </div>
                        <div className="grid grid-flow-row-dense gap-2 grid-cols-1 mt-5 w-[80vw] sm:w-auto">
                            {classrooms.length != 0 ? (
                                classrooms.map((v: Classroom) => (
                                    <div className="card bg-white border w-full md:min-w-[30rem] shadow-md">
                                        <div className="card-body">
                                            <div className="card-title text-gray-600">
                                                {v.name}
                                            </div>
                                            <div className="card-actions justify-end">
                                                <a
                                                    href={
                                                        "/dashboard/instructor/class/" +
                                                        v._id
                                                    }
                                                    className="btn"
                                                >
                                                    <FaArrowRightToBracket />
                                                </a>
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
