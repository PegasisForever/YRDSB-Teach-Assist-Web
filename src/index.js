import React, {Component, Fragment} from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"
import LoadingPage from "./summarypage/loadingPage"
import SummaryPage from "./summarypage/summaryPage"
import DetailPage from "./detailpage/detailPage"

let states = {
    login: LoginPage,
    summary: SummaryPage,
    detail: DetailPage
}

let showDialog
let delDialog
let setPage
let setCurrentPageScroll
let currentPageScroll = 0
let baseUrl = "https://api.pegasis.site/public/yrdsb_ta"

//http://localhost:5005

class Root extends Component {
    constructor(props) {
        super(props)

        // if (window.innerWidth <= 1050) {
        //     let url = new URL(window.location.href)
        //     if (!url.searchParams.get("no-red")) {
        //         window.location.replace("https://ta-yrdsb.web.app/about")
        //         return
        //     }
        // }

        this.setPage = this.setPage.bind(this)
        this.showDialog = this.showDialog.bind(this)
        this.delDialog = this.delDialog.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.setScroll = this.setScroll.bind(this)
        setPage = this.setPage
        showDialog = this.showDialog
        delDialog = this.delDialog
        setCurrentPageScroll = this.setScroll

        let page
        const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        if (false && sessionStorage.getItem("state")) {
            page = React.createElement(
                states[sessionStorage.getItem("state")]
            )
        } else {
            if (sessionStorage.getItem("state") === "login") {
                page = <LoginPage noEnter={true}/>
            } else if (sessionStorage.getItem("state")) {
                page = <LoadingPage nextPage={states[sessionStorage.getItem("state")]}/>
            } else if (localStorage.getItem("account")) {
                page = <LoadingPage nextPage={SummaryPage}/>
            } else {
                page = <LoginPage noEnter={true}/>
            }
        }

        this.state = {
            page1: null,
            key1: 1,
            page2: page,
            key2: 2,
            dialog: null
        }
    }

    showDialog(dialog) {
        this.setState({
            dialog: dialog
        })
    }

    delDialog() {
        this.setState({
            dialog: null
        })
    }

    onScroll(event) {
        currentPageScroll = event.currentTarget.scrollTop
    }

    setScroll(distance) {
        if (this.page2Div) {
            this.page2Div.scrollTop = distance
        }
    }

    setPage(page, callback, transitionTime, immiCallback) {
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
        },()=>{
            if(immiCallback) immiCallback()
        })
        this.lastSetPageTimeoutID = setTimeout(() => {
            if (callback) callback()
            this.setState({
                page1: null
            })
        }, (transitionTime ? transitionTime : 500) * getAnimationScale())
    }

    render() {
        return <Fragment>
            <div key={this.state.key1} className="root-div full-page">{this.state.page1}</div>
            <div key={this.state.key2}
                 ref={(ref)=> this.page2Div = ref}
                 className="root-div full-page"
                 onScroll={this.onScroll}>
                {this.state.page2}
            </div>
            {this.state.dialog}
        </Fragment>
    }
}

ReactDOM.render(
    <Root/>,
    document.getElementById("root")
)

export function getAnimationScale() {
    return 1
}

export function getPublicURL() {
    return "/"
}

export function getCurrentPageScroll() {
    return currentPageScroll
}

export {showDialog, delDialog, setPage, baseUrl, setCurrentPageScroll}