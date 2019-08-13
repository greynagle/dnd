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

  riverRun = (side, cur, grid) => {
    let next = []

    switch (side) {
      case 1:
        next = [
          cur + (this.props.width - 1),
          cur + this.props.width,
          cur + (this.props.width + 1)
        ];
      break;
      case 2:
        next = [
          cur - (this.props.width - 1),
          cur + 1,
          cur + (this.props.width + 1)
        ];
      break;
      case 3:
        next = [
          cur - (this.props.width + 1),
          cur - 1,
          cur + (this.props.width - 1)
        ];
      break;
      case 4:
        next = [
          cur - (this.props.width + 1),
          cur - this.props.width,
          cur - (this.props.width - 1)
        ];
      break;
      default:
      break;
    }
    console.log(next)

    let tempNext = next[Math.round(Math.random()*(next.length-1))];
    while (tempNext > (this.props.width * this.props.height) - 1 || tempNext < 0) {
      tempNext = next[Math.round(Math.random()*(next.length-1))];
    }

    console.log(tempNext)

    grid[tempNext] = 'w';

    if (
      tempNext <= (this.props.width - 1)  ||
      (tempNext % this.props.width) === 0 ||
      (tempNext % this.props.width) === (this.props.width - 1) ||
      (tempNext > this.props.width*(this.props.height - 1))
    ){ 
      return (grid);
    } else {
      this.riverRun(side, tempNext, grid)
      return (grid);
    }
  }

  render() {
    //initialize grid
    const blankGrid = [];
    for (let i = 0; i < this.props.height; i++) {
      for (let j = 0; j < this.props.width; j++) {
        // debugger;
        blankGrid.push(0);
      }
    }

    //Gets the array of perimiter cells
    const perimArray = [];
    for (let i = 0; i < blankGrid.length; i++) {
      if (
        i <= (this.props.width - 1)  ||
        (i%this.props.width) === 0 ||
        (i%this.props.width) === (this.props.width - 1) ||
        (i > this.props.width*(this.props.height - 1))
      ){
        perimArray.push(i);
      }
     }
     //console.log(perimArray)

    //fills grid per settings on water/land slider
    //debugger;
    const waterPath = [];
    const seed = Math.round(Math.random()*(perimArray.length-1))
    let seedGrid = blankGrid;
    const seedCell = perimArray[seed]
    let side = 0
    
    if (seedCell <= (this.props.width - 1)) {
      side = 1;
    } else if ((seedCell % this.props.width) === 0){
      side = 2;
    } else if ((seedCell % this.props.width) === (this.props.width - 1)) {
      side = 3;
    } else if ((seedCell > this.props.width*(this.props.height - 1))) {
      side = 4;
    } else {
      side = null;
    }

    console.log(side)

    seedGrid[seedCell] = 'w';

    seedGrid = this.riverRun(side, seedCell, seedGrid);











    //sets px value for square cells based on window heights, picking the smallest
    let pxValue = (this.state.winWidth<=this.state.winHeight) ? this.state.winWidth : this.state.winHeight;
    let maxInput = (this.props.width>=this.props.height) ? this.props.width : this.props.height;
    pxValue = (pxValue-200)/maxInput

    return (
      <div>
        <br/>
        {
          seedGrid.map((elem, index) => {
            // debugger;
            if (elem == 0) {
              return (
                (index % this.props.width) !== 0 ? 
                  (
                    <canvas 
                      key={index}
                      value={elem} 
                      width={pxValue + 'px'} 
                      height={pxValue + 'px'} 
                      style={{display: 'inline', border:'1px solid #000000'}} 
                    />
                  ) : (
                    <React.Fragment key={index}>
                      <hr 
                        style={{height:'1px', visibility:'hidden', marginBottom: '-15px'}} 
                      />
                      <canvas 
                        key={index}
                        value={elem}
                        width={pxValue + 'px'} 
                        height={pxValue + 'px'}  
                        style={{display: 'inline', border:'1px solid #000000'}} 
                      />
                      
                    </React.Fragment>
                  )
              )
            } else if (elem == 'w') {
              return (
                (index % this.props.width) !== 0 ? 
                  (
                    <canvas 
                      key={index}
                      value={elem} 
                      width={pxValue + 'px'} 
                      height={pxValue + 'px'} 
                      style={{display: 'inline', border:'1px solid #000000', backgroundColor:'#006994'}}
                    />
                  ) : (
                    <React.Fragment key={index}>
                      <hr 
                        style={{height:'1px', visibility:'hidden', marginBottom: '-15px'}} 
                      />
                      <canvas 
                        key={index}
                        value={elem}
                        width={pxValue + 'px'} 
                        height={pxValue + 'px'}  
                        style={{display: 'inline', border:'1px solid #000000', backgroundColor:'#006994'}} 
                      />
                    </React.Fragment>
                  )
              )
            }
        })
      }
      </div>
    )
  }
}




  


export default App;
