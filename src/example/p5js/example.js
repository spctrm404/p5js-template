function setup() {
  createResponsiveCanvas(800, 600, 'canvas-container', 'fill', false);
}

function draw() {
  drawReferenceGrid('#ffffff');
}

function mouseWheel() {
  console.log('wheel');
}
