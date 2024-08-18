"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AllowPage(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [users, setUsers] = useState([] as Users[])
    let [allowUsers, setAllowUsers] = useState([] as Users[])
    let [src, setSrc] = useState("")
    let [modalAdd, setModalAdd] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        setUserData(json.data)
                        setLoad(!load)
                        loadAllowUser()
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

    async function loadUser(){
        const res = await fetch("/api/instructor/class/allow/not_in", {
            method: "POST",
            body: JSON.stringify({
                class_id: id,
                q: src
            })
        })

        const json = await res.json()
        setUsers(json.data)
    }

    async function loadAllowUser(){
        const res = await fetch("/api/instructor/class/allow/", {
            method: "POST",
            body: JSON.stringify({
                class_id: id,
            })
        })

        const json = await res.json()
        setAllowUsers(json.data)
    }

    async function addUser(userid: string){
        const res = await fetch("/api/instructor/class/allow/set", {
            method: "POST",
            body: JSON.stringify({
                class_id: id,
                user_id: userid
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
        const res = await fetch("/api/instructor/class/allow/delete", {
            method: "POST",
            body: JSON.stringify({
                class_id: id,
                user_id: userid
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
            <Modal show={modalAdd} setShow={setModalAdd} className="bg-white w-[30rem] h-[60vh] rounded-md px-5 py-4 overflow-y-scroll">
              <>
                <div className="flex justify-end">
                    <button onClick={(ev) => setModalAdd(!modalAdd)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </button>
                </div>
                <hr className="my-2" />
                <form className="text-gray-600" onSubmit={(ev) => {
                    ev.preventDefault()
                    loadUser()
                }
                }>
                <input 
                    type="text"
                    placeholder="Search User"
                    value={src}
                    onChange={(v) => {
                        setSrc(v.target.value)
                    }}
                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                />
                </form>
                <table className="my-5 rounded-md w-full border border-collapse">
                    <thead>
                        <tr>
                            <th className="text-gray-600 border py-2 px-2">No</th>
                            <th className="text-gray-600 border py-2 px-2">User</th>
                            <th className="text-gray-600 border py-2 px-2">Action</th>
                        </tr>
                        {users.map((v, i) => (
                            <tr>
                                <td className="text-gray-600 border py-2 px-2 text-center">
                                    {i+1}
                                </td>
                                <td className="text-gray-600 border py-2 px-2">
                                    {v.information.fullname}
                                </td>
                                <td className="border py-2 px-2">
                                    <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-blue-400 hover:bg-blue-500 rounded-md text-white"
                                        onClick={() => addUser(v._id as string)}
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </thead>
                </table>
              </>
            </Modal>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Allow Users List</h2>
                        <div className="w-[30rem]">
                            <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2" onClick={async (ev) => {
                                    setModalAdd(true);
                                    await loadUser()
                                }}>
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
                                    {allowUsers.map((v, i) => (
                                    <tr>
                                        <td className="text-gray-600 border py-2 px-2 text-center">
                                            {i+1}
                                        </td>
                                        <td className="text-gray-600 border py-2 px-2">
                                            {v.information.fullname}
                                        </td>
                                        <td className="border py-2 px-2">
                                            <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white"
                                                onClick={() => deleteUser(v._id as string)}
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
    )
}