"use client"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { Exam } from "@/app/api/[[...route]]/types/exam"
import { Users } from "@/app/api/[[...route]]/types/user"
import DeletePrompt from "@/components/deletePrompt"
import Modal from "@/components/modal"
import Navbar from "@/components/navbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

export default function AddClass(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classes, setClasses] = useState(
        {
            _id : "",
            instructor: "",
            name: "",
            is_public: false,
            allow_users: [],
            block_users: []
        } as Classroom)

    let [change, setChange] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")
    let [process, setProcess] = useState(false)
    let [showDelete, setShowDelete] = useState(false)
    let [showExamAdd, setShowExamAdd] = useState(false)
    let [examName, setExamName] = useState("")
    let [examList, setExamList] = useState([] as Exam[])

    const { id } = useParams()

    function loadClassData(){
        fetch("/api/instructor/class/find/"+id)
            .then((r) => r.json())
            .then((json) => {
                setClasses(json.data as Classroom)
            })
    }

    async function loadExamList(){
        const response = await fetch("/api/instructor/class/exam/"+id, {
            cache: "no-store"
        })
        const json = await response.json()

        console.log(json)
        
        setExamList(json.data as Exam[])
        console.log("DONE")
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
        loadClassData()
        loadExamList()
    }, [load])

    useEffect(() => {
        loadExamList()
    }, [process])

    async function updateClass(){
        fetch("/api/instructor/class/update", {
            method: "POST",
            body: JSON.stringify(classes)
        }).then((res) => {
            return res.json()
        }).then((json) => {
            setProcess(false)
            if(json.status != "FAIL"){
                setErrorMsg("")
                setChange(false)
                return
            }
            setErrorMsg("Failed to save change")
        })
    }

    function deleteClass(){
        setShowDelete(false)
        setLoad(true)
        fetch("/api/instructor/class", {
            method: "DELETE",
            body: JSON.stringify({class_id: classes._id})
        }).then((res) => res.json())
        .then((json) => {
            if(json.status != "OK") {
                setLoad(false)
                return
            }
            document.location.href = "/dashboard/instructor/"
        })
    }

    async function insertClass(){
        fetch("/api/instructor/class/exam/"+id, {
            method: "POST",
            body: JSON.stringify({
                exam_name: examName
            })
        }).then((res) => {
            return res.json()
        }).then((json) => {
            setProcess(false)
            if(json.status != "FAIL"){
                setChange(false)
                return
            }
        })
    }

    async function addExam(e: FormEvent<HTMLFormElement>){
        e.preventDefault()
        setProcess(true)
        await insertClass()
        setShowExamAdd(false)
    }

    return (
        <> 
            <Splash isLoad={load}></Splash>
            <DeletePrompt promptText={"Delete This Classroom ?"} show={showDelete} setShow={setShowDelete} deleteFunction={deleteClass}>
                
            </DeletePrompt>
            <Modal show={showExamAdd} setShow={setShowExamAdd} className="bg-white w-[30rem] rounded-md px-5 py-4">
                <h3 className="text-center font-semibold text-gray-600">Add Exam</h3>
                <form onSubmit={(e) => addExam(e)} className="text-gray-600">
                <h4 className="my-2">Exam name</h4>
                    <input 
                        type="text"
                        className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                        value={examName}
                        placeholder="Exam"
                        onChange={(ev) => {
                            setExamName(ev.target.value)
                        }}
                    />
                    <input type="submit" value="Save" className={"w-full border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                    <button className={"w-full flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                        <img
                            src={"/img/load.svg"}
                            alt="logo"
                            className="w-[1.5rem] object-contain my-2"
                        />
                    </button>
                </form>
            </Modal>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Class Information</h2>
                        <div className="w-[30rem]">
                            <form className="text-gray-600" 
                                onSubmit={(ev) => {
                                    ev.preventDefault()
                                    setProcess(true)
                                    updateClass();
                                }}
                            >
                                <h4 className="mb-2">Class Name</h4>
                                <input 
                                    type="text"
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                    value={classes.name}
                                    onChange={(ev) => {
                                        setClasses({...classes, name: ev.target.value})
                                        setChange(true)
                                    }}
                                />
                                <div className="flex gap-2 mt-5">
                                    <input 
                                        type="checkbox" 
                                        id="cbx" 
                                        checked={classes.is_public} 
                                        onChange={(ev) => {
                                            setClasses({...classes, is_public : !classes.is_public})
                                            setChange(true)
                                        }}
                                    />
                                    <label htmlFor="cbx">Is Public</label>
                                </div>
                                {errorMsg != "" ? (<h4 className="text-red-400 mt-5">{errorMsg}</h4>) : (<></>)}
                                {change? (
                                    <>
                                        <input type="submit" value="Save" className={"w-full border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                                        <button className={"w-full flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                                            <img
                                                src={"/img/load.svg"}
                                                alt="logo"
                                                className="w-[1.5rem] object-contain my-2"
                                            />
                                        </button>
                                    </>
                                ) : (<></>)}
                            </form>
                        </div>
                        <h2 className="my-5 text-2xl font-semibold text-gray-600">Access</h2>
                        <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                            <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+id+"/allow"}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Allow Users
                                    </h3>
                                </a>
                            </div>
                            <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+id+"/block"}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Block Users
                                    </h3>
                                </a>
                            </div>
                        </div>
                        <h2 className="my-5 text-2xl font-semibold text-gray-600">Security</h2>
                        <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                            <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2" onClick={(ev) => setShowDelete(true)}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Delete Class
                                </h3>
                            </button>
                        </div>
                        <h2 className="my-5 text-2xl font-semibold text-gray-600">Exam</h2>
                        <div className="grid grid-flow-col-dense gap-2 grid-cols-3 mb-4">
                            <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2" onClick={(ev) => setShowExamAdd(true)}>
                                <h3 className="text-center text-gray-600 font-semibold">
                                    Add Exam
                                </h3>
                            </button>
                        </div>
                        <div className="grid grid-flow-row-dense gap-2 grid-cols-3 mb-4">
                        {examList.length != 0 ? examList.map((v: Exam) => (
                            <div className="flex flex-col justify-center items-center border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+id+"/"+v._id}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        {v.exam_name}
                                    </h3>
                                </a>
                            </div>
                        )) : (<h6 className="text-gray-600">No Classes Found</h6>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}