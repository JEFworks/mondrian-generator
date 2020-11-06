function clearCanvas() {
  let { context, canvas } = getContext()
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function autoSaveImg(image, fileName) {
  const link = document.createElement('a');
  link.href = image;
  link.download = `${fileName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveCanvas(fileName) {
  const canvas = document.getElementById('compositionCanvas');
  let image = canvas.toDataURL("image/png");
  image = image.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  image = image.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=mondrian.png');
  this.href = image;

  autoSaveImg(image, fileName)
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

function orientXYtoTopLeft(innerLines, xOrY) {
  const lineStarts = xOrY === 'x' ? innerLines.sort((a, b) => a - b) : innerLines.sort((a, b) => a - b).reverse();

  return lineStarts
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

function getLineStarts(xOrY) {
  const numLines = getRandomInt(2, 4);
  const innerLines = getInnerLines(numLines)
  const lineStarts = orientXYtoTopLeft(innerLines, xOrY)

  return lineStarts
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
    const lineWidth = isBorder(linePositions, idx) ? BORDER_WIDTH : LINE_WIDTHS[getRandomInt(0, LINE_WIDTHS.length - 1)]
    return lineWidth
  })

  return lineWidths
}

const isBorder = (linePositions, idx) => idx === 0 || idx === linePositions.length - 1

function getLinePoints(artistName, linePositions, idx) {
  let linePoints

  if (artistName === 'Mondrian' || isBorder(linePositions, idx)) {
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
    const { xStart, xStop, yStart, yStop } = getLinePoints(artistName, linePositions, idx)
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

function fillContextSquares(context, xLineStarts, yLineStarts, xLineWidths, yLineWidths, opts) {
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

const imgParams = {

}

const makeArtistImgFuncs = {
  Mondrian: (artistName, shouldSave, opts, fileName) => {
    let { context, canvas } = getContext()

    const xLineStarts = imgParams.xLineStarts || getLineStarts('x')
    const yLineStarts = imgParams.yLineStarts || getLineStarts('y')
    imgParams.xLineStarts = xLineStarts
    imgParams.yLineStarts = yLineStarts

    const lineWidths = [2, 7, 12, 17]
    const xLineWidths = imgParams.xLineWidths || getLineWidths(xLineStarts, lineWidths)
    const yLineWidths = imgParams.yLineWidths || getLineWidths(yLineStarts, lineWidths)
    imgParams.xLineWidths = xLineWidths
    imgParams.yLineWidths = yLineWidths

    context = fillContextSquares(context, xLineStarts, yLineStarts, xLineWidths, yLineWidths, opts)
    context = addLinesToContext(context, xLineStarts, 'x', xLineWidths, 'Mondrian')
    context = addLinesToContext(context, yLineStarts, 'y', yLineWidths, 'Mondrian')

    if (shouldSave) {
      saveCanvas(fileName)
    }
  },
  Brown: (artistName, shouldSave, opts, fileName) => {
    const xLineStarts = getLineStarts('x')
    const yLineStarts = getLineStarts('y')

    let { context, canvas } = getContext()
    const lineWidths = [2, 7, 12, 17]

    const xLineWidths = getLineWidths(xLineStarts, lineWidths)
    const yLineWidths = getLineWidths(yLineStarts, lineWidths)

    context = addLinesToContext(context, xLineStarts, 'x', xLineWidths, 'Brown')
    context = addLinesToContext(context, yLineStarts, 'y', yLineWidths, 'Brown')
    // const linesWithBorders = addBorders(innerLines)

    if (shouldSave) {
      saveCanvas(fileName)
    }
  }
}

function makeArtistImg(artistName, shouldSave, opts) {
  for (let i = 0; i < opts.variations; i++) {
    makeArtistImgFuncs[artistName](artistName, shouldSave, opts, `new-artwork-${i + 1}`)
  }
}

// makeMondrianImg(true)

// TO DO:
// 1. Set up opts object for variations.
// 2. Fix border width bug.