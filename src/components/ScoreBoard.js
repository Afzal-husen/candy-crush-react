import React from "react";

const ScoreBoard = ({score, movesLeft}) => {
return(
    <div className="score">
        <h2>Score</h2>
        <h1>{score}</h1>
        <h2>Moves left</h2>
        <h1>{movesLeft}</h1>
    </div>
)
}

export default ScoreBoard;