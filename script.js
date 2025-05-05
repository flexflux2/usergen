const tableBody = document.getElementById('table-body');
const generateBtn = document.getElementById('generate-btn');
let lastCopied = null;

// Fetch 50 random users in one call
async function fetchUsers(count = 50) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&inc=name&nat=us`);
  const { results } = await res.json(); // parse JSON response :contentReference[oaicite:6]{index=6}
  return results;
}

// Utility: random integer in [min, max]
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Build a username from first+last+year
function makeUsername(first, last) {
  const year = randomInRange(1970, new Date().getFullYear());
  return `${first}${last}${year}`.toLowerCase();
}

// Generate a 16-char strong password
function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, v => charset[v % charset.length]).join('');
}

// Clear existing rows
function clearTable() {
  tableBody.innerHTML = '';
}

// Populate table with user data
function populateTable(users) {
  clearTable();
  users.forEach(({ name }) => {
    const first = name.first;
    const last  = name.last;
    const username = makeUsername(first, last);
    const password = generatePassword();

    const tr = document.createElement('tr');
    [first, last, username, password].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      td.addEventListener('click', () => {
        navigator.clipboard.writeText(text); // copy :contentReference[oaicite:7]{index=7}
        if (lastCopied) lastCopied.classList.remove('copied');
        td.classList.add('copied');
        lastCopied = td;
      });
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

// Fetch & render on load and on button click
async function generateAll() {
  const users = await fetchUsers();
  populateTable(users);
}

document.addEventListener('DOMContentLoaded', generateAll);
generateBtn.addEventListener('click', generateAll);
