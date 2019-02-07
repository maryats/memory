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
      num_clicks: 0,
      selected: [],
      matched: [],
      tiles: []
    };

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => { console.error("Unable to join", resp); });
  }

  render() {
    return (
      <div className="container memory-container">
        <div className="row memory-row">
          <div className="col column column-50">
            <h5 className="click-count">Clicks: {this.state.num_clicks}</h5>
          </div>
          <div className="col column column-50 restart-container">
            <button onClick={this.restartGame.bind(this)}>Restart</button>
          </div>
        </div>
        {this.renderRows()}
      </div>
    );
  }

  renderRows() {
    if (this.state.matched.length == this.state.tiles.length) {
      return <div className="row game-over">
        <div className="column">
          <h2>You did it!</h2>
          <h4>Final score: {this.state.num_clicks} clicks</h4>
          <p>Can you do better?</p>
        </div>
      </div>;
    } else {
      return _.map(_.chunk(this.state.tiles, 4), (row, idx) => {
        return <div className="row memory-row" key={idx}>
          {this.renderColumns(row, idx * 4)}
        </div>;
      })
    }    
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
    this.setState(view.game);
  }

  flipTile(idx) {
    let selected = this.state.selected.slice();
    let tiles = this.state.tiles.slice();
    let matched = this.state.matched.slice();

    // ignore clicks on already-flipped tiles or if two tiles already selected
    if (selected.length < 2 && !selected.includes(idx) && !matched.includes(idx)) {
      selected.push(idx);
      this.selectTile(selected);

      // ask server to evaluate guess after a delay 
      if (selected.length == 2) {
        setTimeout(() => {this.makeGuess(selected);}, 1000);
      }
    }
  }

  selectTile(selected) {
    this.channel.push("select", { selected: selected })
      .receive("ok", this.gotView.bind(this));
  }

  makeGuess(selected) {
    this.channel.push("guess", { selected: selected })
      .receive("ok", this.gotView.bind(this));
  }

  restartGame() {
    this.channel.push("restart").receive("ok", this.gotView.bind(this));
  }
}

function Tile(props) {
  return <div className={props.isMatched ? "tile hidden" : "tile"} onClick={props.onClick}>
    <h3>{props.isFaceUp ? props.value : ""}</h3>
  </div>;
}