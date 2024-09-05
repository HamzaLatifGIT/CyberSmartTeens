import { combineReducers } from "@reduxjs/toolkit";
import userDataSclice from "./Slice/userData";


export const rootReducer = combineReducers({
    userData: userDataSclice,
})
