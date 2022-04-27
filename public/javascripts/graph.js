Object.defineProperty(exports, "__esModule", { value: true });
var graphology_1 = require("graphology");
var sigma_1 = require("sigma");
var forceAtlas2 = require('graphology-layout-forceatlas2');
var circular_1 = require("graphology-layout/circular");
var container = document.getElementById("sigma-container");
var graph = new graphology_1();

let now = 1;
let counter = 0;
let list = [];
for (let i = 0; i < document.currentScript.getAttribute('height'); ++i) {
	list.push([]);
	let prev = 0;
	for (let j = 0; j < now; ++j) {
		graph.addNode("user" + counter.toString(), { x: -10 + 20 / (now + 1) * (j + 1), y: 0 - i * 2, size: 10, label: "user" + counter.toString(), color: "blue" });
		list[i].push("user" + counter.toString());
		++counter;
		if (j != 0 && j % 2 == 0) {
			++prev;
		}
		if (i != 0) {
			--counter;
			graph.addEdge(list[i - 1][prev], "user" + counter.toString(), {size: 5});
			++counter;
		}
	}
	now *= 2;
}

forceAtlas2.assign(graph, {
  iterations: 50,
  settings: {
    gravity: 0
  }
});

var renderer = new sigma_1.default(graph, container);

renderer.on('clickNode', function(e) {
  window.location.replace("./user?id=" + e.node.toString());
});