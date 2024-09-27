import { ClassroomData } from "@/app/api/[[...route]]/types/class";
import { createContext } from "react";

export const ClassroomDataList = createContext([] as ClassroomData[])