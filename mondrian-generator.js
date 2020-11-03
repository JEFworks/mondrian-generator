function clearCanvas() {
  let { context, canvas } = getContext()
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function autoSaveImg(image) {
  const link = document.createElement('a');
  link.href = image;
  link.download = 'new-mondrian.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveCanvas() {
  const canvas = document.getElementById('compositionCanvas');
  let image = canvas.toDataURL("image/png");
  image = image.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  image = image.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=mondrian.png');
  this.href = image;

  autoSaveImg(image)
}

const colorToHexMap = {
  red: '#fe0000',
  yellow: '#ffff00',
  blue: '#0000fe',
  black: '#000000'
}

const colors = ['red', 'yellow', 'black', 'blue'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function orientXYtoTopLeft(xInnerLines, yInnerLines) {
  const xLineStarts = xInnerLines.sort();
  const yLineStarts = yInnerLines.sort().reverse();

  return { xLineStarts, yLineStarts }
}

function addBorders(innerLines) {
  const linesWithBorders = [2, ...innerLines, 398]
  return linesWithBorders
}

function getInnerLines(numLines) {
  const innerLines = [];
  for (let i = 0; i < numLines; i++) {
    innerLines.push(getRandomInt(10, 380))
  };
  const linesWithBorders = addBorders(innerLines)
  return linesWithBorders
}

function getLineStarts() {
  const numXLines = getRandomInt(2, 4);
  const numYLines = getRandomInt(2, 4)
  const xInnerLines = getInnerLines(numXLines)
  const yInnerLines = getInnerLines(numYLines)
  const { xLineStarts, yLineStarts } = orientXYtoTopLeft(xInnerLines, yInnerLines)

  return { xLineStarts, yLineStarts }
}

function getContext() {
  const canvas = document.getElementById('compositionCanvas');
  canvas.width = 400
  canvas.height = 400
  const context = canvas.getContext('2d');
  return { context, canvas }
}

function getLineWidth(i, linePositions) {
  // const LINE_WIDTHS = [2, 4, 6, 8, 10]
  const LINE_WIDTHS = [4]
  const DEFAULT_WIDTH = 4
  const LINE_WIDTH = i === 0 || i === linePositions.length - 1 ? DEFAULT_WIDTH : LINE_WIDTHS[getRandomInt(0, LINE_WIDTHS.length)]
  return LINE_WIDTH
}

function addLinesToContext(context, linePositions, xOrY) {
  linePositions.forEach((linePosition, idx) => {
    const LINE_WIDTH = getLineWidth(idx, linePositions)
    const moveToArgs = xOrY === 'x' ? [linePosition, 0] : [0, linePosition]
    const lineToArgs = xOrY === 'x' ? [linePosition, 400] : [400, linePosition]

    context.beginPath();
    context.moveTo(...moveToArgs);
    context.lineTo(...lineToArgs);
    context.stroke();
    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = 'black';
    context.stroke();
  })

  return context
}

function fillContextSquares(context, x, y) {
  const numColors = getRandomInt(3, 10);
  for (let c = 0; c < numColors; c++) {
    const xPtr = getRandomInt(0, x.length)
    const yPtr = getRandomInt(0, y.length)
    context.beginPath();
    context.rect(x[xPtr], y[yPtr], x[xPtr + 1] - x[xPtr], y[yPtr + 1] - y[yPtr]);
    const randColor = colors[getRandomInt(0, colors.length)];
    context.fillStyle = colorToHexMap[randColor];
    context.fill();
    context.stroke();
  }

  return context
}

function makeMondrianImg(shouldSave) {
  const { xLineStarts, yLineStarts } = getLineStarts()

  let { context, canvas } = getContext()
  context = addLinesToContext(context, xLineStarts, 'x')
  context = addLinesToContext(context, yLineStarts, 'y')
  context = fillContextSquares(context, xLineStarts, yLineStarts)

  if (shouldSave) {
    saveCanvas(canvas)
  }
}

<<<<<<< HEAD
makeMondrianImg()

// TO DO:
// 1. Generate line widths dynamically.
// 2. Prevent illegal Mondrian squares- ones that only go across half of canvas.
=======
//makeMondrianImg(true)


// TO DO:
// 1. Generate line widths dynamically.
// 2. Dynamically set the canvas size so it's larger.
// 3.
>>>>>>> c5ee8614efafd58de216767e7f68948374a40ab4
