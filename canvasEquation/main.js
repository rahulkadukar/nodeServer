document.addEventListener("DOMContentLoaded", function(event) { 
  prepareArray();
});

function prepareArray() {
  let data =[];
  for (let x = 0; x < 64; ++x) {
    data.push(x.toString(2).padStart(6,'0'));
  }

  let points = getPoints(data[0]);
  let equation = getEquation(points);
  renderCanvas(points);
}

function getPoints(seed) {
  let data = [];
  for (let x = 0; x < 6; ++x) {
    data[x] = Math.floor((Math.random() * 5) + 1);
  }
  return data;
}

function getEquation(points) {
  let degreeEquation = points.length - 1;
  let coefficients = [];

  for (let x = 0; x <= degreeEquation; ++x) {
    
  }
}

function renderCanvas(seed) {
  let element = document.createElement("canvas");
  element.setAttribute("id", "canvas0");

  document.body.appendChild(element);
  let imgData = new ImageData(600, 300);

  for (let x = 0; x < imgData.data.length; ++x) {
    imgData.data[x] = 127;
  }

  var canvas = document.getElementById('canvas0');
  canvas.width = 800;
  canvas.height = 400;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(imgData, 0, 0);
}