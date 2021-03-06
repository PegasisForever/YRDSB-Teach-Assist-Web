import React, {Component} from "react"
import {easeQuadInOut} from "d3-ease"
import Animate from "react-move/Animate"

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    }
}

function describeArc(x, y, radius, startAngle, endAngle) {
    let start = polarToCartesian(x, y, radius, endAngle)
    let end = polarToCartesian(x, y, radius, startAngle)
    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ")
}

export default class CircularProgressBar extends Component {
    state = {x1: 0, x2: 30}
    intervalID=null
    t = 600

    render() {
        let size=this.props.size?this.props.size:32
        let strokeWidth=this.props.strokeWidth?this.props.strokeWidth:3.5
        return (
            <div className={"circular-progress-bar"} style={{
                width:size+"px", height:size+"px"}}>
                <Animate
                    show={true}
                    start={{x1: 0, x2: 30}}
                    update={{
                        x1: [this.state.x1], x2: [this.state.x2],
                        timing: {duration: this.t, ease: easeQuadInOut}
                    }}>
                    {({x1, x2}) => {
                        return (
                            <svg className="rotate-animation" viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" strokeWidth={strokeWidth}
                                      d={describeArc(size/2, size/2, (size-strokeWidth)/2, x1, x2)}
                                />
                            </svg>
                        )
                    }}
                </Animate>
            </div>
        )
    }

    componentDidMount() {
        this.setState({x2: this.state.x2 + 200})
        this.timeoutID=setTimeout(() => {
            this.setState({x1: this.state.x1 + 200})
        }, this.t * 1.2)
        this.intervalID=setInterval(() => {
            this.setState({x2: this.state.x2 + 200})
            setTimeout(() => {
                this.setState({x1: this.state.x1 + 200})
            }, this.t * 1.2)
        }, this.t * 2.4)
    }

    componentWillUnmount(){
        if (this.intervalID){
            clearInterval(this.intervalID)
        }
        if (this.timeoutID){
            clearTimeout(this.timeoutID)
        }
    }
}