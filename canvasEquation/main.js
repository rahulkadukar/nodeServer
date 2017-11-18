document.addEventListener("DOMContentLoaded", function(event) { 
  prepareArray();
});

function prepareArray() {
  let data = [];
  let degree = 2;
  let iterations = Math.pow(2, degree + 1);
  for (let x = 0; x < iterations; ++x) {
    data.push(x.toString(2).padStart(degree + 1,'0'));
  }

  console.log(data);
  let points = getPoints(data[0]);
  let matrixVector = gaussJordan(points);
  let equation = solveLinear(matrixVector);

  console.log(points);
  console.log(matrixVector);
  renderCanvas(points);
}

function getPoints(seed) {
  let data = [];
  for (let x = 0; x < seed.length; ++x) {
    data[x] = Math.floor((Math.random() * 5) + 1);
  }
  return data;
}

function gaussJordan(points) {
  let degreeEquation = points.length - 1;
  let vectorPoint = [];
  let coefficients = [];

  let constValue = points[0];

  for (let x = 1; x <= degreeEquation; ++x) {
    vectorPoint.push(points[x] - constValue);
    let y = 1;
    let tempCoefficient = [];
    do {
      tempCoefficient.push(Math.pow(x,y));      
      y = y + 1;
    } while (y <= degreeEquation);
    coefficients.push(tempCoefficient);
  }

  let matrixVectorData = {};
  matrixVectorData.matrixData = coefficients;
  matrixVectorData.vectorData = vectorPoint;
  return matrixVectorData;
}

function solveLinear(inputData) {
  let matrixData = inputData.matrixData;
  let vectorData = inputData.vectorData;

  console.log(matrixData);
  console.log(vectorData);
  return 0;
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