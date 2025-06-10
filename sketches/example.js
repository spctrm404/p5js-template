function setup() {
  createResponsiveCanvas(800, 600, 'canvas-container', 'fill', false);
}

function draw() {
  background('#000000');
  noStroke();
  fill('red');
  circle(mouseX, mouseY, 100);
  drawReferenceGrid('#ffffff');
}

function mouseWheel() {
  console.log('wheel');
}
