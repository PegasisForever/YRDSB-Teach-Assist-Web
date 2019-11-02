import React, {Component} from "react"

export class Padding extends Component {
    constructor(props) {
        super(props)
        if (props.all) {
            this.t = props.all + "px"
            this.r = props.all + "px"
            this.b = props.all + "px"
            this.l = props.all + "px"
        } else {
            this.t = props.t ? props.t + "px" : "0"
            this.r = props.r ? props.r + "px" : "0"
            this.b = props.b ? props.b + "px" : "0"
            this.l = props.l ? props.l + "px" : "0"
        }
    }

    render() {
        return (<div style={{
            paddingTop: this.t,
            paddingRight: this.r,
            paddingBottom: this.b,
            paddingLeft: this.l
        }}>{this.props.children}</div>)
    }
}