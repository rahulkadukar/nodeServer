document.addEventListener("DOMContentLoaded", function(event) { 
  let degree = 4;
  let outputData = prepareArray(degree);
  outputData.vector = getPoints('1101');

  printData(outputData, 'divInitial');
  let answerData = coefficients(outputData);
  printData(answerData, 'divFinal');
});

function getPoints(seed) {
  let data = [];
  for (let x = 0; x < seed.length; ++x) {
    data[x] = Math.floor((Math.random() * 5) + 1);
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
      let d = Math.pow(x, y);
      tempArray.push(d + Math.round(Math.random() * randomNum));
      sumVector += (d + Math.round(Math.random() * randomNum));
    }
    outputData.vector.push(sumVector);
    outputData.matrix.push(tempArray);
  }

  console.log(outputData);

  return outputData;
}

function printSummary(output, z) {
  
}

function printData(output, z) {
  let x = output.matrix;
  let y = output.vector;
  console.log(y);

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