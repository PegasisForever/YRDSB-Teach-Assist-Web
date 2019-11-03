import React from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"

ReactDOM.render(
    <LoginPage/>,
    document.getElementById('root')
)

export default function setCurrentPage(page){
    ReactDOM.render(
        page,
        document.getElementById('root')
    )
}