function clearCanvas() {
  var canvas = document.getElementById('compositionCanvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
  var canvas = document.getElementById('compositionCanvas');
  var image = canvas.toDataURL("image/png");
  /* Code courtesy of http://stackoverflow.com/questions/12796513/html5-canvas-to-png-file*/  
  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
  image = image.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
  image = image.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=mondrian.png');
  this.href = image;
}
/* REGISTER DOWNLOAD HANDLER */
/* Only convert the canvas to Data URL when the user clicks. 
   This saves RAM and CPU ressources in case this feature is not required. */
document.getElementById("save").addEventListener('click', saveCanvas, false);

function composition() {
  
  colors = ['#c70000', '#f4b600', '#2d2bb4', 'black'];

  // random number of horizontal and vertical lines
  // at least 2, at most 6
  nLinesX = Math.floor((Math.random() * 6) + 2);
  nLinesY = Math.floor((Math.random() * 6) + 2);
  x = [];
  for (i = 0, t = nLinesX; i < t; i++) {
    // require lines to be spaced apart by at least 10 pixels
    x.push((Math.round(Math.random() * 40) + 1) * 10)
  };
  y = [];
  for (i = 0, t = nLinesY; i < t; i++) {
    // require lines to be spaced apart by at least 10 pixels
    y.push((Math.round(Math.random() * 40) + 1) * 10)
  };
  //x = [150]; //for testing
  //y = [50]; //for testing
  x = x.sort();
  y = y.sort().reverse(); // easier to think of 0,0 as top left

  // add border
  x.unshift(2);
  x.push(398);
  y.unshift(2);
  y.push(398);

  var canvas = document.getElementById('compositionCanvas');
  var context = canvas.getContext('2d');

  // vertical lines
  for (i = 0; i < x.length; i++) {
    context.beginPath();
    context.moveTo(x[i], 0);
    context.lineTo(x[i], 400);
    context.stroke();
    context.lineWidth = 4;
    context.strokeStyle = 'black';
    context.stroke();
  };
  // horizontal lines
  for (j = 0; j < y.length; j++) {
    context.beginPath();
    context.moveTo(0, y[j]);
    context.lineTo(400, y[j]);
    context.stroke();
    context.lineWidth = 4;
    context.strokeStyle = 'black';
    context.stroke();
  };

  // random number of color blocks
  // at least 3, at most 10
  nColors = Math.floor((Math.random() * 10) + 3);
  for (c = 0; c < nColors; c++) {
    i = Math.floor((Math.random() * x.length))
    j = Math.floor((Math.random() * y.length))
    context.beginPath();
    context.rect(x[i], y[j], x[i + 1] - x[i], y[j + 1] - y[j]);
    randColor = colors[Math.floor((Math.random() * colors.length))];
    context.fillStyle = randColor;
    context.fill();
    context.stroke();
  }
}
