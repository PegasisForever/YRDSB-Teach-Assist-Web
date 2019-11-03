import React from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"
import SummaryPage from "./summarypage/summaryPage"

ReactDOM.render(
    (sessionStorage.getItem("course-list") ? <SummaryPage/> : <LoginPage/>),
    document.getElementById('root')
)

export default function setCurrentPage(page) {
    ReactDOM.render(
        page,
        document.getElementById('root')
    )
}