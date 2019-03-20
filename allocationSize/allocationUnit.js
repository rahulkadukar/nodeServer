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
    fileData = []
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
  let sizeStats = []
  let allocationSize = [1, 1024, 4096, 8192, 16384, 32768, 65536, 131072]
  allocationSize.push(262144, 524288, 1048576, 2097152)

  let allocationLength = allocationSize.length
  let sizeData = {}
  for (let x = 0; x < allocationLength; ++x) {
    sizeData[allocationSize[x]] = {}
    sizeData[allocationSize[x]].size = 0
    sizeData[allocationSize[x]].disk = 0
  }

  let sizeOrig = {}
  sizeOrig.sector = 'Default'
  sizeOrig.size = 0
  sizeOrig.disk = 0

  for (let x = 0; x < fileLength; ++x) {
    sizeOrig.size += fData[x].s
    sizeOrig.disk += fData[x].d

    for (let y = 0; y < allocationLength; ++y) {
      let i = allocationSize[y]
      sizeData[allocationSize[y]].size += fData[x].s
      sizeData[allocationSize[y]].disk += i * Math.ceil((fData[x].s/i))
    }
  }

  sizeOrig.usage = (sizeOrig.size / sizeOrig.disk ) * 100
  sizeStats.push(sizeOrig)

  for (let x in sizeData) {
    let sizeInfo = {}
    sizeInfo.sector = x
    sizeInfo.size = sizeData[x].size
    sizeInfo.disk = sizeData[x].disk
    sizeInfo.usage = (sizeInfo.size / sizeInfo.disk ) * 100
    sizeStats.push(sizeInfo)
  }

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
    let sizeStats = analyzeData(fileData)
    let sizeLength = sizeStats.length

    $('#analysisTable thead').empty()
    let tableHead = `<tr><th>Sector</th><th>Size</th>`
    tableHead += `<th>Disk</th><th>Usage</th></tr>`
    $('#analysisTable thead').append(tableHead)

    $('#analysisTable tbody').empty()
    for (let x = 0; x < sizeLength; ++x) {
      let tableRow = `<tr><td>${sizeStats[x].sector}</td><td>${sizeStats[x].size}</td>`
      tableRow += `<td>${sizeStats[x].disk}</td><td>${sizeStats[x].usage}</td></tr>`
      $('#analysisTable tbody').append(tableRow)
    }
  })

  $('#sample').click(function() {
    $('#showOptions').show()
    let fileTemp = fillTempData()
    console.log(fileTemp)
    let sizeStats = analyzeData(fileTemp)
    let sizeLength = sizeStats.length

    $('#analysisTable thead').empty()
    let tableHead = `<tr><th>Sector</th><th>Size</th>`
    tableHead += `<th>Disk</th><th>Usage</th></tr>`
    $('#analysisTable thead').append(tableHead)

    $('#analysisTable tbody').empty()
    for (let x = 0; x < sizeLength; ++x) {
      let tableRow = `<tr><td>${sizeStats[x].sector}</td><td>${sizeStats[x].size}</td>`
      tableRow += `<td>${sizeStats[x].disk}</td><td>${sizeStats[x].usage}</td></tr>`
      $('#analysisTable tbody').append(tableRow)
    }
  })

  function fillTempData() {
    fileData = []
    let tempData = [
      ['a', 177, 4096],
      ['b', 166737, 167936],
      ['c', 920, 4096],
      ['d', 1, 4096]
    ]

    let tempDataLength = tempData.length
    for (let x = 0; x < tempDataLength; ++x) {
      let fileRecord = {}
      fileRecord.n = tempData[x][0]
      fileRecord.s = tempData[x][1]
      fileRecord.d = tempData[x][2]
      fileData.push(fileRecord)
    }

    return fileData
  }
})