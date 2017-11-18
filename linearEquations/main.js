document.addEventListener("DOMContentLoaded", function(event) { 
  let degree = 3;
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
    console.log(JSON.parse(JSON.stringify(outputData)));
    summaryOutput.points = JSON.parse(JSON.stringify(outputData.vector));
    console.log(summaryOutput);
    
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
  console.log(x);

  let el = document.createElement('svg');
  el.setAttribute('id', 'svgGraph');

  document.body.appendChild(el);

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