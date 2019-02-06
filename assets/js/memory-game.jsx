import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;

    this.state = {
      numClicks: 0,
      selected: [],
      matched: [],
      tiles: [],
      isDelay: false
    };

    this.channel.join()
    .receive("ok", this.gotView.bind(this))
    .receive("error", resp => { console.log("Unable to join", resp); });
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

  gotView(view) {
    console.log(view.game);
    this.setState(view.game);
  }

  onGuess(selected) {
    this.channel.push("guess", { selected: selected })
    .receive("ok", this.gotView.bind(this));
  }

  flipTile(idx) {
    let selected = this.state.selected.slice();
    let tiles = this.state.tiles.slice();
    let matched = this.state.matched.slice();

    // ignore clicks during delay, or if tile already flipped
    if (!this.state.isDelay && !selected.includes(idx) && !matched.includes(idx)) {
      selected.push(idx);
      this.onGuess(selected);

      
    }
  }

  restartGame() {
    console.log("restart");
    this.channel.push("restart").receive("ok", this.gotView.bind(this));
  }
}

function Tile(props) {
  return <div className={props.isMatched ? "tile hidden" : "tile"} onClick={props.onClick}>
  <h3>{props.isFaceUp ? props.value : ""}</h3>
  </div>;
}