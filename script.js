const tableBody = document.getElementById('table-body');
const generateBtn = document.getElementById('generate-btn');
const toggle = document.getElementById('length-toggle');
let lastCopied = null;

async function fetchUsers(count = 50) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&inc=name&nat=us`);
  return (await res.json()).results;
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeUsername(first, last) {
  const useMonth = Math.random() < 0.5;
  let suffix;
  if (useMonth) {
    const monthIndex = randomInRange(0, 11);
    suffix = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
      .format(new Date(Date.UTC(0, monthIndex, 1)));
  } else {
    suffix = randomInRange(1970, new Date().getFullYear());
  }
  return `${first}${last}${suffix}`.toLowerCase();
}

function generatePassword() {
  const length = toggle.checked ? randomInRange(14, 18) : 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, v => charset[v % charset.length]).join('');
}

function clearTable() {
  tableBody.innerHTML = '';
}

function populateTable(users) {
  clearTable();
  users.forEach(u => {
    const first = u.name.first, last = u.name.last;
    const full = `${first} ${last}`;
    const username = makeUsername(first, last);
    const password = generatePassword();
    const row = document.createElement('tr');
    [first, last, full, username, password].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      td.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        if (lastCopied) lastCopied.classList.remove('copied');
        td.classList.add('copied');
        lastCopied = td;
      });
      row.appendChild(td);
    });
    tableBody.appendChild(row);
  });
}

async function generateAll() {
  const users = await fetchUsers();
  populateTable(users);
}

document.addEventListener('DOMContentLoaded', generateAll);
generateBtn.addEventListener('click', generateAll);
toggle.addEventListener('change', () => {
  document.querySelector('.toggle-label').textContent = 
    toggle.checked ? 'Random 14–18 chars' : 'Use default 16-char password';
});
