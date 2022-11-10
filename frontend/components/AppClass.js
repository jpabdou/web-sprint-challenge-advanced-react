import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor(props){
    super(props);
    this.state =initialState
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.


  getXY =()=> {
    const positions = [[1, 1], [2, 1], [3, 1],
      [1, 2], [2, 2], [3, 2],
      [1, 3], [2, 3], [3, 3]]
    return positions[this.state.index]

    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage=()=> {
    const results = this.getXY()
    return `Coordinates (${results[0]}, ${results[1]})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset=()=> {
    this.setState(initialState)
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex =(direction) =>{
    let newIdx = 0
    switch(direction){
      case "left":
        if ((this.state.index) % 3 ===0 ) {
          newIdx = this.state.index
        } else {
          newIdx = this.state.index -1
        }
        break;
      case "right":
        if ((this.state.index +1) % 3 ===0 ) {
          newIdx = this.state.index
        } else {
          newIdx = this.state.index +1
        }
        break;
      case "up":
        if (this.state.index <= 2 ) {
          newIdx = this.state.index
        } else {
          newIdx = this.state.index -3
        }
        break;                
      case "down":
        if (this.state.index >= 6 ) {
          newIdx = this.state.index
        } else {
          newIdx = this.state.index +3
        }   
    }
    if (newIdx === this.state.index){
      this.setState({...this.state, index: newIdx, message: `You can't go ${direction}`})      
    } else {
      let newSteps = this.state.steps + 1
      this.setState({...this.state, index: newIdx, steps: newSteps, message: initialMessage})
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move=(evt)=> {
    this.getNextIndex(evt.target.id)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange=(evt)=> {
    this.setState({...this.state, [evt.target.id]: evt.target.value})
    // You will need this to update the value of the input.
  }

  onSubmit=(evt)=> {
    evt.preventDefault()
    const results = this.getXY()
    axios.post("http://localhost:9000/api/result",{
      x: results[0], y: results[1], email: this.state.email, steps: this.state.steps
    })
      .then(res=>{this.setState({...this.state, email: initialEmail, message: res.data.message})})
      .catch(error=>this.setState({...this.state,message: error.response.data.message}))
    // Use a POST request to send a payload to the server.
  }


  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? "time": "times"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form  onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit" ></input>
        </form>
      </div>
    )
  }
}
