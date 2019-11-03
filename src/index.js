import React, {Component, Fragment} from 'react'
import ReactDOM from "react-dom"
import "./index.scss"
import LoginPage from "./loginpage/loginPage"
import SummaryPage from "./summarypage/summaryPage"
import LoadingPage from "./summarypage/loadingPage"

class Root extends Component {
    constructor(props) {
        super(props)
        this.setPage = this.setPage.bind(this)

        let page
        if (sessionStorage.getItem("course-list")) {
            page = <SummaryPage setPage={this.setPage}/>
        } else if (localStorage.getItem("account")) {
            page = <LoadingPage setPage={this.setPage}/>
        } else {
            page = <LoginPage setPage={this.setPage}/>
        }

        this.state = {
            page1: null,
            key1:1,
            page2: page,
            key2:2
        }
    }

    setPage(page, callback, transitionTime) {
        this.setState(prevState => {
            return {
                page1: prevState.page2,
                key1:prevState.key2,
                page2: page,
                key2:prevState.key2+1
            }
        })
        setTimeout(() => {
            if (callback) callback()
            this.setState({
                page1: null
            })
        }, transitionTime ? transitionTime : 500)
    }

    render() {
        return (<Fragment>
            {[
                <div key={this.state.key1} className="root-div full-page">{this.state.page1}</div>,
                <div key={this.state.key2} className="root-div full-page">{this.state.page2}</div>
            ]}
        </Fragment>)
    }
}

ReactDOM.render(
    <Root/>,
    document.getElementById('root')
)