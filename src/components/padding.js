import React from "react"

export function Padding(props) {
    let t = "0"
    let r = "0"
    let b = "0"
    let l = "0"
    if (props.all) {
        t = props.all + "px"
        r = props.all + "px"
        b = props.all + "px"
        l = props.all + "px"
    }
    t = props.t ? props.t + "px" : t
    r = props.r ? props.r + "px" : r
    b = props.b ? props.b + "px" : b
    l = props.l ? props.l + "px" : l

    return <div
        ref={props.re}
        className={props.className}
        style={{
            paddingTop: t,
            paddingRight: r,
            paddingBottom: b,
            paddingLeft: l
        }}>{props.children}</div>
}