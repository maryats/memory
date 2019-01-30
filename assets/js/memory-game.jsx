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
    this.state = INITIAL_STATE;
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
          <button onClick={this.restartGame.bind(this)}>Restart</button>
        </div>
      </div>
      );
  }

  renderColumns(columns, startIdx) {
    return _.map(columns, (val, idx) => {
      let index = startIdx + idx;
      return <div key={index} className="column">
        <Tile 
          onClick={this.flipCard.bind(this, index)}
          value={val} 
          isFaceUp={this.state.selected.includes(index) || this.state.matched.includes(index)}
        />
      </div>;
    });
  }

  flipCard(idx) {
    console.log(this.state);
    let selected = this.state.selected;
    let tiles = this.state.tiles;
    let newMatched = this.state.matched.slice();

    if (!selected.includes(idx) && !this.state.matched.includes(idx)) {
      let newSelected = selected.slice();
      newSelected.push(idx);

      // check for match
      if (newSelected.length == 2) {
        // matched!
        if (tiles[newSelected[0]] == tiles[newSelected[1]]) {
          newMatched = newMatched.concat(newSelected);
        }
        newSelected = [];
      }

      // clear selected, increment clicks, update matched
      this.setState(_.assign(this.state, {
        selected: newSelected, 
        numClicks: this.state.numClicks + 1,
        matched: newMatched
      }));
    }
  }

  restartGame() {
    this.setState(INITIAL_STATE);
  }
}

function Tile(props) {
  return <button onClick={props.onClick}>
    {props.isFaceUp ? props.value : ""}
  </button>;
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { left: false };
  }

  swap(_ev) {
    let state1 = _.assign({}, this.state, { left: !this.state.left });
    this.setState(state1);
  }

  hax(_ev) {
    alert("hax!");
  }

  render() {
    let button = <div className="column" onMouseMove={this.swap.bind(this)}>
    <p><button onClick={this.hax.bind(this)}>Click Me</button></p>
    </div>;

    let blank = <div className="column">
    <p>Nothing here.</p>
    </div>;

    if (this.state.left) {
      return <div className="row">
      {button}
      {blank}
      </div>;
    }
    else {
      return <div className="row">
      {blank}
      {button}
      </div>;
    }
  }
}

