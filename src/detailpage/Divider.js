import React from "react"

export default function Divider() {
    return <div style={{
        maxWidth: "700px",
        width: "calc(100vw - 350px)",
        height: "0",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)"
    }}/>
}