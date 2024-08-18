"use client";
import { Exam, Questions } from "@/app/api/[[...route]]/types/exam";
import QuestionsDisplay from "@/components/questions";
import Splash from "@/components/splash";
import { ExamContext } from "@/context/Exam";
import { QuestionsContext } from "@/context/Questions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamView() {
    const { examid, classid } = useParams();
    let [load, setLoad] = useState(true);
    let [result, setResult] = useState({} as any);

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin";
                switch (json.data.role) {
                    case "user":
                        setLoad(!load);
                        break;
                    case "instructor":
                        document.location.href = "/dashboard/instructor";
                        break;
                    case "admin":
                        document.location.href = "/dashboard/admin";
                        break;
                }
            });
    }, []);

    useEffect(() => {
        fetch("/api/user/class/" + classid + "/" + examid + "/result")
            .then((r) => r.json())
            .then((json) => {
                setResult(json.data);
            });
    }, [load]);

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div className="flex flex-col w-full min-h-[100vh] justify-center items-center">
                <div className="bg-white w-[20rem] rounded-[0.5rem] min-h-[30rem] shadow-sm">
                    <h2 className="text-2xl font-bold py-4 px-5 text-center bg-[#ff4c1a] rounded-[0.3rem] text-white">Result</h2>
                    <div className="grid grid-flow-row-dense grid-cols-2 mx-4 my-2">
                        <h4>Total Questions</h4>
                        <h4>: {result.total}</h4>
                        <h4>Correct Answer</h4>
                        <h4>: {result.correct_total}</h4>
                        <h4>Total Score</h4>
                        <h4>: {result?.score?.toFixed(2)}</h4>
                    </div>
                    <h4 className="text-2xl font-bold py-4 px-5 text-center text-gray-600">Detail</h4>
                    <div className="h-[12rem] border grid grid-cols-1 overflow-y-auto">
                        {result?.detail?.map((v: { question: string; correct: boolean }, i: number) => (
                            <div className={"border flex flex-col justify-center px-3 py-2 " + (v.correct ? "bg-green-300" : "bg-red-300")}>
                                <h5 className="">
                                    {i + 1}. {v.question}
                                </h5>
                            </div>
                        ))}
                    </div>
                    <a href={"/dashboard/user/class/" + classid} className="bg-[#ff7854] hover:bg-[#ff4c1a] my-5 px-5 py-3 text-lg font-semibold text-gray-100 rounded-3xl mx-3 flex items-center justify-center">
                        Back
                    </a>
                </div>
            </div>
        </>
    );
}
