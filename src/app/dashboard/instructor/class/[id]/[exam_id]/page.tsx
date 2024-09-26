"use client"
import { Answer, Attachment, Questions } from "@/app/api/[[...route]]/types/exam";
import { Users } from "@/app/api/[[...route]]/types/user";
import DeletePrompt from "@/components/deletePrompt";
import LoadingModal from "@/components/loadingModal";
import Modal from "@/components/modal";
import Navbar from "@/components/AdminNavbar";
import QuestionsForm from "@/components/questionsForm";
import { SessionList } from "@/components/sessionList";
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
    let [selectedQIndex, setSelectedQIndex] = useState(0)
    let [selectedAIndex, setSelectedAIndex] = useState(0)
    let [showDelete, setShowDelete] = useState(false)
    let [showDeleteSession, setShowDeleteSession] = useState(false)
    let [showSession, setShowSession] = useState(false)
    let [examSession, setExamSession] = useState([] as any)
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

    async function deleteExam(){
        setShowDelete(false)
        setLoad(true)
        
        let res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}`, {
            method: "DELETE"
        })
        let json = await res.json()
        if(json.status != "FAIL"){
            document.location.href = `/dashboard/instructor/class/${id}`;
        }
    }

    async function addQuestion(){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "NEW_QUESTION"
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
    }

    async function deleteQuestion(index: number){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "DELETE_QUESTION",
                    data: {
                        index
                    }
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
    }

    async function deleteAttachment(index: number, aindex: number){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "DELETE_ATTACHMENT",
                    data: {
                        index,
                        aindex
                    }
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
    }

    async function addAnswer(question_index: number){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "NEW_ANSWER",
                    data: {
                        i: question_index
                    }
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
    }

    async function deleteAnswer(question_index: number, answer_index: number){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "DELETE_ANSWER",
                    data: {
                        i: question_index,
                        ai: answer_index
                    }
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
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
        saving()
    }

    async function newAttachment(data: object){
        setUploadLoading(true)
        try{
            const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question`, {
                method: "POST",
                body: JSON.stringify({
                    method: "NEW_ATTACHMENT",
                    data
                })
            })
            const json = await res.json()
            if(json.status != "FAIL"){
                loadExamData()
            }
            setUploadLoading(false)
        }
        catch(e: any){
            alert("error : "+e.message)
        }
    }

    function uploadFile(){
        setModalAttachment(false)
        setUploadLoading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", fileType)
        fetch("/api/instructor/uploads", {
            method: "POST",
            body: formData
        }).then((res) => {
            return res.json()
        }).then(async (json) => {
            if(json.status != "FAIL"){
                await newAttachment({
                    type: fileType == "image" ? "image" : "audio",
                    from: "upload",
                    source: json.path,
                    i: selectedQIndex
                })

                await loadExamData()
            }
            setUploadLoading(false)
            setFile({} as File)
            setFileType("")
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

    async function resetSession() {
        setShowDeleteSession(false)
        setLoad(true)
        const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question/reset`)
        const json = await res.json()

        if(json.status != "FAIL"){
            setLoad(false)
        }
    }

    async function showModalSession() {
        setShowSession(true)
        const res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}/question/result`)
        const json = await res.json()
        if(json.status != "FAIL") {
            setExamSession(json.data)
        }
    }

    return (
        <>
            <Splash isLoad={load}></Splash>
            <DeletePrompt promptText={"Delete This Exam ?"} show={showDelete} setShow={setShowDelete} deleteFunction={deleteExam}/>
            <DeletePrompt promptText={"Reset This Exam Session ?"} show={showDeleteSession} setShow={setShowDeleteSession} deleteFunction={resetSession}/>
            <LoadingModal show={uploadLoading} className="bg-white p-5 w-[50vw] min-h-[40vh] rounded-md flex flex-col justify-center items-center">
                <img
                    src={"/img/BannerLogo.svg"}
                    alt="logo"
                    className={"w-[10rem] object-contain my-5 animate-bounce"}
                />
            </LoadingModal>
            <SessionList show={showSession} setShow={setShowSession} examSession={examSession}/>
            <Modal show={modalAttachment} setShow={setModalAttachment} className="bg-white p-5 w-[70vw] min-h-[40vh] rounded-md">
                <h4 className="text-gray-600">File Type</h4>
                <select className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md text-gray-600"
                    onChange={(ev) => setFileType(ev.target.value)}>
                    <option value="" selected={fileType == "" ? true : false}>Select</option>
                    <option value="image" selected={fileType == "image" ? true : false}>Image</option>
                    <option value="audio" selected={fileType == "audio" ? true : false}>Audio</option>
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
                                <h4 className="my-2">Security</h4>
                                <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2 mx-1" onClick={(ev) => showModalSession()}>
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Show Session
                                    </h3>
                                </button>
                                <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2 mx-1" onClick={(ev) => setShowDeleteSession(true)}>
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Reset Session
                                    </h3>
                                </button>
                                <button className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2 mx-1" onClick={(ev) => setShowDelete(true)}>
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Delete Exam
                                    </h3>
                                </button>
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
                                    <QuestionsForm
                                        v={v}
                                        i={i}
                                        questions={questions}
                                        setQuestions={setQuestions}
                                        setSaved={setSaved}
                                        setModalAttachment={setModalAttachment}
                                        setSelectedQIndex={setSelectedQIndex}
                                        setSelectedAIndex={setSelectedAIndex}
                                        correctToggle={correctToggle}
                                        addAnswer={addAnswer}
                                        deleteAnswer={deleteAnswer}
                                        deleteQuestion={deleteQuestion}
                                        saving={saving}
                                        deleteAttachment={deleteAttachment}
                                    />
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