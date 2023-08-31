import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [time, setTime] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [bestTime, setBestTime] = React.useState(
    localStorage.getItem('bestTime') !== null ?       // check if any time exists in localStorage
    JSON.parse(localStorage.getItem('bestTime')) : 0  // if not, set it to 0 
  )

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random()* 6), // generate random number between 1 and 6
      isHeld: false,
      id: nanoid()
    }
  }
  function allNewDice() {              
    const newDice = []
    for(let i = 0; i < 10; i++) {    
    newDice.push(generateNewDie())  // add 10 random dice 
    }
    return newDice
  }
  function rollDice() {
    if(!tenzies) {      // if the game is not finished, reroll
      setDice(oldDice => oldDice.map(die => {
          return die.isHeld ? 
              die :
              generateNewDie()
      }))

      setCount(oldCount => oldCount + 1)
      setIsRunning(true)
    } else {            // else, game is finished, reset dice, count and time
      setTenzies(false)
      setDice(allNewDice())
      setCount(0)
      setTime(0)
    }
  }
  function holdDice(id) {  // hold dice in hand 
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} :
        die 
    }))
  }

  React.useEffect(() => {  
    const allHeld = dice.every(die => die.isHeld) // check if player holds every dice
    const firstValue = dice[0].value  
    const allSameValue = dice.every(die => die.value == firstValue) // check if dice are the same value
    if(allHeld && allSameValue) {   // check if the game is finished
      setTenzies(true)    // activates confetti
      setIsRunning(false) // stops timer
    }
  },[dice])

  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10); // setting time from 0 to 1 every 10 miliseconds
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  React.useEffect(() => {                 // updating value of best time if the record is broken
    if(bestTime !== 0) {
       if(time !== 0 && time < bestTime) {  
        setBestTime(time)
       } 
    } else {
      setBestTime(time)
    }
  }, [isRunning])

  React.useEffect(() => {       
    localStorage.setItem('bestTime', JSON.stringify(bestTime)); // saving best time in localStorage
  }, [bestTime])

  const diceElements = dice.map(die => (  // mapping all dice for displaying
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>
  ))
  
  const minutes = Math.floor((time % 360000) / 6000); // minutes calculation 
  const seconds = Math.floor((time % 6000) / 100); // seconds calculation
  const milliseconds = time % 100; // milliseconds calculation

  const minutesBest = Math.floor((bestTime % 360000) / 6000); // same time calculation but for best time
  const secondsBest = Math.floor((bestTime % 6000) / 100);
  const millisecondsBest = bestTime % 100;  

  return (
    <main>
      {tenzies && <Confetti />}  
      <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to 
          freeze it at its current value between rolls.</p>
        <div className="stats">  
          <p>Roll count: {count}</p> 
          <p>Time:  {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}:
                    {milliseconds.toString().padStart(2, "0")} </p>
          <p>Best time: {minutesBest.toString().padStart(2, "0")}:
                        {secondsBest.toString().padStart(2, "0")}:
                        {millisecondsBest.toString().padStart(2, "0")} </p>
        </div>
      <div className="dice-container"> 
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
    </main>
  )
}

