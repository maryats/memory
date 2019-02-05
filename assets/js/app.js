// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".

import "phoenix_html";
import $ from "jquery";

import socket from "./socket"
import game_init from "./memory-game";

$(() => {
  let root = $('#root')[0];
  if (root) {
  	let channel = socket.channel("games:" + window.gameName, {});
  	game_init(root, channel);
  }
});