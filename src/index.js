import React from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"
import SummaryPage from "./summarypage/summaryPage"
import LoadingPage from "./summarypage/loadingPage"

let page
if (sessionStorage.getItem("course-list")){
    page= <SummaryPage/>
}else if(localStorage.getItem("account")){
    page= <LoadingPage/>
}else{
    page= <LoginPage/>
}

ReactDOM.render(
    page,
    document.getElementById('root')
)

export default function setCurrentPage(page) {
    ReactDOM.render(
        page,
        document.getElementById('root')
    )
}