import React from 'react'
import LinearLayout from "./linearLayout"
import ReactDOM from "react-dom"
import "./index.scss"

ReactDOM.render(
    (<LinearLayout horizontal align={"center"}>
        <span>12</span>
        <span>34</span>
        <span>56</span>
    </LinearLayout>),
    document.getElementById('root')
)
