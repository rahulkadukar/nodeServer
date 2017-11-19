document.addEventListener("DOMContentLoaded", function(event) { 
  let degree = 4;
  let coeff = degree + 1;

  let data = [];
  let iterations = Math.pow(2, coeff);
  for (let x = 0; x < iterations; ++x) {
    data.push(x.toString(2).padStart(coeff,'0'));
  }

  let xas;

  for (let x = 0; x < data.length; ++x) {
    let summaryOutput = [];
    let outputData = prepareArray(coeff);
    outputData.vector = getPoints(data[x]);
    summaryOutput.points = JSON.parse(JSON.stringify(outputData.vector));

    let answerData = coefficients(outputData);
    summaryOutput.answer = answerData.vector;
    let finalDivName = 'divFinal' + x.toString();
    printSummary(summaryOutput, finalDivName);
    xas = summaryOutput;
  }

  console.log(xas);
  paintGraph(xas);  
});

function getPoints(seed) {
  let data = [];
  for (let x = 0; x < seed.length; ++x) {
    data[x] = Math.floor((Math.random() * 5) + 1);
    if (seed[x] === '0') {
      data[x] *= -1;
    }
  }
  return data;
}

function coefficients(output) {
  let returnData = {};
  returnData.matrix = output.matrix;
  returnData.vector = output.vector;

  let m = output.matrix;
  let v = output.vector;

  for (let x = 0; x < m.length; ++x) {
    let currRow = m[x];

    for (let y = x; y < m.length; ++y) {
      if (x === y) {
        if (m[y][x] !== 1) {
          let scaling = m[y][x];
          for (let z = x; z < m.length; ++z) {
            m[y][z] /= scaling;
          }
          v[y] /= scaling;
        }
      } else {
        let scaling = m[y][x];
        for (let z = x; z < m.length; ++z) {
          m[y][z] -= (scaling * currRow[z]);
        } 
        v[y] -= (scaling * v[x]);
      }
    }
  }

  for (let x = m.length - 1; x >= 0; --x) {
    let currRow = m[x];

    for (let y = x; y >= 0; --y) {
      if (x == y) {
        if (m[y][x] !== 1) {
          let scaling = m[y][x];
          for (let z = x; z < m.length; ++z) {
            m[y][z] /= scaling;
          }
          v[y] /= scaling;
        }
      } else {
        let scaling = m[y][x];
        for (let z = x; z < m.length; ++z) {
          m[y][z] -= (scaling * currRow[z]);
        }
        v[y] -= (scaling * v[x]);
      }
    }
  }

  return returnData;
}

function prepareArray(degree) {
  let outputData = {};
  let randomNum = 0;
  outputData.matrix = [];
  outputData.vector = [];

  for (let x = 1; x <= degree; ++x) {
    let tempArray = [];
    let sumVector = 0;
    for (let y = degree; y > 0; --y) {
      let d = Math.pow(x, y - 1);
      tempArray.push(d + Math.round(Math.random() * randomNum));
      sumVector += (d + Math.round(Math.random() * randomNum));
    }
    outputData.vector.push(sumVector);
    outputData.matrix.push(tempArray);
  }

  return outputData;
}

function printSummary(output, z) {
  let x = output.points;
  let y = output.answer;

  let txt = "$ \\left[\\begin{array}{r|r}";
  for (let c = 0; c < x.length; ++c) {
    txt += x[c] + " & " + y[c].toFixed(2);

    if (c + 1 !== x.length) {
      txt += "\\\\";
    }
  }

  txt += "\\end{array}\\right] $";

  let el = document.createElement('div');
  el.id = z;
  el.style.float = 'left';
  document.body.appendChild(el);
  el.innerHTML = txt;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
}

function printData(output, z) {
  let x = output.matrix;
  let y = output.vector;

  let txt = "$ \\left[\\begin{array}{rrrr|r}";
  for (let c = 0; c < x.length; ++c) {
    for (let d = 0; d < x[c].length; ++d) {
      txt += x[c][d] + " & ";
    }

    txt += y[c].toFixed(2);

    if (c + 1 !== x.length) {
      txt += "\\\\";
    }
  }

  txt += "\\end{array}\\right] $";

  el = document.getElementById(z);
  el.innerHTML = txt;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
}

function paintGraph(output) {
  let x = output.answer;
  let el = document.createElement('canvas');
  el.setAttribute('id', 'canvasGraph');

  document.body.appendChild(el);

  ctx = el.getContext("2d");
  ctx.canvas.width = 800;
  ctx.canvas.height = 400;

  let axisData = {};
  axisData.xScale = ctx.canvas.width / (x.length + 1);
  axisData.yScale = ctx.canvas.height / 2 / 20;

  drawAxes(ctx, axisData);
  drawGraph(ctx, axisData, x);
  console.log(ctx, axisData);

  for (let c = 1; c <= x.length; ++c) {
    let d = x.length;
    let fx = 0;
    do {
      fx += (Math.pow(c, d - 1) * x[x.length - d]) ;
      --d;
    } while(d > 0);
    console.log(fx);
  }
}

function drawAxes(ctx, axisData) {
  let x0 = ctx.canvas.width * 0.2;
  let y0 = ctx.canvas.height * 0.5;
  ctx.beginPath();
  ctx.strokeStyle = "rgb(128,128,128)"; 
  ctx.moveTo(0,y0); ctx.lineTo(ctx.canvas.width,y0);  // X axis
  ctx.moveTo(x0,0); ctx.lineTo(x0,ctx.canvas.height);  // Y axis  
  ctx.stroke();

  /*
  for (let x = y0; x > 0; x -= axisData.yScale) {
    if (x !== y0) { 
      ctx.beginPath();
      ctx.strokeStyle = 'rgb(192, 192, 192)';
      ctx.moveTo(0, x);
      ctx.lineTo(ctx.canvas.width, x);
      ctx.moveTo(0, ctx.canvas.height - x);
      ctx.lineTo(ctx.canvas.width, ctx.canvas.height - x);
      ctx.stroke();
    }
  }
  */
}

function drawGraph(ctx, axisData, answer) {
  let x0 = ctx.canvas.width * 0.2;
  let y0 = ctx.canvas.height * 0.5;

  let accuracy = 4;
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(0, 192, 192)';
  console.log(axisData);

  for (let x = x0; x < ctx.canvas.width; x += accuracy) {
    let newX = ((x - x0) / axisData.xScale);
    let newY = 0;

    let d = answer.length;
    let fx = 0;
    do {
      newY += (Math.pow(newX, d - 1) * answer[answer.length - d]) ;
      --d;
    } while(d > 0);
        
    let graphY = y0;
    if (newY < 0) {
      graphY += (Math.abs(newY) * axisData.yScale);
    } else {
      graphY -= (newY * axisData.yScale);
    }
    
    if (x === x0) {
      ctx.moveTo(x0, graphY);
    } else {
      ctx.lineTo((newX * axisData.xScale) + x0, graphY);
    }
    // console.log(newX, newY);
  }
  ctx.stroke();
}