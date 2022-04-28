Object.defineProperty(exports, "__esModule", { value: true });
var graphology_1 = require("graphology");
var sigma_1 = require("sigma");
var forceAtlas2 = require('graphology-layout-forceatlas2');
var ForceSupervisor = require('graphology-layout-force/worker');
var circular_1 = require("graphology-layout/circular");
var container = document.getElementById("sigma-container");
var graph = new graphology_1();

let now = 1;
let counter = 0;
let list = [];
let body = document.currentScript.getAttribute('body');
let g = [];
let types = new Map();
var p_body = JSON.parse(body);
for (let i = 0; i < p_body.length; ++i) {
	g.push({from: p_body[i].source, to: p_body[i].target});
	let st, tt;
	if (p_body.type == 0) {
		st = "gray";
		tt = "blue";
	} else {
		st = "blue";
		tt = "gray";
	}
	types.set(p_body[i].source, st);
	types.set(p_body[i].target, tt);
}
let vertexes = [];
for (let i = 0; i < g.length; ++i) {
	vertexes.push(g[i].from);
	vertexes.push(g[i].to);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

vertexes = vertexes.filter(onlyUnique);
for (let i = 0; i < vertexes.length; ++i) {
	graph.addNode(vertexes[i], { x: Math.random() * 100, y: Math.random() * 100, size: 10, label: vertexes[i], color: types.get(vertexes[i]) });
}
for (let i = 0; i < g.length; ++i) {
	let need_print = true;
	for (let j = 0; j < i; ++j) {
		if ((g[i].from == g[j].from && g[i].to == g[j].to) || (g[i].from == g[j].to && g[i].to == g[j].from)) {
			need_print = false;
			break;
		}
	}
	if (!need_print) {
		continue;
	}
	graph.addEdge(g[i].from, g[i].to, {size: 5});
}

const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
layout.start();

var renderer = new sigma_1.default(graph, container);

renderer.on('doubleClickNode', function(e) {
  window.location.replace("./user?id=" + e.node.toString());
});

let draggedNode = null;
let isDragging = false;

// On mouse down on a node
//  - we enable the drag mode
//  - save in the dragged node in the state
//  - highlight the node
//  - disable the camera so its state is not updated
renderer.on("downNode", (e) => {
  isDragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, "highlighted", true);
});

// On mouse move, if the drag mode is enabled, we change the position of the draggedNode
renderer.getMouseCaptor().on("mousemovebody", (e) => {
  if (!isDragging || !draggedNode) return;

  // Get new position of node
  const pos = renderer.viewportToGraph(e);

  graph.setNodeAttribute(draggedNode, "x", pos.x);
  graph.setNodeAttribute(draggedNode, "y", pos.y);

  // Prevent sigma to move camera:
  e.preventSigmaDefault();
  e.original.preventDefault();
  e.original.stopPropagation();
});

// On mouse up, we reset the autoscale and the dragging mode
renderer.getMouseCaptor().on("mouseup", () => {
  if (draggedNode) {
    graph.removeNodeAttribute(draggedNode, "highlighted");
  }
  isDragging = false;
  draggedNode = null;
});
