import { Classroom } from "@/app/api/[[...route]]/types/class";
import { createContext } from "react";

export const ClassroomList = createContext([] as Classroom[])