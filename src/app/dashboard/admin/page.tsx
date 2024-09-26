"use client"
import {useEffect, useState} from "react"
import { Users } from "@/app/api/[[...route]]/types/user"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import Navbar from "@/components/AdminNavbar"
import { FaArrowRightToBracket } from "react-icons/fa6"

export default function UserDashboard() {
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)

    useEffect(() => {
        fetch("/api/auth/", {
            method: "post",
            body: JSON.stringify({
                method: "AUTHENTICATION",
            }),
        })
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin";
                switch (json.data.role) {
                    case "instructor":
                        document.location.href = "/dashboard/instructor";
                        break;
                    case "user":
                        document.location.href = "/dashboard/user";
                        break;
                    case "admin":
                        setUserData(json.data);
                        setLoad(!load);
                        break;
                }
            });
    }, [])

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div
                className={
                    "bg-white w-full min-h-[100vh]" + (load ? " hidden" : "")
                }
            >
                <UserData.Provider value={userData as Users}>
                    <Navbar />
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">
                            Menu
                        </h2>
                        <div className="grid grid-flow-row-dense gap-2 grid-cols-1">
                            <div className="card bg-white border w-full md:min-w-[30rem] shadow-sm">
                                <div className="card-body">
                                    <div className="card-title text-gray-600">
                                        Admin
                                    </div>
                                    <p className="text-gray-600">Menu untuk menampilkan, menambah, megubah dan menghapus daftar Admin</p>
                                    <div className="card-actions justify-end">
                                        <a href={"/dashboard/admin/admin"} className="btn">
                                            <FaArrowRightToBracket />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-white border w-full md:min-w-[30rem] shadow-sm">
                                <div className="card-body">
                                    <div className="card-title text-gray-600">
                                        Instructor
                                    </div>
                                    <p className="text-gray-600">Menu untuk menampilkan, menambah, megubah dan menghapus daftar Instructor</p>
                                    <div className="card-actions justify-end">
                                        <a href={"/dashboard/admin/instructor"} className="btn">
                                            <FaArrowRightToBracket />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card bg-white border w-full md:min-w-[30rem] shadow-sm">
                                <div className="card-body">
                                    <div className="card-title text-gray-600">
                                        User
                                    </div>
                                    <p className="text-gray-600">Menu untuk menampilkan, menambah, megubah dan menghapus daftar User Ujian</p>
                                    <div className="card-actions justify-end">
                                        <a href={"/dashboard/admin/user"} className="btn">
                                            <FaArrowRightToBracket />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-flow-row-dense gap-2 grid-cols-3 mt-5"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
