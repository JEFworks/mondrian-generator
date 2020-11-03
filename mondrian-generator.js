function clearCanvas() {
  let { context, canvas } = getContext()
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function autoSaveImg(image) {
  const link = document.createElement('a');
  link.href = image;
  link.download = 'new-artwork.jpg';
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
  const xLineStarts = xInnerLines.sort((a, b) => a - b);
  const yLineStarts = yInnerLines.sort((a, b) => a - b).reverse();

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
  context.fillStyle = "white";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  return { context, canvas }
}

function getLineWidths(linePositions, LINE_WIDTHS) {
  const BORDER_WIDTH = 4

  const lineWidths = linePositions.map((_, idx) => {
    const lineWidth = idx === 0 || idx === linePositions.length - 1 ? BORDER_WIDTH : LINE_WIDTHS[getRandomInt(0, LINE_WIDTHS.length - 1)]
    return lineWidth
  })

  return lineWidths
}

function getLinePoints(artistName) {
  let linePoints

  if (artistName === 'Mondrian') {
    linePoints = {
      xStart: 0,
      yStart: 0,
      xStop: CANVAS_HEIGHT,
      yStop: CANVAS_WIDTH
    }
  } else if (artistName === 'Brown') {
    linePoints = {
      xStart: getRandomInt(10, 380),
      xStop: getRandomInt(10, 380),
      yStart: getRandomInt(10, 380),
      yStop: getRandomInt(10, 380)
    }
  }

  return linePoints
}

function addLinesToContext(context, linePositions, xOrY, lineWidths, artistName) {
  linePositions.forEach((linePosition, idx) => {
    const { xStart, xStop, yStart, yStop } = getLinePoints(artistName)
    const moveToArgs = xOrY === 'x' ? [linePosition, xStart] : [yStart, linePosition]
    const lineToArgs = xOrY === 'x' ? [linePosition, xStop] : [yStop, linePosition]

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

function getRectDims(xLineStarts, yLineStarts, xLineWidths, yLineWidths) {
  const xPtr = getRandomInt(0, xLineStarts.length - 1)
  const yPtr = getRandomInt(0, yLineStarts.length - 1)

  const X_START = xLineStarts[xPtr]
  const Y_START = yLineStarts[yPtr]
  const RECT_WIDTH = xLineStarts[xPtr + 1] - X_START
  const RECT_HEIGHT = yLineStarts[yPtr + 1] - Y_START

  return { X_START, Y_START, RECT_WIDTH, RECT_HEIGHT }
}

function fillContextSquares(context, xLineStarts, yLineStarts, xLineWidths, yLineWidths) {
  const numColors = getRandomInt(3, 10);

  for (let c = 0; c < numColors; c++) {
    const { X_START, Y_START, RECT_HEIGHT, RECT_WIDTH } = getRectDims(xLineStarts, yLineStarts, xLineWidths, yLineWidths)
    context.beginPath();
    context.rect(X_START, Y_START, RECT_WIDTH, RECT_HEIGHT);
    const randColor = colors[getRandomInt(0, colors.length - 1)];
    context.fillStyle = colorToHexMap[randColor];
    context.fill();
    context.stroke();
  }

  return context
}

const makeArtistImgFuncs = {
  Mondrian: (artistName, shouldSave) => {
    const { xLineStarts, yLineStarts } = getLineStarts()

    let { context, canvas } = getContext()

    const lineWidths = [2, 7, 12, 17]
    const xLineWidths = getLineWidths(xLineStarts, lineWidths)
    const yLineWidths = getLineWidths(yLineStarts, lineWidths)

    context = fillContextSquares(context, xLineStarts, yLineStarts, xLineWidths, yLineWidths)
    context = addLinesToContext(context, xLineStarts, 'x', xLineWidths, 'Mondrian')
    context = addLinesToContext(context, yLineStarts, 'y', yLineWidths, 'Mondrian')

    if (shouldSave) {
      saveCanvas(canvas)
    }
  },
  Brown: (artistName, shouldSave) => {
    const { xLineStarts, yLineStarts } = getLineStarts()

    let { context, canvas } = getContext()
    const lineWidths = [2, 7, 12, 17]

    const xLineWidths = getLineWidths(xLineStarts, lineWidths)
    const yLineWidths = getLineWidths(yLineStarts, lineWidths)
    const xStop = getRandomInt(0, 400)
    const yStop = getRandomInt(0, 400)

    context = addLinesToContext(context, xLineStarts, 'x', xLineWidths, 'Brown')
    context = addLinesToContext(context, yLineStarts, 'y', yLineWidths, 'Brown')

    if (shouldSave) {
      saveCanvas(canvas)
    }
  }
}

function makeArtistImg(artistName, shouldSave) {
  makeArtistImgFuncs[artistName](artistName, shouldSave)
}

// makeMondrianImg(true)

// TO DO:
// 1. Add options that create an img resembling Earle Brown's "December 1952" score.
// 2. Fill transparent squares with white.
