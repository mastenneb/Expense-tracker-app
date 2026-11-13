const totalBal = document.getElementById('totalBalance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');

const incomeToggle = document.querySelector('.income');
const expenseToggle = document.querySelector('.expense');

let transactionMethod = true;
let balance = 0;
let incomes = 0;
let expenses = 0;
let arr = [];

window.addEventListener('DOMContentLoaded', function() {
  let saved = JSON.parse(localStorage.getItem('transactionHistory'));
  let savedBalance = JSON.parse(localStorage.getItem('currBalance'));
  let savedIncome = JSON.parse(localStorage.getItem('currIncome'));
  let savedExpense = JSON.parse(localStorage.getItem('currExpense'));
  if (savedBalance !== null && savedIncome !== null && savedExpense !== null) {
    balance = savedBalance;
    incomes = savedIncome;
    expenses = savedExpense;
  }
  if (saved !== null) {
    arr = saved;
    const dd = document.createDocumentFragment();
    for (let x of arr) {
        let elem = createElem(x.method , x.description , x.dated , x.expenditure , x);
        dd.appendChild(elem);
    }
    upD(dd);
  }
  if (transactionMethod) {
    incomeToggle.classList.add('selectedIncome');
  }
  updateUI();
  updateTransactCount();
})

document.querySelector('.classificationBox').addEventListener('click', toggleBtns);

document.getElementById('form').addEventListener('submit', makeTransaction);

document.querySelector('.containerForTransactions').addEventListener('click' , function(e) {
  let div = e.target.closest('.elem');
  if (!div) return;
  let span = div.querySelector('.val');
  let content = div.querySelector('.content h4');
  if (e.target.closest('.delBtn')) {
    div.remove();
    let num = parseFloat(span.innerHTML.replace(/[^0-9.-]+/g, ""));
    let transId = Number(div.dataset.id);
    
    if (div.querySelector('.icon').innerHTML === '+') {
    if (balance === 0) return;
    balance -= num;
    incomes -= num;
    arr = arr.filter((v) => {
      return v.id !== transId;
    });
    updateUI();
    updateTransactCount();
    setLocalStorage();
    } else {
      if (expenses === 0) return;
      balance += num;
      expenses -= num;
      arr = arr.filter((v) => {
        return v.id !== transId}
      );
      updateUI();
      updateTransactCount();
      setLocalStorage();
    }
  }
})

function toggleBtns(event) {
  if (event.target.closest('.income')) {
    incomeToggle.classList.add('selectedIncome');
    expenseToggle.classList.remove('selectedExpense');
    transactionMethod = true;
  }
  if (event.target.closest('.expense')) {
    expenseToggle.classList.add('selectedExpense');
    incomeToggle.classList.remove('selectedIncome');
    transactionMethod = false;
  }
}

function makeTransaction(e) {
  e.preventDefault();
  let desc = document.getElementById('description');
  let amount = document.getElementById('amount');
  let da = document.getElementById('date');
  let usableAmount = Number(amount.value);
  
  if (!desc.value || !amount.value) {
    alert('Input something');
    return;
  }
  
  const obj = {};
  
  obj.description = desc.value;
  obj.expenditure = usableAmount;
  obj.dated = (da.value) ? da.value : new Date().toISOString().split('T')[0];
  obj.id = Date.now();
  
  arr.unshift(obj);
  updateTransactCount();
  
  if (transactionMethod) {
    incomes += usableAmount;
    balance += usableAmount;
    obj.method = '+';
    let elem = createElem("+", desc.value, obj.dated, usableAmount , obj);
    upD(elem);
    updateUI();
    clearInput();
    setLocalStorage();
  } else {
    if (usableAmount > balance) return;
    expenses += usableAmount;
    balance -= usableAmount;
    obj.method = '-';
    let elem = createElem("-", desc.value, obj.dated, usableAmount , obj);
    console.log(elem)
    upD(elem);
    updateUI();
    clearInput();
    setLocalStorage();
  }
}

function updateUI() {
  totalBal.innerHTML = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  income.innerHTML = incomes.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  expense.innerHTML = expenses.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}


function clearInput() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
}

function setLocalStorage() {
  localStorage.setItem('currBalance', JSON.stringify(balance));
  localStorage.setItem('currIncome', JSON.stringify(incomes));
  localStorage.setItem('currExpense', JSON.stringify(expenses));
  localStorage.setItem('transactionHistory', JSON.stringify(arr));
}

function createElem(inc, descrip, dte, valu , obje) {
  const div = document.createElement('div');
  div.innerHTML = `<div class="grpContent"><div class="icon"></div><div class="content"><h4></h4><h5 >  </h5></div></div><div class="action"><h4><span class="val"></span></h4> <button class="delBtn"> Delete</button></div>`;
  div.dataset.id = obje.id;
  div.classList.add('elem');
  let indicator = div.querySelector('.icon');
  let description = div.querySelector('.content h4');
  let d = div.querySelector('.content h5');
  let val = div.querySelector('.val');
  
  if (inc == '+') {
    indicator.classList.add('icon-green');
    val.classList.add('green');
  } else if (inc == '-') {
    indicator.classList.add('icon-red');
    val.classList.add('red');
  }
  
  indicator.textContent = inc;
  description.textContent = descrip;
  d.textContent = new Date(dte).toLocaleString('en-GB' , {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  val.textContent = valu.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  return div;
}

function upD(elemt) {
  document.querySelector('.containerForTransactions').prepend(elemt);
}

function updateTransactCount() {
  document.getElementById('numOftransactions').innerHTML = arr.length;
}