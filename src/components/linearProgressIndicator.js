import React from "react"

export default function LPI(props) {
    let height = props.height ? props.height : 20
    let width = props.width
    let value = props.value
    let text = props.text
    return (
        <div className="linear-progress-indicator"
             style={{width: width + "px", height: height + "px"}}>
            <svg
                width={width + "px"}
                height={height + "px"}>
                <line className="background" x1={height / 2} y1={height / 2} x2={width - height / 2} y2={height / 2}
                      strokeWidth={height}
                      strokeLinecap="round"/>
                {value ?
                    <line className={"foreground-" + (text ? "secondary" : "primary")} x1={height / 2} y1={height / 2}
                          x2={height / 2 + (width - height) * value / 100} y2={height / 2}
                          strokeWidth={height}
                          strokeLinecap="round"/> : null}
                <text x="50%" y="55%" style={{fill: "black"}}>{text}</text>
            </svg>
        </div>
    )
}