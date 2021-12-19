import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

function SimpleButton(props) {
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.text}
        </button>
    )
}
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        //build the board array before returning
        let boardSquares = []; //init empty board array
        for (let row = 0; row < 3; row++) {
            let boardRow = []; //init empty row array
            for (let col = 0; col < 3; col++) {
                let i = (row * 3) + col;
                //span is a tag used as INLINE container to mark up part of text
                //div would have added carriage return, resulting in one column of squares 
                boardRow.push(<span key={i}>{this.renderSquare(i)}</span>);
            }
            //note concat returns new array without modifying
            //push adds new element to array and returns the length
            boardSquares = boardSquares.concat(<div className="board-row" key={row}>{boardRow}</div>);
        }

        return (
            <div>{boardSquares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                mRow: 0,
                mCol: 0, //location of each move
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        //slice history to remove the incorrect "future history" if we go back in time
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //triggers only if winner or squares is NOT null
        //to prevent re-filling a square, and ends the game 
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //add this move to the sliced history
            history: history.concat([{
                squares: squares,
                mRow: (i - (i % 3)) / 3,
                mCol: i % 3,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    resetGame() {
        this.setState({
            history: [{
                squares: Array(9).fill(null),
                mCol: 0,
                mRow: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
        });
    }

    jumpTo(step) {
        //Bold the selected move item
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]; //grab the current board state
        const winner = calculateWinner(history[history.length - 1].squares);


        let mList;
        //stepnumber = 0 means null game board (game hasn't started)
        if (this.state.stepNumber === 0) { mList = null }
        else { //Only render list if the game has started! (moveNumber > 0)
            //mList = Move history list
            //step = current history element value (don't care about it)
            //moveNumber = current history element index (0 = null board)
            mList = history.map((step, moveNumber) => {
                if (moveNumber < history.length - 1) {
                    moveNumber++; //skip moveNumber 0 (the null board)
                    const row = history[moveNumber].mRow;
                    const col = history[moveNumber].mCol;
                    const desc =
                        ((moveNumber % 2) === 0 ? 'O' : 'X') +
                        ' at   (' + row + ', ' + col + ')';
                    return (
                        <li key={moveNumber}>
                            <SimpleButton
                                //CSS logic to bold the selected move
                                className={(moveNumber) === this.state.stepNumber ? "button-bold" : "button"}
                                text={desc}
                                onClick={() => this.jumpTo(moveNumber)}
                            />
                        </li>
                    );
                } else {
                    return;
                }
            });
        }

        let status;
        if (winner) {
            status = 'The Winner is: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board //pass props to board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <SimpleButton
                        text="Reset the game"
                        onClick={() => this.resetGame()}
                    />
                    <ol>{mList}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
