'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////x

const displayMovements = function (movements, isSorted = false) {
  containerMovements.innerHTML = '';
  const mov = isSorted ? movements.slice().sort((a, b) => a - b) : movements;

  mov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const htmx = `<div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">3 days ago</div>
     <div class="movements__value">${mov}€</div>
   </div>
   `;
    containerMovements.insertAdjacentHTML('afterbegin', htmx);
  });
};

const sumEstimate = function (sum) {
  const final = sum.movements.reduce((prev, curr, i) => prev + curr);

  sum.balance = sum.movements.balance = final;

  labelBalance.textContent = `${final} 💶`;
};
const calcDisplayBalance = function (movements) {
  const totalIncome = movements
    .filter((mov, i) => mov > 0)
    .reduce((prev, curr) => prev + curr);
  labelSumIn.textContent = `${totalIncome}€`;

  const totalExpenditure = movements
    .filter((mov, i) => mov < 0)
    .reduce((prev, curr) => prev + curr);
  labelSumOut.textContent = `${Math.abs(totalExpenditure)}€`;

  const interest = movements
    .filter((mov, i) => mov > 0)
    .map(depo => (depo * 1.2) / 100)
    .filter(mov => mov > 1)
    .reduce((prev, curr) => prev + curr);
  labelSumInterest.textContent = `${Math.round(interest)}€`;
};

const find = movements.find((mov, i) => mov < 0);

const createUserName = function (acc) {
  acc.forEach(function (accs) {
    accs.username = accs.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const updateUi = function (accs) {
  displayMovements(accs.movements);
  calcDisplayBalance(accs.movements);
  sumEstimate(accs);
};
let currAcc;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  updateUi(currAcc);
  if (currAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome ${currAcc.owner.split(' ').at(0)}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    console.log('username and password Failed');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  let reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  if (
    amount > 0 &&
    reciverAcc &&
    currAcc.balance >= amount &&
    reciverAcc?.username !== currAcc.username
  ) {
    console.log('Valid');
    console.log(currAcc);
    currAcc.movements.push(-amount);
    reciverAcc.movements.push(amount);
    updateUi(currAcc);
    console.log(reciverAcc.movements);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

///////////////////////////////////////////
//Button Close/////////////////////////////
///////////////////////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currAcc.username &&
    Number(inputClosePin.value) === currAcc.pin
  ) {
    const index = accounts.findIndex(
      index => index.username === currAcc.username
    );
    console.log(index);

    accounts.splice(index, 1);

    //hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin = '';
});
///Loan Processor
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currAcc);
  const amount = Number(inputLoanAmount.value);
  console.log(amount);

  if (amount > 0 && currAcc.movements.some(mov => mov >= amount * 0.1)) {
    currAcc.movements.push(amount);

    updateUi(currAcc);
  }
  inputLoanAmount.value = '';
});

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((prev, curr) => prev + curr);

console.log(overallBalance);

//flatMap combines map and flat only 1 lvl deep

const Fm = accounts
  .flatMap(acc => acc.movements)
  .reduce((prev, curr) => prev + curr);
console.log(Fm);

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAcc.movements, !sorted);
  sorted = !sorted;
});
