"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/InstructorNavbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClassroomList } from "@/context/ClassroomList"
import { Classroom } from "@/app/api/[[...route]]/types/class";

export default function AllowPage(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [users, setUsers] = useState([] as Users[])
    let [allowUsers, setAllowUsers] = useState([] as Users[])
    let [src, setSrc] = useState("")
    const { id } = useParams()
    const AddAllowModal = useRef({} as HTMLDialogElement)
    const [classrooms, setClassrooms] = useState([] as Classroom[])

    useEffect(() => {
        fetch("/api/auth/", {
            method: "POST",
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
                        loadAllowUser()
                        loadClassList()
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

    async function loadUser(){
        const res = await fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "GET_ALLOW_USERS_NOT_IN",
                data: {
                    class_id: id,
                    q: src
                }
            })
        })

        const json = await res.json()
        setUsers(json.data)
    }

    async function loadAllowUser(){
        const res = await fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "GET_ALLOW_USERS",
                data: {
                    class_id: id
                }
            })
        })

        const json = await res.json()
        setAllowUsers(json.data)
    }

    async function addUser(userid: string){
        const res = await fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "SET_ALLOW_USERS",
                data: {
                    class_id: id,
                    user_id: userid
                }
            })
        })

        const json = await res.json()
        if(json.status == "FAIL"){
            alert("FAILED !")
            return
        }

        await loadUser()
        await loadAllowUser()
    }

    async function deleteUser(userid: string){
        const res = await fetch("/api/instructor", {
            method: "POST",
            body: JSON.stringify({
                method: "UNSET_ALLOW_USERS",
                data: {
                    class_id: id,
                    user_id: userid
                }
            })
        })

        const json = await res.json()
        if(json.status == "FAIL"){
            alert("FAILED !")
            return
        }

        await loadAllowUser()
    }
    
    return (
        <>
            <Splash isLoad={load}></Splash>
            <dialog
                ref={AddAllowModal}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <>
                        <div className="flex justify-end">
                            <button onClick={(ev) => AddAllowModal.current.close()}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#5f6368"
                                >
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </button>
                        </div>
                        <hr className="my-2" />
                        <form
                            className="text-gray-600"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                loadUser();
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Search User"
                                value={src}
                                onChange={(v) => {
                                    setSrc(v.target.value);
                                }}
                                className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                            />
                        </form>
                        <div className="h-[50vh] overflow-hidden hover:overflow-y-auto mt-5">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>
                                            No
                                        </th>
                                        <th>
                                            User
                                        </th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                    {users.map((v, i) => (
                                        <tr>
                                            <td>
                                                {i + 1}
                                            </td>
                                            <td>
                                                {v.username} ({v.information.fullname})
                                            </td>
                                            <td>
                                                <button
                                                    className="btn shadow-sm shadow-gray-200 w-full bg-blue-400 hover:bg-blue-500 text-white"
                                                    onClick={() =>
                                                        addUser(v._id as string)
                                                    }
                                                >
                                                    Add
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </thead>
                            </table>
                        </div>
                    </>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
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
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">
                            Allow Users List
                        </h2>
                        <div className="w-[80vw] sm:w-[30rem]">
                            <button
                                className="btn mb-4"
                                onClick={async (ev) => {
                                    AddAllowModal.current.showModal();
                                    await loadUser();
                                }}
                            >
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Add Users
                                </h3>
                            </button>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>User Participant</th>
                                        <th>Action</th>
                                    </tr>
                                    {allowUsers.map((v, i) => (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{v.information.fullname}</td>
                                            <td>
                                                <button
                                                    className="btn shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 text-white"
                                                    onClick={() =>
                                                        deleteUser(
                                                            v._id as string
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}