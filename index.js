const data = getData()
const table = document.getElementById("data");
const rows = table.rows;
let indexOfRow = null;
showTable(data)
clickCol()
editTableRaw()
cancelTableRaw()


async function getData() {
  return await fetch("./data.json").then(resp => resp.json())
}
// just receive data and make table from them
async function showTable(data) {
  await data.then(it => buildTable(it))
}

// build table from any data, they can be not only received from server but also sorted previosly
function buildTable(dat) {
  let table = document.getElementById("data")
  table.innerHTML = "" // in case sorting or pagination removing data before render new data
  dat.forEach(it => {
    let div = document.createElement('div')
    div.style.width = "10px";
    div.style.height = "10px";
    div.style.borderRadius = "50%"
    div.style.backgroundColor = it.eyeColor;
    let tr = document.createElement('tr')
    let td = document.createElement('td')
    td.innerHTML = it.name.firstName
    tr.appendChild(td)
    let td2 = document.createElement('td')
    td2.innerHTML = it.name.lastName
    tr.appendChild(td2)
    let td3 = document.createElement('td')
    td3.innerHTML = it.phone
    tr.appendChild(td3)

    let td4 = document.createElement('td')
    let about = document.createElement('div')
    about.innerHTML = it.about
    about.classList.add('about')
    td4.appendChild(about)
    tr.appendChild(td4)

    let td5 = document.createElement('td')
    td5.setAttribute('data-color', it.eyeColor)
    td5.appendChild(div)
    tr.appendChild(td5)

    table.appendChild(tr)
  })
  //add function to edit rows
  dataRowsToForm()
}
// function to add eventListener for each column
function clickCol() {
  const columns = Array.from(document.getElementsByTagName('th'));
  columns.forEach(column => {
    column.addEventListener('click', sort)
  })
}

// after click on column receive new data, sort them and build new table
async function sort() {
  let order = this.getAttribute('data-order')
  let typeCol = this.getAttribute('data-column')
  if (order === 'desc') {
    this.setAttribute('data-order', 'asc')

    await data.then(it => {
      if (typeCol === 'phone' || typeCol === 'about' || typeCol === 'eyeColor') {

        it.sort((a, b) => a[typeCol] > b[typeCol] ? 1 : -1)
      }
      else {
        it.sort((a, b) => a.name[typeCol] > b.name[typeCol] ? 1 : -1)
      }
      buildTable(it)
    })

  }
  else {
    this.setAttribute('data-order', 'desc')
    await data.then(it => {
      if (typeCol === 'phone' || typeCol === 'about' || typeCol === 'eyeColor') {

        it.sort((a, b) => a[typeCol] < b[typeCol] ? 1 : -1)
      }
      else {
        it.sort((a, b) => a.name[typeCol] < b.name[typeCol] ? 1 : -1)
      }
      buildTable(it)
    })
  }

}

//add Event Listener on each row for opotunity to transfer data from row to form


function dataRowsToForm() {
  for (let i = 0; i < rows.length; i += 1) {
    rows[i].addEventListener('click', transferRowToInput)
  }
}

// function transfer row's data into form
function transferRowToInput() {

  // if another raw was clicked before wwhithout changing - remove class and return normal background
  if (indexOfRow !== null) {
    rows[indexOfRow].classList.remove('selected-row')
    indexOfRow = null
  }
  indexOfRow = this.rowIndex
  console.log(rows[indexOfRow])
  rows[indexOfRow].classList.add('selected-row')
  const eyeColor = this.cells[4].getAttribute('data-color')

  document.getElementById('name').value = this.cells[0].innerHTML
  document.getElementById('lastName').value = this.cells[1].innerHTML
  document.getElementById('phone').value = this.cells[2].innerHTML
  document.getElementById('about').value = this.cells[3].children[0].innerHTML
  document.getElementById('eyeColor').value = eyeColor
}

function editTableRaw() {
  const button = document.getElementById('btn-edit');
  button.addEventListener('click', editRaw);
}

function editRaw() {
  // set new values into table (whithout changing real data)
  rows[indexOfRow - 1].cells[0].innerHTML = document.getElementById('name').value;
  rows[indexOfRow - 1].cells[1].innerHTML = document.getElementById('lastName').value;
  rows[indexOfRow - 1].cells[2].innerHTML = document.getElementById('phone').value;
  rows[indexOfRow - 1].cells[3].children[0].innerHTML = document.getElementById('about').value;
  let color = document.getElementById('eyeColor').value;
  rows[indexOfRow - 1].cells[4].setAttribute('data-color', color)
  rows[indexOfRow - 1].cells[4].children[0].style.backgroundColor = color

  rows[indexOfRow].classList.remove('selected-row')
  indexOfRow = null
  // remove values from's inputs
  document.getElementById('name').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('about').value = '';
  document.getElementById('eyeColor').value = '';
}

// clear inputs on click button cancel
function cancelTableRaw() {
  const button = document.getElementById('btn-cancel');
  button.addEventListener('click', cancelEditRaw)
}

function cancelEditRaw() {
  rows[indexOfRow].classList.remove('selected-row')
  indexOfRow = null

  document.getElementById('name').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('about').value = '';
  document.getElementById('eyeColor').value = '';
}

