var fileData = []

document.addEventListener("DOMContentLoaded", function(event) { 
  Array.from(document.getElementsByClassName('defaultHidden')).forEach(e => {
    e.style.display = 'none'
  });
  
  document.getElementById('file').addEventListener('change', readFile, false);
  document.getElementById('addRow').addEventListener('click', addRow);
});

function readFile (evt) {
  let files = evt.target.files
  let file = files[0]   
  let reader = new FileReader()
  reader.onload = (event) => {
    let rawFileData = event.target.result.split('\n')
    let fileLength = rawFileData.length
    let errStatus = 0

    for (let x = 0; x < fileLength; ++x) {
      if (((rawFileData[x].match(/\|/g) || []).length) !== 2) {
        errStatus = -1
        let errLine = `ERR ${errStatus} => EXTRA PIPE ON LINE ${x + 1}`
        document.getElementById('errorMessage').getElementsByTagName('p')[0].innerHTML = errLine
      } else {
        let rowRecord = rawFileData[x].split('\t')
        if (rowRecord.length !== 3) {
          errStatus = -2
          let errLine = `ERR ${errStatus} => EXTRA TAB ON LINE ${x + 1}`
          document.getElementById('errorMessage').getElementsByTagName('p')[0].innerHTML = errLine
        } else {
          let fileRecord = {}
          fileRecord.n = rowRecord[0]
          fileRecord.s = parseInt(rowRecord[1], 10)
          fileRecord.d = parseInt(rowRecord[2], 10)
          fileData.push(fileRecord)
        }
      }
    }

    let sizeStats = analyzeData(fileData)
    console.log(sizeStats)

    if (errStatus === 0) {
      document.getElementById('showOptions').style.display = 'block'
    }
  }
  reader.readAsText(file)
}

function addRow () {
  jQuery(function($) {
    let tableRow = `<tr><td><input type='number'></input></td>`
    tableRow += `<td><button class='delButton'>Delete Row</button></td></tr>`
    $('#sizeTable tbody').append(tableRow)
  })
}

function analyzeData(fData) {
  let fileLength = fData.length
  let sizeStats = {}
  sizeStats.size = 0
  sizeStats.disk = 0

  for (let x = 0; x < fileLength; ++x) {
    sizeStats.size += fData[x].s
    sizeStats.disk += fData[x].d
  }
  
  sizeStats.usage = (sizeStats.size / sizeStats.disk ) * 100
  return sizeStats
}

$(document).ready(function() {
  $('#sizeTable').on('click', '.delButton', function () {
    $(this).parentsUntil('tr').parent().remove()
  })

  $('#autoFill').click(function() {
    $('#sizeTable tbody').empty()

    let sizeData = [1024, 4096, 65536, 1048576, 134217728, 1073741824, 34359738368]
    let sizeLength = sizeData.length

    for (let x = 0; x < sizeLength; ++x) {
      let tableRow = `<tr><td><input type='number' value=${sizeData[x]}></input></td>`
      tableRow += `<td><button class='delButton'>Delete Row</button></td></tr>`
      $('#sizeTable tbody').append(tableRow)
    }
  })

  $('#analyze').click(function() {

  })
})