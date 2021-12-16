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
        <button className="status" onClick={props.onClick}>
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
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
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
            //concat this move to the sliced history
            history: history.concat([{
                squares: squares,
                mRow: (i - (i % 3))/3,
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
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]; //grab the current board state
        const winner = calculateWinner(history[history.length-1].squares);
        //step = current history element value (don't care about it)
        //moveNumber = current history element index
        const moves = history.map((step, moveNumber) => {
            const row = history[moveNumber].mRow;
            const col = history[moveNumber].mCol;
            const desc = moveNumber ?
                'move #' + moveNumber + 
                '   (' + row + ', ' + col + ')' :
                'Go to game start';
            return (
                <li key={moveNumber}>
                    <button
                        onClick={() => this.jumpTo(moveNumber)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

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
                        text = "Reset the game"
                        onClick={() => this.resetGame()}
                    />
                    <ol>{moves}</ol>
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
