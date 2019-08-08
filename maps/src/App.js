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
    width: 2, 
    height: 2,
    water: 0,
    trees: 0,
    road: false,
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleUpdate = (e) => {
    e.preventDefault()
    this.setState({
      width: parseInt(this.state.upWidth), 
      height: parseInt(this.state.upHeight)})
  }

  handleReset = (e) => {
    e.preventDefault()
    this.setState({
      upWidth: 0, 
      upHeight: 0, 
      width: 0, 
      height: 0,
      water: 0,
      trees: 0,
      road: 'off',
    })
  }

  render() {
    return (
      <div>
        <form 
          onSubmit = {this.handleUpdate} 
          onReset = {this.handleReset} 
        >
          <label>
            Width
            <input 
              type="text" 
              name="upWidth" 
              value={this.state.upWidth} 
              onChange={this.handleInput} 
            />
          </label>
          <label>
            Height
            <input 
              type="text" 
              name="upHeight" 
              value={this.state.upHeight} 
              onChange={this.handleInput} 
            />
          </label>
          <br />
          <label>
            Water %:
            <input 
              type="range" 
              name="water" 
              step="5"
              value={this.state.water} 
              onChange={this.handleInput} 
            />
          </label>
          <label>
            &nbsp; Forest %:
            <input 
              type="range" 
              name="trees" 
              step="5"
              value={this.state.trees}
              onChange={this.handleInput}
            />
          </label>
          <br />
          <label>
            Road? 
            <input 
              type="checkbox" 
              name="road" 
              checked={this.state.road} 
              // onClick={() => this.setState(
              //   prevstate => (
              //     {road: (!prevstate.road)}
              //   )
              // )}  
              onChange={this.handleInput}
            />
          </label>
          <br />
          <input 
            type="submit" 
            value="Update" 
          />
          <input 
            type="reset" 
            value="Reset" 
          />
        </form>
        <Grid 
          width={this.state.width} 
          height={this.state.height}
          water={this.state.water}
          trees={this.state.trees}
          road={this.state.road}
        />
      </div>
    )
  }
}

class Grid extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired, 
    height: PropTypes.number.isRequired,
    water: PropTypes.number.isRequired,
    trees: PropTypes.number.isRequired,
    road: PropTypes.bool.isRequired,
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
    const blankGrid = [];
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        // debugger;
        blankGrid.push({x: j+1, y: i+1});
      }
    }

    //gets perimeter cell values
    const perimGrid = [];
    for (let i = 0; i <= blankGrid.length; i++)
      if (
        blankGrid[i].x == 1 ||
        blankGrid[i].y == 1 ||
        (blankGrid[i].x == 1 && blankGrid[i].y == 1) ||
        blankGrid[i].x == this.props.width ||
        blankGrid[i].y == this.props.height ||
        (blankGrid[i].x == this.props.width && blankGrid[i].y == this.props.height)
      ) {
        perimGrid.push(blankGrid[i])
      }

    console.log(blankGrid)

    //fills grid per settings on water/land slider
    //debugger;
    const waterPath = {};
    const perimeter = (2*this.props.width) + (2*this.props.height);
    const seed = Math.round(Math.random()*perimeter);



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
            (index%this.props.width) !== 0 ? 
            <canvas 
              key={'x' + elem.x + 'y' + elem.y} 
              width={pxValue + 'px'} 
              height={pxValue + 'px'} 
              style={{display: 'inline', border:'1px solid #000000'}} 
            /> :
            <React.Fragment key={index}>
              <hr 
                style={{height:'1px', visibility:'hidden', marginBottom: '-15px'}} 
              />
              <canvas 
                key={'x' + elem.x + 'y' + elem.y}
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
