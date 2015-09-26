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
  origin: {
    x: 0,
    y: 0
  },
  x: canvas.width / 2,
  y: canvas.height / 2,
  fill: "#E19166",
  zIndex: 4
});
var textProto = canvas.display.text({
  opacity: 0,
  origin: {
    x: "center",
    y: -18
  },
  font: "bold 12px sans-serif",
  fill: "#000"
});

var lineProto = canvas.display.line({
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

var tooltip = canvas.display.rectangle({
  origin: {
    x: 0,
    y: 0
  },
  opacity: 0,
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  fill: "rgba(0,0,0,0.8)"
});

tooltip.dragAndDrop({ changeZindex: true });

// Set up data
var satellites = [];

// Create seven satellites and paths. Definition is further down.
createSatellite({
  parent: canvas,
  title: "New Task",
  distance: canvas.width / 12,
  radius: canvas.width / 100,
  speed: 1
});

canvas.addChild(tooltip);

var tooltipText = canvas.display.text({
  x: 18,
  y: 18,
  font: "bold 12px sans-serif",
  fill: "#fff"
});

tooltip.addChild(tooltipText);

tooltipText.bind("click", function() {
  var title = prompt("New Task Title?");
  if (title) {
    satellites[tooltip.child_id].title = title;
    satellites[tooltip.child_id].children[0].text = title;
    tooltip.fadeOut("short", "ease-in-quad");
    canvas.redraw();
  }
});

function itemClick(event) {
  var evt = event || window.event;
  event.stopPropagation(); // dont allow any more events
  tooltip.x = this.x;
  tooltip.y = this.y;
  tooltip.child_id = this.id;
  tooltipText.text = this.title;
  canvas.redraw();
  if(tooltip.opacity === 0) {
    tooltip.fadeIn("short", "ease-in-quad");
  } else {
    tooltip.fadeOut("short", "ease-in-quad");
  }
  return false;
}

// Definition for a satellite and its corresponding path
function createSatellite(options) {
  // Create a new satellite
  var variant = Math.random() * (100 - 20) + 20;
  var angle = Math.random() * (360 - 0) + 0;
  var newX = (center.radius + 50) * Math.cos(angle);
  var newY = (center.radius + 50) * Math.sin(angle);
  var satellite = satelliteProto.clone({
    title: options.title,
    radius: options.radius
  });
  var line = lineProto.clone();
  var oldRadius = satellite.radius;
  var oldFill = satellite.fill;
  satellite.dragAndDrop({
    changeZindex: true,
    start: function() {
      satellite.removeChild(line);
      tooltip.fadeOut("short", "ease-in-quad");
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

  options.parent.addChild(satellite);

  var text = textProto.clone({
    y: newY * - 1,
    x: newX * - 1,
    text: options.title
  });

  satellite.addChild(text);

  satellite.addChild(line);

  satellite.bind("click", itemClick);

  function enter() {
    canvas.mouse.cursor("move");
    var self = this;
    self.unbind('mouseenter');
    text.fadeIn("short", "ease-in-quad", function() {
      self.bind('mouseenter', enter);
    });
  }

  function exit() {
    canvas.mouse.cursor("default");
    var self = this;
    self.unbind('mouseleave');
    text.fadeOut("short", "ease-in-quad", function() {
      self.bind("mouseleave", exit);
    });
  }

  satellite.bind("mouseenter", enter).bind("mouseleave", exit);

  line.animate({
    end: {
      y: newY * - 1,
      x: newX * - 1
    }
  }, {
    duration: "short",
    easing: "ease-out",
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
    easing: "ease-out-back",
    callback: function() {
      canvas.redraw();
    }
  });

  satellite.id = satellites.length;
  satellites.push(satellite);
}

function addTask() {
  createSatellite({
    parent: canvas,
    title: "Task #" + (satellites.length + 1),
    distance: (0 + 1) * canvas.width / 12,
    radius: canvas.width / 100,
    speed: 1
  });
}

document.getElementById('addTask').addEventListener('click', addTask);
document.getElementById('addTask').addEventListener('click', addTask);