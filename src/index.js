import React, {Component} from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"
import LoadingPage from "./summarypage/loadingPage"
import SummaryPage from "./summarypage/summaryPage"
import DetailPage from "./detailpage/detailPage"
import {isMobile} from "./tools"

let states = {
    login: LoginPage,
    summary: SummaryPage,
    detail: DetailPage
}

class Root extends Component {
    constructor(props) {
        super(props)
        this.setPage = this.setPage.bind(this)

        let page
        const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        if (isDevelopment && sessionStorage.getItem("state")) {
            page = React.createElement(
                states[sessionStorage.getItem("state")],
                {setPage: this.setPage}
            )
        } else {
            if (sessionStorage.getItem("state") === "login") {
                page = <LoginPage setPage={this.setPage}/>
            } else if (sessionStorage.getItem("state")) {
                page = <LoadingPage setPage={this.setPage}
                                    nextPage={states[sessionStorage.getItem("state")]}/>
            } else if (localStorage.getItem("account")) {
                page = <LoadingPage setPage={this.setPage}
                                    nextPage={SummaryPage}/>
            } else {
                page = <LoginPage setPage={this.setPage}/>
            }
        }

        this.state = {
            page1: null,
            key1: 1,
            page2: page,
            key2: 2
        }
    }

    setPage(page, callback, transitionTime) {
        if (this.lastSetPageTimeoutID) {
            clearTimeout(this.lastSetPageTimeoutID)
        }
        this.setState(prevState => {
            return {
                page1: prevState.page2,
                key1: prevState.key2,
                page2: page,
                key2: prevState.key2 + 1
            }
        })
        this.lastSetPageTimeoutID = setTimeout(() => {
            if (callback) callback()
            this.setState({
                page1: null
            })
        }, (transitionTime ? transitionTime : 500) * getAnimationScale())
    }

    render() {
        return [
            <div key={this.state.key1} className="root-div full-page">{this.state.page1}</div>,
            <div key={this.state.key2} className="root-div full-page">{this.state.page2}</div>
        ]
    }
}

ReactDOM.render(
    <Root/>,
    document.getElementById('root')
)

export function getAnimationScale() {
    return 1
}