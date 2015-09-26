var canvas = oCanvas.create({
  canvas: "#canvas",
  background: "#fff"
});

// Center planet
var center = canvas.display.ellipse({
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: canvas.width / 40,
  fill: "#333",
  zIndex: 2
}).add();

// Prototype objects that will be used to instantiate the others
var satelliteProto = canvas.display.ellipse({
  fill: "#eee"
});
var pathProto = canvas.display.ellipse({
  stroke: "1px #999"
});

// Set up data
var satellites = [];

// Create seven satellites and paths. Definition is further down.
createSatellite({
  parent: center,
  distance: (0 + 1) * canvas.width / 12,
  radius: canvas.width / 100,
  speed: 1
});

function itemClick(event) {
  var evt = event || window.event;
  event.stopPropagation(); // dont allow any more events
  console.log(this.id);
}

// Definition for a satellite and its corresponding path
function createSatellite(options) {

  // Create the path that the satellite will follow
  // var path = pathProto.clone({
  //   radius: options.distance,
  //   x: options.x || 0, y: options.y || 0,
  //   strokeColor: pathColors[options.depth - 1]
  // });
  // options.parent.addChild(path);

  // Create a new satellite
  var angle = Math.random() * (360 - 0) + 0;
  var variant = Math.random() * (100 - 20) + 20;
  var newX = (center.radius + variant) * Math.cos(angle);
  var newY = (center.radius + variant) * Math.sin(angle);
  var satellite = satelliteProto.clone({
    origin: {
      x: 0,
      y: 0
    },
    radius: options.radius,
    x: canvas.width / 2,
    y: canvas.height / 2,
    fill: "#E19166",
    zIndex: 4
  });
  satellite.bind("click", itemClick);
  satellite.bind("mouseenter", function() {
    canvas.mouse.cursor("move");
  }).bind("mouseleave", function() {
    canvas.mouse.cursor("default");
  });
  var oldRadius = satellite.radius;
  var oldFill = satellite.fill;
  satellite.dragAndDrop({
    changeZindex: true,
    start: function() {
      this.fill = "rgba(0,0,0,0.5)";
    },
    move: function() {
      // hide the cursor when moving
      canvas.mouse.cursor("none");
    },
    end: function() {
      this.fill = oldFill;
      this.radius = oldRadius;
      // return the cursor
      canvas.mouse.cursor("default");
      console.log('Move Complete');
    }
  });
  var line = canvas.display.line({
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 0,
      y: 0
    },
    zIndex: 1,
    stroke: "1px #0aa",
    cap: "round"
  });

  canvas.addChild(satellite);

  satellite.addChild(line);

  line.animate({
    end: {
      y: newY * - 1,
      x: newX * - 1
    }
  }, {
    duration: "short",
    easing: "ease-in-out-back",
    callback: function() {
      canvas.redraw();
    }
  });

  satellite.animate({
    origin: {
      y: newY,
      x: newX
    }
  }, {
    duration: "short",
    easing: "ease-in-out-back",
    callback: function() {
      canvas.redraw();
    }
  });

  satellites.push(satellite);
}

function addTask() {
  createSatellite({
    parent: center,
    distance: (0 + 1) * canvas.width / 12,
    radius: canvas.width / 100,
    speed: 1
  });
}

document.getElementById('addTask').addEventListener('click', addTask);