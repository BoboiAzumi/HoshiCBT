import { Questions } from "@/app/api/[[...route]]/types/exam";
import { createContext } from "react";

export const QuestionsContext = createContext({} as {questions: Questions, setQuestions: Function})