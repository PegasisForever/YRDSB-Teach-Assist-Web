import LinearLayout from "../components/linearLayout"
import React, {Component} from "react"
import CircularProgressBar from "../components/CircularProgressBar"
import net from "../tools"
import Animate from "react-move/Animate"
import {easeQuadInOut} from "d3-ease"
import {baseUrl, getAnimationScale, setPage} from "../index"
import getString from "../strings"

export default class LoadingPage extends Component {
    state={
        opacity:1
    }

    componentDidMount() {
        document.title = getString("loading_title")
    }

    render() {
        net.post(baseUrl+"/getmark",
            JSON.parse(sessionStorage.getItem("account") ? sessionStorage.getItem("account") : localStorage.getItem("account")),
            (statusCode, response) => {
                if (statusCode === 200) {
                    sessionStorage.setItem("course-list", response)
                    this.setState({
                        opacity:0
                    })
                    setPage(React.createElement(
                        this.props.nextPage
                    ))
                } else if (statusCode === 401) {

                } else {
                    alert(statusCode)
                }
            })
        return (<Animate
            show={true}
            start={{opacity: 0}}
            enter={{
                opacity: [this.state.opacity],
                timing: {duration: 500*getAnimationScale(), ease: easeQuadInOut}
            }}
            update={{
                opacity: [this.state.opacity],
                timing: {duration: 500*getAnimationScale(), ease: easeQuadInOut}
            }}>
            {({opacity}) => {
                return (
                    <LinearLayout style={{opacity: opacity}} className="full-page background" vertical align={"center"}>
                        <LinearLayout horizontal align={"center"} item={"stretch"}>
                            <CircularProgressBar size={64} strokeWidth={6}/>
                        </LinearLayout>
                    </LinearLayout>)
            }}
        </Animate>)
    }
}