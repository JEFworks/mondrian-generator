function clearCanvas() {
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

/* Code courtesy of http://stackoverflow.com/questions/12796513/html5-canvas-to-png-file*/
function saveCanvas() {
  const canvas = document.getElementById('compositionCanvas');
  var image = canvas.toDataURL("image/png");
  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
  image = image.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
  image = image.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=mondrian.png');
  this.href = image;
  autoSaveImg(image)
}
/* REGISTER DOWNLOAD HANDLER */
/* Only convert the canvas to Data URL when the user clicks. 
   This saves RAM and CPU ressources in case this feature is not required. */
// document.getElementById('save').addEventListener('click', saveCanvas, false);

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

function getLinePositions() {
  const numXLines = getRandomInt(2, 4);
  const numYLines = getRandomInt(2, 4)
  x = [];
  for (i = 0; i < numXLines; i++) {
    x.push(getRandomInt(10, 380))
  };
  y = [];
  for (i = 0, t = numYLines; i < t; i++) {
    y.push(getRandomInt(10, 380))
  };
  x = x.sort();
  y = y.sort().reverse(); // easier to think of 0,0 as top left

  // add border
  x.unshift(2);
  x.push(398);
  y.unshift(2);
  y.push(398);

  return { x, y }
}

function getContext() {
  const canvas = document.getElementById('compositionCanvas');
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
  for (i = 0; i < linePositions.length; i++) {
    const LINE_WIDTH = getLineWidth(i, linePositions)
    const moveToArgs = xOrY === 'x' ? [linePositions[i], 0] : [0, linePositions[i]]
    const lineToArgs = xOrY === 'x' ? [linePositions[i], 400] : [400, linePositions[i]]
    context.beginPath();
    context.moveTo(...moveToArgs);
    context.lineTo(...lineToArgs);
    context.stroke();
    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = 'black';
    context.stroke();
  }

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
  const { x, y } = getLinePositions()

  let { context, canvas } = getContext()
  context = addLinesToContext(context, x, 'x')
  context = addLinesToContext(context, y, 'y')
  context = fillContextSquares(context, x, y)

  if (shouldSave) {
    saveCanvas(canvas)
  }
}

makeMondrianImg(true)


// TO DO:
// 1. Generate line widths dynamically.
// 2. Dynamically set the canvas size so it's larger.
// 3. 