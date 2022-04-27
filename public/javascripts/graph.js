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
for (let i = 0; i < document.currentScript.getAttribute('height'); ++i) {
	list.push([]);
	let prev = 0;
	for (let j = 0; j < now; ++j) {
		//graph.addNode("user" + counter.toString(), { x: -10 + 20 / (now + 1) * (j + 1), y: 0 - i * 2, size: 10, label: "user" + counter.toString(), color: "blue" });
		graph.addNode("user" + counter.toString(), { x: Math.random() * 100, y: Math.random() * 100, size: 10, label: "user" + counter.toString(), color: "blue" });
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
