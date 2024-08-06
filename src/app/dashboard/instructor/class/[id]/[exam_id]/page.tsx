"use client"
import { Answer, Attachment, Questions } from "@/app/api/[[...route]]/types/exam";
import { Users } from "@/app/api/[[...route]]/types/user";
import LoadingModal from "@/components/loadingModal";
import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamEdit(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [duration, setDuration] = useState("")
    let [millis, setMillis] = useState(0)
    let [saved, setSaved] = useState(true)
    let [process, setProcess] = useState(false)
    let [examName, setExamName] = useState("")
    let [modalAttachment, setModalAttachment] = useState(false)
    let [questions, setQuestions] = useState([] as Questions[])
    let [drag, setDrag] = useState(false)
    let [file, setFile] = useState({} as File)
    let [fileType, setFileType] = useState("")
    let [uploadLoading, setUploadLoading] = useState(false)
    const { id, exam_id } = useParams()

    async function loadExamData(){
        let res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}`)
        let json = await res.json()
        let millis = json.data.duration
        let hours = Math.floor(millis / (1000 * 60 * 60))
        let minutes = Math.floor((millis / (1000 * 60 * 60)) / (1000 * 60))
        let format = `${hours < 10 ? "0"+hours : hours}:${minutes < 10 ? "0"+minutes : minutes}`
        console.log(format)
        setDuration(format)
        setQuestions(json.data.questions)
        setExamName(json.data.exam_name)
    }

    function addQuestion(){
        let quests = [...questions]
        quests.push({
            question: "",
            attachment: [] as Attachment[],
            list_answer: [] as Answer[]
        } as Questions)
        setQuestions(quests)
        setSaved(false)
    }

    function deleteQuestion(index: number){
        let quests = [...questions]
        quests = quests.filter((v, i) => i != index)
        setQuestions(quests)
        setSaved(false)
    }

    function addAnswer(question_index: number){
        let qs = [...questions]
        qs[question_index].list_answer.push({
            text: "",
            correct: false
        })
        setQuestions(qs)
        setSaved(false)
    }

    function saving(){
        setProcess(true)
        fetch(`/api/instructor/class/exam/${id}/${exam_id}`, {
            method: "POST",
            body: JSON.stringify({
                exam_name: examName,
                duration: millis,
                questions: questions
            })
        }).then((res) => res.json())
        .then((json) => {
            setProcess(false)
            if(!(json.status == "FAIL")){
                setSaved(true)
            }
        })
    }

    function correctToggle(question_index: number, answer_index: number){
        let qs = [...questions]
        qs[question_index].list_answer[answer_index].correct = !qs[question_index].list_answer[answer_index].correct
        setQuestions(qs)
        setSaved(false)
    }

    function uploadFile(){
        setModalAttachment(false)
        setUploadLoading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", fileType)
        fetch("/api/uploads", {
            method: "POST",
            body: formData
        }).then((res) => {
            return res.json()
        }).then((json) => {
            console.log(json)
            setUploadLoading(false)
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
                        loadExamData().then(() => {
                            setLoad(!load)
                        })
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
        const splt = duration.split(":")
        const millis = (parseInt(splt[0]) * 60 * 60 * 1000) + (parseInt(splt[1]) * 60 * 1000)
        setMillis(millis)

        return
    }, [duration])

    return (
        <>
            <Splash isLoad={load}></Splash>
            <LoadingModal show={uploadLoading} className="bg-white p-5 w-[50vw] min-h-[40vh] rounded-md flex flex-col justify-center items-center">
                <img
                    src={"/img/BannerLogo.svg"}
                    alt="logo"
                    className={"w-[10rem] object-contain my-5 animate-bounce"}
                />
            </LoadingModal>
            <Modal show={modalAttachment} setShow={setModalAttachment} className="bg-white p-5 w-[70vw] min-h-[40vh] rounded-md">
                <h4 className="text-gray-600">File Type</h4>
                <select className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md text-gray-600"
                    onChange={(ev) => setFileType(ev.target.value)}>
                    <option value="">Select</option>
                    <option value="Image">Image</option>
                    <option value="Audio">Audio</option>
                </select>
                {fileType != "" ? (
                    <>
                        <h4 className="text-gray-600">Url</h4>
                        <input
                            type="text"
                            placeholder="https://foo.bar/"
                            className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                        />
                        <h4 className="text-gray-600 text-center my-2">Or</h4>
                        <h4 className="text-gray-600">File Upload</h4>
                        <div className={"bg-slate-200 w-full min-h-[6rem] rounded-md flex flex-col justify-center items-center " + (drag ? "border border-[#ff7854]" : "")} 
                            onDragOver={(ev) => {
                                ev.preventDefault()
                                setDrag(true)
                            }}
                            onDragExit={(ev) => {
                                ev.preventDefault()
                                setDrag(false)
                            }}
                            onDrop={(ev) => {
                                ev.preventDefault()
                                setFile(ev.dataTransfer.files[0])
                                setDrag(false)
                            }}>
                        { drag ? (
                            <h4 className="text-gray-900">Drag Here</h4>
                        ) : (
                            <>
                                {!(file.name) ? (
                                    <input 
                                        type="file"
                                        onChange={(ev) => setFile(ev.target.files ? ev.target.files[0] : {} as File)}
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <h4 className="text-gray-900 mx-2">{file.name}</h4>
                                        <button 
                                            className="border shadow-sm shadow-gray-200 px-5 py-2 mx-2 bg-red-400 hover:bg-red-500 rounded-md text-white"
                                            onClick={(ev) => setFile({} as File)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                        </div>
                        {(file.name) ? (
                            <>
                                <input onClick={(ev) => uploadFile()} type="button" value="Upload" className={"w-full border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer"}/>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </Modal>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Exam Editor</h2>
                        <div className="w-[50vw]">
                            <form className="text-gray-600 w-full" 
                                onSubmit={(ev) => {
                                    ev.preventDefault()
                                }}
                            >
                                <h4 className="my-2">Exam Name</h4>
                                <input 
                                    type="text"
                                    value={examName}
                                    onChange={(ev) => {
                                        setSaved(false)
                                        setExamName(ev.target.value)
                                    }}
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <h4 className="my-2">Duration</h4>
                                <input 
                                    type="time"
                                    value={duration}
                                    onChange={async (ev) => {
                                        setSaved(false)
                                        setDuration(ev.target.value)
                                    }}
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                {!saved? (
                                    <>
                                        <input onClick={(ev) => saving()} type="button" value="Save" className={"w-full border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                                        <button className={"w-full flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                                            <img
                                                src={"/img/load.svg"}
                                                alt="logo"
                                                className="w-[1.5rem] object-contain my-2"
                                            />
                                        </button>
                                    </>
                                ) : (<></>)}
                                <h4 className="my-2">Questions</h4>
                                {questions.map((v: Questions, i: number) => (
                                    <div className="w-full p-5 border border-slate-300 my-2 rounded-md">
                                        <h4 className="mb-2">Question</h4>
                                        <input 
                                            type="text"
                                            value={v.question}
                                            onChange={
                                                (ev) => {
                                                    let q = [...questions]
                                                    q[i].question = ev.target.value
                                                    setQuestions(q)
                                                    setSaved(false)
                                                }
                                            }
                                            className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                        />
                                        <h4 className="my-2">Attachment</h4>
                                        {v.attachment.map((w: Attachment, j: number) => (
                                            <div className="flex">
                                                <div className="w-[80%]">
                                                    {w.type == "image" ? (
                                                        <img 
                                                            width={75}
                                                            height={75}
                                                            src={w.source}
                                                            alt="Attachment"
                                                        />
                                                    ) : (<audio controls>
                                                        <source src={w.source} 
                                                                width={200}
                                                                height={0}/>
                                                    </audio>)}
                                                </div>
                                                <div className="w-[20%] flex flex-col justify-center items-center">
                                                    <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200"
                                            onClick={() => setModalAttachment(true)}>
                                            Add Attachment
                                        </button>
                                        <h4 className="my-2">Answer</h4>
                                        {v.list_answer.map((w: Answer, j: number) => (
                                            <div className="flex">
                                                <div className="w-[60%] flex flex-col justify-center items-center">
                                                    <input 
                                                        type="text"
                                                        value={w.text}
                                                        onChange={(ev) => {
                                                            let qs = [...questions]
                                                            qs[i].list_answer[j].text = ev.target.value
                                                            setQuestions(qs)
                                                        }}
                                                        className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                                    />
                                                </div>
                                                <div className="w-[25%] flex flex-col justify-center items-center">
                                                    {w.correct ? (
                                                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" onClick={() => correctToggle(i, j)}>
                                                            Unset Correct
                                                        </button>
                                                    ) : (
                                                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-blue-400 hover:bg-blue-500 rounded-md text-white" onClick={() => correctToggle(i, j)}>
                                                            Set Correct
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="w-[15%] flex flex-col justify-center items-center">
                                                    <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" 
                                                        onClick={(ev) => {
                                                            let qs = [...questions]
                                                            let as = qs[i].list_answer.filter((_, k: number) => k != j)
                                                            qs[i].list_answer = as
                                                            setQuestions(qs)
                                                            setSaved(false)
                                                        }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200" onClick={(ev) => addAnswer(i)}>
                                            Add Answer
                                        </button>
                                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" onClick={() => deleteQuestion(i)}>
                                            Delete Question
                                        </button>
                                    </div>
                                ))}
                            <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200" onClick={() => addQuestion()}>
                                Add Question
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}