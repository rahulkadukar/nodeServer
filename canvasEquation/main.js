document.addEventListener("DOMContentLoaded", function(event) { 
  prepareArray();
});

function prepareArray() {
  let data =[];
  let degree = 1;
  let iterations = Math.pow(2, degree + 1);
  for (let x = 0; x < iterations; ++x) {
    data.push(x.toString(2).padStart(degree + 1,'0'));
  }

  console.log(data);
  let points = getPoints(data[0]);
  let equation = getEquation(points);
  renderCanvas(points);
}

function getPoints(seed) {
  let data = [];
  for (let x = 0; x < seed.length; ++x) {
    data[x] = Math.floor((Math.random() * 5) + 1);
  }
  return data;
}

function getEquation(points) {
  console.log(points);
  let degreeEquation = points.length - 1;
  let interSum = [];

  for (let x = 0; x <= degreeEquation; ++x) {
    let y = degreeEquation;
    let sum = 0;
    do {
      sum += Math.pow(x, y);
      --y;
    } while (y > 0);   
    interSum.push(sum);
  }
  console.log(interSum);
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