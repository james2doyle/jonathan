var canvas = oCanvas.create({ canvas: "#canvas", background: "#333" });

// Center planet
var center = canvas.display.ellipse({
  x: canvas.width / 2, y: canvas.height / 2,
  radius: canvas.width / 20,
  fill: "#fff"
}).add();