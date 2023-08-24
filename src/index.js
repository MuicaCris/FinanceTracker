const total = document.querySelector("#total");
const inc_amount = document.querySelector("#inc-amount");
const exp_amount = document.querySelector("#exp-amount");
const transaction = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const table = document.querySelector("#incomeExpense");

const expenseElements = document.getElementsByClassName("expenseElements")[0];
const incomeElements = document.getElementsByClassName("incomeElements")[0];

const localStorageTrans = JSON.parse(localStorage.getItem("trans"));

const date = new Date;
let time = date.getTime()

const jsonData = JSON.stringify(time);

let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const category = sign === "-" ? expenseElements : incomeElements;
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "expense" : "income");

  item.innerHTML = `
    ${transaction.description} 
    <span>${sign} ${Math.abs(transaction.amount)} ${transaction.created_at}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>`;

  category.appendChild(item);
}

function removeTrans(id) {
  if (confirm("Are you sure you want to delete this transcation?")) {
    transactions = transactions.filter((transaction) => transaction.id != id);
    config();
    updateLocalStorage();
  } else {
    return;
  }
}

function updateAmount() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const totals = amounts.reduce((acc, item) => (acc += item), 0);
  total.innerHTML = ` ${totals}`;

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);
  inc_amount.innerHTML = ` ${income}`;

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0);

  exp_amount.innerHTML = ` ${Math.abs(expense)}`;
}
 
function config() {
  incomeElements.innerHTML = "";
  expenseElements.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}

function addTransaction(e) {
  e.preventDefault();

  if (description.value.trim() == "" || amount.value.trim() == "") {
    alert("Please Enter Description and amount");
  } else {
    const transaction = {
      id: uniqueId(),
      description: description.value,
      amount: +amount.value,
      category: "salary",
      created_at: getCurrentDate(),
    };

    description.value = "";
    amount.value = "";
    transactions.push(transaction);
    loadTransactionDetails(transaction);

    updateAmount();
    updateLocalStorage();
  }
}

function uniqueId() {
  return Math.floor(Math.random() * 10000000);
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
  config();
});

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}

function getCurrentDate() {
  const current_date = new Date().toLocaleString('ro-RO');
  return current_date;
}