"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useEffect, useState } from "react";

export default function AllowPage(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [users, setUsers] = useState([])
    let [modalAdd, setModalAdd] = useState(false)

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
    
    return (
        <>
            <Splash isLoad={load}></Splash>
            <Modal show={modalAdd} setShow={setModalAdd} className="bg-white w-[30rem] rounded-md px-5 py-4">
                <p>Hello World</p>
            </Modal>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Allow Users List</h2>
                        <div className="w-[30rem]">
                            <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2" onClick={(ev) => setModalAdd(true)}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Add Users
                                </h3>
                            </button>
                            <table className="my-5 rounded-md w-full border border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-gray-600 border py-2 px-2">No</th>
                                        <th className="text-gray-600 border py-2 px-2">User Participant</th>
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