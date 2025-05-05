const tableBody   = document.getElementById('table-body');
const generateBtn = document.getElementById('generate-btn');
const toggle      = document.getElementById('length-toggle');
let lastCopied    = null;

// Fetch 50 names in one go
async function fetchUsers(count = 50) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&inc=name&nat=us`);
  const data = await res.json();
  return data.results;  // each has .name.first & .name.last
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mix of month-abbrev OR year
function makeUsername(first, last) {
  if (Math.random() < 0.5) {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2020, randomInRange(0,11), 1)));
    return `${first}${last}${month}`.toLowerCase();
  } else {
    return `${first}${last}${randomInRange(1970, new Date().getFullYear())}`.toLowerCase();
  }
}

// Use toggle to decide length
function generatePassword() {
  const length = toggle.checked ? randomInRange(14, 18) : 16;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const rnds  = new Uint32Array(length);
  window.crypto.getRandomValues(rnds);
  return Array.from(rnds, r => chars[r % chars.length]).join('');
}

function clearTable() {
  tableBody.innerHTML = '';
}

function populateTable(users) {
  clearTable();
  users.forEach(u => {
    const first    = u.name.first;
    const last     = u.name.last;
    const full     = `${first} ${last}`;
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

// Initial load
document.addEventListener('DOMContentLoaded', generateAll);

// Regenerate on button click…
generateBtn.addEventListener('click', generateAll);
// …and immediately on toggle change
toggle.addEventListener('change', () => {
  document.querySelector('.toggle-label').textContent =
    toggle.checked ? 'Random 14–18 chars' : 'Use default 16-char password';
  generateAll();
});
