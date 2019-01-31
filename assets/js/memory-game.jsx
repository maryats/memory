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
  tiles: ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F",  "F", "G",  "G", "H",  "H"],
  isDelay: false
};

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getStartingGameState();
  }

  render() {
    return (
      <div className="container memory-container">
        <div className="row memory-row">
          <div className="col column column-50">
            <h5 className="click-count">Clicks: {this.state.numClicks}</h5>
          </div>
          <div className="col column column-50 restart-container">
            <button onClick={this.restartGame.bind(this)}>Restart</button>
          </div>
        </div>
        <div className="row memory-row">
          {this.renderColumns(this.state.tiles.slice(0,4), 0)}
        </div>
        <div className="row memory-row">
          {this.renderColumns(this.state.tiles.slice(4,8), 4)}
        </div>
        <div className="row memory-row">
          {this.renderColumns(this.state.tiles.slice(8,12), 8)}
        </div>
        <div className="row memory-row">
          {this.renderColumns(this.state.tiles.slice(12,16), 12)}
        </div>
      </div>
    );
  }

  renderColumns(columns, startIdx) {
    return _.map(columns, (val, idx) => {
      let index = startIdx + idx;
      return <div key={index} className="col column">
        <Tile 
          onClick={this.flipTile.bind(this, index)}
          value={val} 
          isMatched={this.state.matched.includes(index)}
          isFaceUp={this.state.selected.includes(index)}
        />
      </div>;
    });
  }

  flipTile(idx) {
    let selected = this.state.selected.slice();
    let tiles = this.state.tiles.slice();
    let matched = this.state.matched.slice();

    // ignore clicks during delay, or if tile already flipped
    if (!this.state.isDelay && !selected.includes(idx) && !matched.includes(idx)) {
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

        // delay hiding unmatched tiles
        this.setState(_.assign(this.state, {isDelay: true}));
        setTimeout(() => {
          this.setState(_.assign(this.state, {
            selected: [], 
            matched: matched,
            isDelay: false
          }));
        }, 1000);
      }
    }
  }

  restartGame() {
    this.setState(this.getStartingGameState());
  }

  getStartingGameState() {
    let shuffledTiles = _.shuffle(INITIAL_STATE.tiles);
    return _.assign({}, INITIAL_STATE, {tiles: shuffledTiles});
  }
}

function Tile(props) {
  return <div className={props.isMatched ? "tile hidden" : "tile"} onClick={props.onClick}>
    <h3>{props.isFaceUp ? props.value : ""}</h3>
  </div>;
}