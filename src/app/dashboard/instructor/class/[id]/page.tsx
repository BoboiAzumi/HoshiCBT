"use client"
import { Classroom } from "@/app/api/[[...route]]/types/class"
import { Exam } from "@/app/api/[[...route]]/types/exam"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/InstructorNavbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import { ClassroomList } from "@/context/ClassroomList"
import { FaArrowRightToBracket } from "react-icons/fa6"

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
    let [examName, setExamName] = useState("")
    let [examList, setExamList] = useState([] as Exam[])
    const [classrooms, setClassrooms] = useState([] as Classroom[])
    const DeleteModal = useRef({} as HTMLDialogElement)
    const ExamModal = useRef({} as HTMLDialogElement)

    const { id } = useParams()

    function loadClassData(){
        fetch("/api/instructor/", {
            method: "post",
            body: JSON.stringify({
                method: "GET_CLASSROOM_BY_ID",
                data: {
                    class_id: id
                }
            })
        })
            .then((r) => r.json())
            .then((json) => {
                setClasses(json.data as Classroom)
            })
    }

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

    async function loadExamList(){
        const response = await fetch("/api/instructor/", {
            cache: "no-store",
            method: "POST",
            body: JSON.stringify({
                method: "GET_EXAM_LIST",
                data: {
                    class_id: id
                }
            })
        })
        const json = await response.json()

        console.log(json)
        
        setExamList(json.data as Exam[])
        console.log("DONE")
    }

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

    useEffect(() => {
        if(!load){
            loadClassData()
            loadExamList()
        }
    }, [load])

    useEffect(() => {
        loadExamList()
    }, [process])

    async function updateClass(){
        fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "UPDATE_CLASSROOM",
                data: classes
            })
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
        DeleteModal.current.close()
        setLoad(true)
        fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "DELETE_CLASSROOM",
                data: {
                    class_id: classes._id
                }
            })
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
        fetch("/api/instructor/", {
            method: "POST",
            body: JSON.stringify({
                method: "CREATE_NEW_EXAM",
                data: {
                    class_id: id,
                    exam_name: examName
                }
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
        ExamModal.current.close()
    }

    return (
        <>
            <Splash isLoad={load}></Splash>
            <dialog
                ref={DeleteModal}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h2 className="font-bold text-gray-600 mt-2">
                        Delete this classroom ?
                    </h2>
                    <div className="mt-5">
                        <button
                            className="btn bg-transparent border-slate-200 px-3 py-1 rounded-md hover:border-[#ff4c1a] hover:bg-[#ff4c1a] hover:text-white"
                            onClick={() => DeleteModal.current.close()}
                        >
                            No
                        </button>
                        <button
                            className="btn ml-2 px-3 py-1 rounded-md border-[#ff4c1a] bg-[#ff4c1a] hover:bg-[#ff4c1a] text-white"
                            onClick={() => deleteClass()}
                        >
                            Yes
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
            <dialog
                ref={ExamModal}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="text-center font-semibold text-gray-600">
                        Add Exam
                    </h3>
                    <form
                        onSubmit={(e) => addExam(e)}
                        className="text-gray-600"
                    >
                        <h4 className="my-2">Exam name</h4>
                        <input
                            type="text"
                            className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                            value={examName}
                            placeholder="Exam"
                            onChange={(ev) => {
                                setExamName(ev.target.value);
                            }}
                        />
                        <input
                            type="submit"
                            value="Save"
                            className={
                                "btn w-full bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854]  cursor-pointer" +
                                (process ? " hidden" : "")
                            }
                        />
                        <button
                            className={
                                "btn w-full flex justify-center bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] cursor-pointer mt-5" +
                                (process ? "" : " hidden")
                            }
                            disabled
                        >
                            <img
                                src={"/img/load.svg"}
                                alt="logo"
                                className="w-[1.5rem] object-contain my-2"
                            />
                        </button>
                    </form>
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
                        <div className="sm:border my-[5rem] flex flex-col items-center rounded-md p-5">
                            <h2 className="mb-5 text-2xl font-semibold text-gray-600">
                                Classroom Information
                            </h2>
                            <div className="w-full sm:w-[30rem]">
                                <form
                                    className="text-gray-600"
                                    onSubmit={(ev) => {
                                        ev.preventDefault();
                                        setProcess(true);
                                        updateClass();
                                    }}
                                >
                                    <h4 className="mb-2">Classroom Name</h4>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                        value={classes.name}
                                        onChange={(ev) => {
                                            setClasses({
                                                ...classes,
                                                name: ev.target.value,
                                            });
                                            setChange(true);
                                        }}
                                    />
                                    <div className="flex gap-2 mt-5">
                                        <input
                                            type="checkbox"
                                            id="cbx"
                                            checked={classes.is_public}
                                            onChange={(ev) => {
                                                setClasses({
                                                    ...classes,
                                                    is_public:
                                                        !classes.is_public,
                                                });
                                                setChange(true);
                                            }}
                                        />
                                        <label htmlFor="cbx">Is Public</label>
                                    </div>
                                    {errorMsg != "" ? (
                                        <h4 className="text-red-400 mt-5">
                                            {errorMsg}
                                        </h4>
                                    ) : (
                                        <></>
                                    )}
                                    {change ? (
                                        <>
                                            <input
                                                type="submit"
                                                value="Save"
                                                className={
                                                    "btn bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 w-full my-2" +
                                                    (process ? " hidden" : "")
                                                }
                                            />
                                            <button
                                                className={
                                                    "btn bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 w-full my-2" +
                                                    (process ? "" : " hidden")
                                                }
                                            >
                                                <img
                                                    src={"/img/load.svg"}
                                                    alt="logo"
                                                    className="w-[1.5rem] object-contain my-2"
                                                />
                                            </button>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </form>
                            </div>
                            <h2 className="my-5 text-2xl font-semibold text-gray-600">
                                Access
                            </h2>
                            <div className="grid grid-flow-col-dense gap-2 grid-cols-2 sm:grid-cols-4">
                                <a
                                    href={
                                        "/dashboard/instructor/class/" +
                                        id +
                                        "/allow"
                                    }
                                    className="btn w-[10rem] sm:w-[7rem]"
                                >
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Allow Users
                                    </h3>
                                </a>
                                <a
                                    href={
                                        "/dashboard/instructor/class/" +
                                        id +
                                        "/block"
                                    }
                                    className="btn w-[10rem] sm:w-[7rem]"
                                >
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Block Users
                                    </h3>
                                </a>
                            </div>
                            <h2 className="my-5 text-2xl font-semibold text-gray-600">
                                Action
                            </h2>
                            <div className="grid grid-flow-col-dense gap-2 grid-cols-2 sm:grid-cols-4">
                                <button
                                    className="btn bg-red-400 hover:bg-red-500 text-gray-100 w-[10rem] sm:w-[7rem]"
                                    onClick={(ev) =>
                                        DeleteModal.current.showModal()
                                    }
                                >
                                    <h3 className="text-center font-semibold">
                                        Delete Classroom
                                    </h3>
                                </button>
                            </div>
                            <h2 className="my-5 text-2xl font-semibold text-gray-600">
                                Exam
                            </h2>
                            <div className="grid grid-flow-col-dense gap-2 grid-cols-2 sm:grid-cols-4 mb-4 ">
                                <button
                                    className="btn shadow-gray-200 w-[10rem] sm:w-[7rem]"
                                    onClick={(ev) => ExamModal.current.showModal()}
                                >
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Add Exam
                                    </h3>
                                </button>
                            </div>
                            <div className="grid grid-flow-row-dense gap-2 grid-cols-1 mb-4 w-full">
                                {examList.length != 0 ? (
                                    examList.map((v: Exam) => (
                                        <div className="card bg-white border w-full md:min-w-[30rem] shadow-md">
                                            <div className="card-body">
                                                <div className="card-title text-gray-600">
                                                    {v.exam_name}
                                                </div>
                                                <div className="card-actions justify-end">
                                                    <a
                                                        href={
                                                            "/dashboard/instructor/class/" +
                                                            id +
                                                            "/" +
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
                                        No Classes Found
                                    </h6>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}