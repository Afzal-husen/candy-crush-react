import React, { useEffect, useState } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blueCandy from "./images/blue-candy.png"
import redCandy from "./images/red-candy.png"
import orangeCandy from "./images/orange-candy.png"
import purpleCandy from "./images/purple-candy.png"
import greenCandy from "./images/green-candy.png"
import yellowCandy from "./images/yellow-candy.png"
import blank from "./images/blank.png"

const width = 8;
const candyColor = [
    blueCandy,
    redCandy,
    yellowCandy,
    orangeCandy,
    greenCandy,
    purpleCandy
]

// let squareBeingDragged;
// let squareBeingReplaced;
// let squareIdBeingDragged;
// let squareIdBeingReplaced;



function App() {
  const[allColors, setAllColors] = useState([]);
  const[squareBeingDragged, setSquareBeingDragged] = useState(null);
  const[squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const[scoreBoardDisplay, setScoreBoardDisplay]= useState(0);
  const[movesLeft, setMovesLeft] = useState(5)
  
  function createBoard() {
    const randomColorArray = [];
    for(let i = 0; i < width*width; i++) {
      let randomNumber = Math.floor(Math.random() * candyColor.length);
      let randomColor = candyColor[randomNumber];
      randomColorArray.push(randomColor);
    }
    setAllColors(randomColorArray)
  }
  useEffect(() => {
    createBoard();
  }, [])

  
  function checkForColumnOFThree() {
    for(let i = 0; i<47; i++) {
      const columnOFThree = [i, i+width, i+width*2];
      let firstColor = allColors[i];
      const isBlank = allColors[i] === blank;
      
      if( columnOFThree.every( index => allColors[index] === firstColor && !isBlank)) {
        setScoreBoardDisplay((score) => score + 3)
        columnOFThree.forEach( index => allColors[index] = blank)
        return true;
      }
      
    }
  }
  useEffect(() => {
    const time = setInterval(() => {
      checkForRowOfFour();
      checkForColumnOfFour();
      checkForRowOFThree();
      checkForColumnOFThree();
      candiesMoveDown();
      setAllColors([...allColors])
    }, 100)
    return () => clearInterval(time)
  }, [checkForColumnOFThree, checkForColumnOfFour, checkForRowOfFour, checkForRowOFThree, candiesMoveDown, allColors])

  function checkForColumnOfFour() {
    for(let i=0; i<39; i++) {
      const columnOfFour = [i, i+width, i+width*2, i+width*3];
      let firstColor = allColors[i];
      const isBlank = allColors[i] === blank;
      
      if( columnOfFour.every(index => allColors[index] === firstColor && !isBlank)) {
        setScoreBoardDisplay((score) => score + 4)
        columnOfFour.forEach(index => allColors[index] = blank)
        return true;
      }
    }
  }

  function checkForRowOFThree(){
    for(let i = 0; i<61; i++) {
        const rowOfThree = [i, i+1, i+2];
        let firstColor = allColors[i];
        const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63];
        const isBlank = allColors[i] === blank;

        if( notValid.includes(i)) {
          continue;
        }

        if( rowOfThree.every(index => allColors[index] === firstColor && !isBlank)) {
          setScoreBoardDisplay((score) => score + 3)
          rowOfThree.forEach(index => allColors[index] = blank);
          return true;
        }
    }
  }
 

  function checkForRowOfFour() {
    for( let i=0; i<60; i++) {
      const rowOfFour = [i, i+1, i+2,i+3];
      let firstColor = allColors[i];
      let notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63];
      const isBlank = allColors[i] === blank;

      if(notValid.includes(i)) {
        continue
      }
      if( rowOfFour.every(index => allColors[index] === firstColor && !isBlank)) {
        setScoreBoardDisplay((score) => score + 4)
        rowOfFour.forEach(index => allColors[index] = blank)
        return true;
      }
    }
  }

  function candiesMoveDown() {
    for(let i = 0; i<55; i++) {
      if(allColors[i+width] === blank) {
        allColors[i+width] = allColors[i];
        allColors[i] = blank;
      }
        const firstRow = [0,1,2,3,4,5,6,7];
    const isFirstRowEmpty = firstRow.includes(i);
    if(isFirstRowEmpty && allColors[i] === blank) {
      let randomNumber = Math.floor(Math.random() * candyColor.length);
      let randomColor = candyColor[randomNumber];
      allColors[i] = randomColor
    }
    }
  }

  function DragStart(e) {
    console.log(e.target)
    setSquareBeingDragged(e.target);

  }

  function DragEnd(e) {
    console.log(e.target);

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    allColors[squareBeingReplacedId] = squareBeingDragged.getAttribute("src");
    allColors[squareBeingDraggedId] = squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId,
      squareBeingDraggedId+1,
      squareBeingDraggedId-1,
      squareBeingDraggedId+width,
      squareBeingDraggedId-width
    ]

    const isRowOfFour = checkForRowOfFour();
    const isRowOfThree = checkForRowOFThree();
    const isColumnOfFour = checkForColumnOfFour();
    const isColumnOfThree = checkForColumnOFThree();

    const legalMove = validMoves.includes(squareBeingReplacedId);

    if( squareBeingReplacedId &&
       legalMove &&
       ( isColumnOfFour || isColumnOfThree || isRowOfFour || isRowOfThree)) {
          
          setSquareBeingDragged(null);
          setSquareBeingReplaced(null);
          setMovesLeft((prevValue) => {
            if(prevValue >= 1) {
              return prevValue - 1;
            } else {
              return prevValue
            }
          })
    } else{
      allColors[squareBeingReplacedId] = squareBeingReplaced.getAttribute("src");
      allColors[squareBeingDraggedId] = squareBeingDragged.getAttribute("src");
      setAllColors([...allColors])
    }
  }

  function DragDrop(e) {
    console.log(e.target);
    setSquareBeingReplaced(e.target);
  }


  return(
    <main className="main-container">
      <div className="grid">
        {allColors.map((color, i) => {
          return <img src={color} id={i} draggable={true}  key={i} alt={color}
            onDragStart={DragStart}
            onDragOver={e => e.preventDefault()}
            onDragEnter={e => e.preventDefault()}
            onDrop={DragDrop}
            onDragEnd={DragEnd}
            data-id={i}
          />
        })}
      </div>
      <ScoreBoard movesLeft={movesLeft}  score={scoreBoardDisplay}/>
    </main>
  )
}

export default App;