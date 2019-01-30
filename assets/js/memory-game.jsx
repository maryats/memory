import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<MemoryGame />, root);
}

const INITIAL_STATE = {
  numClicks: 0,
  selected: [],
  matched: [],
  tiles: ["A", "A", "B", "B", "C", "C", "D", "D", 
    "E", "E", "F",  "F", "G",  "G", "H",  "H"]
};

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStartingGameState();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h4>Number of Clicks: {this.state.numClicks}</h4>
        </div>
        <div className="row">
          {this.renderColumns(this.state.tiles.slice(0,4), 0)}
        </div>
        <div className="row">
          {this.renderColumns(this.state.tiles.slice(4,8), 4)}
        </div>
        <div className="row">
          {this.renderColumns(this.state.tiles.slice(8,12), 8)}
        </div>
        <div className="row">
          {this.renderColumns(this.state.tiles.slice(12,16), 12)}
        </div>
        <div className="row">
          <button className="button-outline" onClick={this.restartGame.bind(this)}>Restart</button>
        </div>
      </div>
      );
  }

  renderColumns(columns, startIdx) {
    return _.map(columns, (val, idx) => {
      let index = startIdx + idx;
      return <div key={index} className="column">
        <Tile 
          onClick={this.flipTile.bind(this, index)}
          value={val} 
          isFaceUp={this.state.selected.includes(index) || this.state.matched.includes(index)}
        />
      </div>;
    });
  }

  flipTile(idx) {
    let selected = this.state.selected.slice();
    let tiles = this.state.tiles.slice();
    let matched = this.state.matched.slice();

    if (!selected.includes(idx) && !this.state.matched.includes(idx)) {
      selected.push(idx);

      this.setState(_.assign(this.state, {
        selected: selected, 
        numClicks: this.state.numClicks + 1
      }));

      // check for match on second click
      if (selected.length == 2) {
        
        // matched!
        if (tiles[selected[0]] == tiles[selected[1]]) {
          matched = matched.concat(selected);
        }

        setTimeout(() => {
          this.setState(_.assign(this.state, {
          selected: [], 
          matched: matched
        }));}, 1000);
      }
    }    
  }

  restartGame() {
    this.setState(this.getStartingGameState());
  }

  getStartingGameState() {
    let shuffledTiles = _.shuffle(INITIAL_STATE.tiles);
    return _.assign(INITIAL_STATE, {tiles: shuffledTiles});
  }
}

function Tile(props) {
  return <button onClick={props.onClick}>
    {props.isFaceUp ? props.value : "  "}
  </button>;
}