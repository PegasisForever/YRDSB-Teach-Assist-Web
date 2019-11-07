import React, {Component} from "react"

export class Padding extends Component {
    constructor(props) {
        super(props)
        this.t = "0"
        this.r = "0"
        this.b = "0"
        this.l = "0"
        if (props.all) {
            this.t = props.all + "px"
            this.r = props.all + "px"
            this.b = props.all + "px"
            this.l = props.all + "px"
        }
        this.t = props.t ? props.t + "px" : this.t
        this.r = props.r ? props.r + "px" : this.r
        this.b = props.b ? props.b + "px" : this.b
        this.l = props.l ? props.l + "px" : this.l
    }

    render() {
        return (<div
            ref={this.props.re}
            className={this.props.className}
            style={{
            paddingTop: this.t,
            paddingRight: this.r,
            paddingBottom: this.b,
            paddingLeft: this.l
        }}>{this.props.children}</div>)
    }
}