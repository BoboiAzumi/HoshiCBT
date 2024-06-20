import { Exam } from "@/app/api/[[...route]]/types/exam";
import { createContext } from "react";

export const ExamContext = createContext({} as {examData: Exam, setExamData: Function})