import React, {Component} from "react"

export class SizedBox extends Component {
    constructor(props) {
        super(props)
        this.width = props.width ? props.width + "px" : null
        this.height = props.height ? props.height + "px" : null
    }

    render() {
        return (<div ref={this.props.r} className={this.props.className} style={{...{width: this.width, height: this.height},...this.style}}>{this.props.children}</div>)
    }
}