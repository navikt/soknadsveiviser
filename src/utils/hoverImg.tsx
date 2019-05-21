import React, { Component } from "react";

class HoverImg extends Component<{ src: any; onHover: any }, { img: any }> {
  constructor(props: { src: any; onHover: any }) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.state = { img: this.props.src };
  }

  handleMouseOver() {
    this.setState({ img: this.props.onHover });
  }

  handleMouseOut() {
    this.setState({ img: this.props.src });
  }

  render() {
    return (
      <img
        alt={this.state.img}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        src={this.state.img}
      />
    );
  }
}

export default HoverImg;
