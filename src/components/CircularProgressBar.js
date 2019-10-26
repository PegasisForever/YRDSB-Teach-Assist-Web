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
    t = 600

    render() {
        return (
            <div className={"circular-progress-bar"}>
                <Animate
                    show={true}
                    start={{x1: 0, x2: 30}}
                    update={{
                        x1: [this.state.x1], x2: [this.state.x2],
                        timing: {duration: this.t, ease: easeQuadInOut}
                    }}
                >
                    {({x1, x2}) => {
                        return (
                            <svg className="rotate-animation" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="none" stroke-width="5"
                                      d={describeArc(24, 24, 20, x1, x2)}
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
        setTimeout(() => {
            this.setState({x1: this.state.x1 + 200})
        }, this.t * 1.2)
        setInterval(() => {
            this.setState({x2: this.state.x2 + 200})
            setTimeout(() => {
                this.setState({x1: this.state.x1 + 200})
            }, this.t * 1.2)
        }, this.t * 2.4)
    }
}