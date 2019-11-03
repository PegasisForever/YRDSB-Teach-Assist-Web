import React, {Component} from "react"

export default class LPI extends Component {
    render() {
        let width = this.props.width
        let value = this.props.value
        let text = this.props.text
        return (
            <div className="linear-progress-indicator"
                 style={{width: width + "px", height: "20px"}}>
                <svg
                    viewBox={"0 0 " + width + " 20"}
                    xmlns="http://www.w3.org/2000/svg">
                    <line className="background" x1={10} y1={10} x2={width - 10} y2={10}
                          strokeWidth={20}
                          strokeLinecap="round"/>
                    <line className={"foreground-"+(text?"secondary":"primary")} x1={10} y1={10} x2={10 + (width - 20) * value/100} y2={10}
                          strokeWidth={20}
                          strokeLinecap="round"/>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{text}</text>
                </svg>
            </div>
        )
    }
}