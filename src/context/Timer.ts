import { createContext } from "react";

export const Timer = createContext({} as {timer: {hour: number, minutes: number, seconds: number}, setTimer: Function})