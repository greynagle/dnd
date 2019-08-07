import React, {Component} from 'react';
//import React from 'react';
import './App.css';
import PropTypes from 'prop-types'


function App() {
  return (
    <div className="App">
      <Input />
    </div>
  );
}

class Input extends React.Component {
  state = {
    upWidth: 0, 
    upHeight: 0, 
    width: 0, 
    height: 0,
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleUpdate = (e) => {
    e.preventDefault()
    this.setState({width: parseInt(this.state.upWidth), height: parseInt(this.state.upHeight)})
  }

  handleReset = (e) => {
    e.preventDefault()
    this.setState({width: 0, height: 0, upWidth: 0, upHeight: 0})
  }

  render() {
    return (
      <div>
        <form onSubmit = {this.handleUpdate} onReset = {this.handleReset} >
          <label>
            Width
            <input type="text" name="upWidth" value={this.state.upWidth} onChange={this.handleInput} />
          </label>
          <label>
            Height
            <input type="text" name="upHeight" value={this.state.upHeight} onChange={this.handleInput} />
          </label>
          <br />
          <input type="submit" value="Update" />
          <input type="reset" value="Reset" />
        </form>
        <Grid width={this.state.width} height={this.state.height}/>
      </div>
    )
  }
}

class Grid extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired, 
    height: PropTypes.number.isRequired
  }

  state={
    winWidth: window.innerWidth, 
    winHeight: window.innerHeight
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount= () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions = () => {
    this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
  }

  render() {
    //initialize grid
    let blankGrid = [];
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        // debugger;
        blankGrid.push({x: j, y: i});
      }
    }
    //sets px value for square cells based on window heights, picking the smallest
    let pxValue = (this.state.winWidth<=this.state.winHeight) ? this.state.winWidth : this.state.winHeight;
    let maxInput = (this.props.width>=this.props.height) ? this.props.width : this.props.height;
    pxValue = (pxValue-200)/maxInput

    return (
      <div>
        <br/>
        {blankGrid.map((elem, index) => {
          // debugger;
          return(
            (index%this.props.width) != 0 ? 
            <canvas 
              key={index} 
              width={pxValue + 'px'} 
              height={pxValue + 'px'} 
              style={{display: 'inline', border:'1px solid #000000'}} 
            /> :
            <React.Fragment>
              <hr 
                style={{height:'1px', visibility:'hidden', marginBottom: '-15px'}} 
              />
              <canvas 
                key={index} 
                width={pxValue + 'px'} 
                height={pxValue + 'px'}  
                style={{display: 'inline', border:'1px solid #000000'}} 
              />
            </React.Fragment>
          )})
        }
      </div>
    )
  }
}




  


export default App;
