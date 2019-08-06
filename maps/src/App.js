import React, {Component} from 'react';
//import React from 'react';
import './App.css';


function App() {
  return (
    <div className="App">
      <Grid />
    </div>
  );
}

class Grid extends React.Component {
  state = {width: 0, height: 0, isUserConfirm: false}

  handleInput = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleUpdate = (e) => {
    e.preventDefault()
    this.setState({isUserConfirm: true})
  }

  handleReset = (e) => {
    e.preventDefault()
    this.setState({width: 0, height: 0, isUserConfirm: false})
  }

  render() {
    return (
        <form onSubmit = {this.handleUpdate} onReset = {this.handleReset} >
          <label>
            Width
            <input type="text" name="width" value={this.state.width} onChange={this.handleInput} />
          </label>
          <label>
            Height
            <input type="text" name="height" value={this.state.height} onChange={this.handleInput} />
          </label>
          <br />
          <input type="submit" value="Update" />
          <input type="reset" value="Reset" />
        </form>
    )
  }
}

  


export default App;
