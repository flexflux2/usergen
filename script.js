const grid = document.querySelector('.grid-table');
const btn = document.getElementById('generateBtn');
let lastCopiedCell = null;

async function fetchUsers(count = 50) {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&inc=name&nat=us`);
  const { results } = await res.json();
  return results.map(u => ({
    first: u.name.first,
    last: u.name.last
  }));
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeUsername(first, last) {
  const year = randomInRange(1970, new Date().getFullYear());
  return `${first}${last}${year}`.toLowerCase();
}

function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, v => charset[v % charset.length]).join('');
}

function clearGrid() {
  // Remove old cells (keep headers)
  grid.querySelectorAll('.cell').forEach(el => el.remove());
}

function populateGrid(users) {
  const cells = [];
  users.forEach(({ first, last }) => {
    cells.push(first, last, makeUsername(first, last), generatePassword(16));
  });
  cells.forEach(text => {
    const div = document.createElement('div');
    div.className = 'cell';
    div.textContent = text;
    div.addEventListener('click', () => {
      navigator.clipboard.writeText(text);                   // copy to clipboard :contentReference[oaicite:14]{index=14}
      if (lastCopiedCell) lastCopiedCell.classList.remove('copied'); // remove prev highlight :contentReference[oaicite:15]{index=15}
      div.classList.add('copied');
      lastCopiedCell = div;
    });
    grid.appendChild(div);
  });
}

async function generateAll() {
  const users = await fetchUsers();
  clearGrid();
  populateGrid(users);
}

// Initial load
document.addEventListener('DOMContentLoaded', generateAll);
btn.addEventListener('click', generateAll);
