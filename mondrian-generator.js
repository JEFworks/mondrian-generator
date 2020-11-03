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
  const BORDER_WIDTH = 2
  const linesWithBorders = [BORDER_WIDTH, ...innerLines, CANVAS_WIDTH - BORDER_WIDTH]
  return linesWithBorders
}

function getInnerLines(numLines) {
  const innerLines = [];
  const PADDING_MARGIN = 10

  for (let i = 0; i < numLines; i++) {
    innerLines.push(getRandomInt(PADDING_MARGIN, CANVAS_WIDTH - PADDING_MARGIN))
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

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 400

function getContext() {
  const canvas = document.getElementById('compositionCanvas');
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const context = canvas.getContext('2d');
  return { context, canvas }
}

function getLineWidths(linePositions) {
  // const LINE_WIDTHS = [2, 4, 6, 8, 10]
  const LINE_WIDTHS = [4]

  const BORDER_WIDTH = 4

  const lineWidths = linePositions.map((_, idx) => {
    const lineWidth = idx === 0 || idx === linePositions.length - 1 ? BORDER_WIDTH : LINE_WIDTHS[getRandomInt(0, LINE_WIDTHS.length)]
    return lineWidth
  })

  return lineWidths
}

function addLinesToContext(context, linePositions, xOrY, lineWidths) {
  linePositions.forEach((linePosition, idx) => {
    const moveToArgs = xOrY === 'x' ? [linePosition, 0] : [0, linePosition]
    const lineToArgs = xOrY === 'x' ? [linePosition, CANVAS_HEIGHT] : [CANVAS_WIDTH, linePosition]

    context.beginPath();
    context.moveTo(...moveToArgs);
    context.lineTo(...lineToArgs);
    context.stroke();
    context.lineWidth = lineWidths[idx];
    context.strokeStyle = 'black';
    context.stroke();
  })

  return context
}

function getRectDims(xLineStarts, yLineStarts) {
  const xPtr = getRandomInt(0, xLineStarts.length)
  const yPtr = getRandomInt(0, yLineStarts.length)
  const X_START = xLineStarts[xPtr]
  const Y_START = yLineStarts[yPtr]
  const RECT_WIDTH = xLineStarts[xPtr + 1] - X_START
  const RECT_HEIGHT = yLineStarts[yPtr + 1] - Y_START

  return { X_START, Y_START, RECT_WIDTH, RECT_HEIGHT }
}

function fillContextSquares(context, xLineStarts, yLineStarts) {
  const numColors = getRandomInt(3, 10);

  for (let c = 0; c < numColors; c++) {
    const { X_START, Y_START, WIDTH, RECT_HEIGHT, RECT_WIDTH } = getRectDims(xLineStarts, yLineStarts)
    context.beginPath();
    context.rect(X_START, Y_START, RECT_WIDTH, RECT_HEIGHT);
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
  const xLineWidths = getLineWidths(xLineStarts)
  const yLineWidths = getLineWidths(yLineStarts)

  context = addLinesToContext(context, xLineStarts, 'x', xLineWidths)
  context = addLinesToContext(context, yLineStarts, 'y', yLineWidths)
  context = fillContextSquares(context, xLineStarts, yLineStarts)

  if (shouldSave) {
    saveCanvas(canvas)
  }
}

// makeMondrianImg(true)

// TO DO:
// 1. Generate line widths dynamically.
// 2. Add options that create an img resembling Earle Brown's "December 1952" score.
