import React, {useState} from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const initialState= {message: initialMessage, email: initialEmail, steps: initialSteps, index: initialIndex}
  const [gameState, setGameState] = useState(initialState)
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    const positions = [[1, 1], [2, 1], [3, 1],
      [1, 2], [2, 2], [3, 2],
      [1, 3], [2, 3], [3, 3]]
    return positions[gameState.index]

    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    const results = getXY()
    return `Coordinates (${results[0]}, ${results[1]})`
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setGameState(initialState)
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    let newIdx = 0
    switch(direction){
      case "left":
        if ((gameState.index) % 3 ===0 ) {
          newIdx = gameState.index
        } else {
          newIdx = gameState.index -1
        }
        break;
      case "right":
        if ((gameState.index +1) % 3 ===0 ) {
          newIdx = gameState.index
        } else {
          newIdx = gameState.index +1
        }
        break;
      case "up":
        if (gameState.index <= 2 ) {
          newIdx = gameState.index
        } else {
          newIdx = gameState.index -3
        }
        break;                
      case "down":
        if (gameState.index >= 6 ) {
          newIdx = gameState.index
        } else {
          newIdx = gameState.index +3
        }   
    }
    if (newIdx === gameState.index){
      setGameState({...gameState, index: newIdx, message: `You can't go ${direction}`})      
    } else {
      let newSteps = gameState.steps + 1
      setGameState({...gameState, index: newIdx, steps: newSteps, message: initialMessage})
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    getNextIndex(evt.target.id)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setGameState({...gameState, [evt.target.id]: evt.target.value})
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault()
    const results = getXY()
    axios.post("http://localhost:9000/api/result",{
      x: results[0], y: results[1], email: gameState.email, steps: gameState.steps
    })
      .then(res=>setGameState({...gameState, email: initialEmail,message: res.data.message}))
      .catch(error=>setGameState({...gameState,message: error.response.data.message}))
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {gameState.steps} {gameState.steps === 1 ? "time": "times"}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === gameState.index ? ' active' : ''}`}>
              {idx === gameState.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{gameState.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={gameState.email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
