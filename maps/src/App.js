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
    path: "road",
    grid: []
  }

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleCheckbox = (e) => {
    this.setState({[e.target.name]: e.target.checked})
  }

  handleUpdate = (e) => {
    e.preventDefault()
    this.setState({
      width: parseInt(this.state.upWidth), 
      height: parseInt(this.state.upHeight)},
      () => {this.generateSeedGrid()}
    )
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
      path: "road",
      grid: []
    })
  }

  generateSeedGrid = () => {
    //initialize grid
    const blankGrid = [];
    for (let i = 0; i < this.state.height; i++) {
      for (let j = 0; j < this.state.width; j++) {
        // debugger;
        blankGrid.push(0);
      }
    }

    //Gets the array of perimiter cells
    const perimArray = [];
    for (let i = 0; i < blankGrid.length; i++) {
      if (
        i <= (this.state.width - 1)  ||
        (i%this.state.width) === 0 ||
        (i%this.state.width) === (this.state.width - 1) ||
        (i > this.state.width*(this.state.height - 1))
      ){
        perimArray.push(i);
      }
     }
     //console.log(perimArray)

    //fills grid per settings on water/land slider
    //debugger;
    const seed = Math.round(Math.random()*(perimArray.length-1))
    let seedGrid = blankGrid;
    const seedCell = perimArray[seed]
    let side = 0
    
    if (seedCell <= (this.state.width - 1)) {
      side = 1;
    } else if ((seedCell % this.state.width) === 0){
      side = 2;
    } else if ((seedCell % this.state.width) === (this.state.width - 1)) {
      side = 3;
    } else if ((seedCell > this.state.width*(this.state.height - 1))) {
      side = 4;
    } else {
      side = null;
    }

    seedGrid[seedCell] = 'w';

    seedGrid = this.riverRun(side, seedCell, seedGrid);

    seedGrid = this.countryRoads(side, null, seedGrid, 1);

    this.setState({grid: seedGrid})
  }

  //function for a closer-than-random gaussian distribution
  gDist(v){ 
    var r = 0;
    for(var i = v; i > 0; i --){
        r += Math.random();
    }
    return r / v;
  }

  riverRun = (side, cur, grid) => {
    let next = []

    switch (side) {
      case 1:
        next = [
          cur + (this.state.width - 1),
          cur + this.state.width,
          cur + (this.state.width + 1)
        ];
      break;
      case 2:
        next = [
          cur - (this.state.width - 1),
          cur + 1,
          cur + (this.state.width + 1)
        ];
      break;
      case 3:
        next = [
          cur - (this.state.width + 1),
          cur - 1,
          cur + (this.state.width - 1)
        ];
      break;
      case 4:
        next = [
          cur - (this.state.width + 1),
          cur - this.state.width,
          cur - (this.state.width - 1)
        ];
      break;
      default:
      break;
    }

    let tempNext = next[Math.round(Math.random()*(next.length-1))];
    while (tempNext > (this.state.width * this.state.height) - 1 || tempNext < 0) {
      tempNext = next[Math.round(Math.random()*(next.length-1))];
    }

    grid[tempNext] = 'w';

    if (
      tempNext <= (this.state.width - 1)  ||
      (tempNext % this.state.width) === 0 ||
      (tempNext % this.state.width) === (this.state.width - 1) ||
      (tempNext > this.state.width*(this.state.height - 1))
    ){ 
      return (grid);
    } else {
      this.riverRun(side, tempNext, grid)
      return (grid);
    }
  }

  countryRoads = (side, cur, grid, i) => {
    let next = []
    let setSide
    switch (this.state.path) {
      case "road":
        setSide = (side === 1 || side === 4) ? 1 : 2;
        //sets random start along side parallel to water
        if (cur === null) {
          if (setSide === 1) {
            cur = Math.round(this.gDist(7)*(this.state.width - 1))
          } else {
            cur = (Math.round(this.gDist(7)*(this.state.height-1)))*this.state.width;
          }
          grid[cur] = "p";
        }
        break;
      case "bridge":
        setSide = (side === 1 || side === 4) ? 2 : 1;
        if (cur === null) {
          if (setSide === 2) {
            cur = Math.round(Math.random()*(this.state.width - 1))
          } else {
            cur = (Math.round(Math.random()*(this.state.height-1)))*this.state.width;
          }
          grid[cur] = "p";
        }
        break;
      default:
        cur = -1;
        break;
    }
    console.log(cur)

    //collects next cell possibilities
    switch (setSide) {
      case 1:
        next = [
          cur + (this.state.width - 1),
          cur + this.state.width,
          cur + (this.state.width + 1)
        ]; 
        break;
      case 2:
        next = [
          cur - (this.state.width - 1),
          cur + 1,
          cur + (this.state.width + 1)
        ];
        break;
      
      default:
        next = [-1];
        break;
    } 
    console.log(next)   
    
    let tempNext = next[Math.round((next.length-1)*this.gDist(3))];
    while (tempNext > (this.state.width * this.state.height) - 1 || tempNext < 0) {
      tempNext = next[Math.round((next.length-1)*this.gDist(2))];
    }

    console.log(tempNext)

    grid[tempNext] = 'p';
    i++;
    if (
      (
        setSide === 1 && i === this.state.height) || 
      (
        setSide === 2 && i === this.state.width)
      ){ 
      return (grid);
    } else {
      this.countryRoads(side, tempNext, grid, i)
      return (grid);
    }
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
          <React.Fragment> 
            <input 
              type="radio" 
              id="road"
              name="path" 
              value="road" 
              onChange={this.handleInput}
            />
            <label>Road</label>
          </React.Fragment>
          <React.Fragment> 
            <input 
              type="radio" 
              id="bridge"
              name="path" 
              value="bridge" 
              onChange={this.handleInput}
            />
            <label>Bridge</label>
          </React.Fragment>
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
          path={this.state.path}
          grid={this.state.grid}
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
    path: PropTypes.string.isRequired,
    grid: PropTypes.array.isRequired
  }

  state={
    winWidth: window.innerWidth, 
    winHeight: window.innerHeight,
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
    //sets px value for square cells based on window heights, picking the smallest
    let pxValue = (this.state.winWidth<=this.state.winHeight) ? this.state.winWidth : this.state.winHeight;
    let maxInput = (this.props.width>=this.props.height) ? this.props.width : this.props.height;
    pxValue = (pxValue-200)/maxInput

    const varMargin = (-(Math.abs(this.props.height - this.props.width)/(Math.min([this.props.width, this.props.height])))) + '%'

    return (
      <div>
        <br/>
        {
          this.props.grid.map((elem, index) => {
            // debugger;
            if (elem === 0) {
              return (
                (index % this.props.width) !== 0 ? 
                  (
                    <canvas 
                      key={index}
                      value={elem} 
                      width={pxValue + 'px'} 
                      height={pxValue + 'px'} 
                      style={{
                        display: 'inline', 
                        border:'1px solid #000000'
                      }} 
                    />
                  ) : (
                    <React.Fragment key={index}>
                      <hr 
                        style={{
                          height:'1px', 
                          visibility:'hidden', 
                          marginBottom: varMargin
                        }} 
                      />
                      <canvas 
                        key={index}
                        value={elem}
                        width={pxValue + 'px'} 
                        height={pxValue + 'px'}  
                        style={{
                          display: 'inline', 
                          border:'1px solid #000000'
                        }} 
                      />
                      
                    </React.Fragment>
                  )
              )
            } else if (elem === 'w') {
              return (
                (index % this.props.width) !== 0 ? 
                  (
                    <canvas 
                      key={index}
                      value={elem} 
                      width={pxValue + 'px'} 
                      height={pxValue + 'px'} 
                      style={{
                        display: 'inline', 
                        border:'1px solid #000000', 
                        backgroundColor:'#006994'
                      }}
                    />
                  ) : (
                    <React.Fragment key={index}>
                      <hr 
                        style={{
                          height:'1px', 
                          visibility:'hidden', 
                          marginBottom: varMargin
                        }} 
                      />
                      <canvas 
                        key={index}
                        value={elem}
                        width={pxValue + 'px'} 
                        height={pxValue + 'px'}  
                        style={{
                          display: 'inline', 
                          border:'1px solid #000000', 
                          backgroundColor:'#006994'
                        }} 
                      />
                    </React.Fragment>
                  )
              )
            } else if (elem === 'p') {
              return (
                (index % this.props.width) !== 0 ? 
                  (
                    <canvas 
                      key={index}
                      value={elem} 
                      width={pxValue + 'px'} 
                      height={pxValue + 'px'} 
                      style={{
                        display: 'inline', 
                        border:'1px solid #000000', 
                        backgroundColor:'#888c8d'
                      }}
                    />
                  ) : (
                    <React.Fragment key={index}>
                      <hr 
                        style={{
                          height:'1px', 
                          visibility:'hidden', 
                          marginBottom: varMargin
                        }} 
                      />
                      <canvas 
                        key={index}
                        value={elem}
                        width={pxValue + 'px'} 
                        height={pxValue + 'px'}  
                        style={{
                          display: 'inline', 
                          border:'1px solid #000000', 
                          backgroundColor:'#888c8d'
                        }} 
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
