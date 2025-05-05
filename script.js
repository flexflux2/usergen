const nameDiv = document.getElementById('name');
const userDiv = document.getElementById('username');
const passDiv = document.getElementById('password');
const btn = document.getElementById('generateBtn');
const toggle = document.getElementById('lengthToggle');
const toggleLabel = document.getElementById('toggleLabel');

async function fetchRandomUser() {
  const res = await fetch('https://randomuser.me/api/?inc=name&nat=us'); // only name fields :contentReference[oaicite:11]{index=11}
  const data = await res.json();
  const { first, last } = data.results[0].name;
  return { first, last };
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeUsername(first, last) {
  // pick a year between 1970–2023 or month 1–12
  const year = randomInRange(1970, new Date().getFullYear());
  return `${first}${last}${year}`.toLowerCase();
}

function generatePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values); // cryptographically strong :contentReference[oaicite:12]{index=12}
  return Array.from(values, v => charset[v % charset.length]).join('');
}

async function generateAll() {
  const { first, last } = await fetchRandomUser();
  nameDiv.textContent = `Name: ${first} ${last}`;
  userDiv.textContent = `Username: ${makeUsername(first, last)}`;
  const len = toggle.checked ? randomInRange(14, 18) : 16; // default 16, else 14–18 :contentReference[oaicite:13]{index=13}
  passDiv.textContent = `Password (${len} chars): ${generatePassword(len)}`;
}

btn.addEventListener('click', generateAll);
toggle.addEventListener('change', () => {
  toggleLabel.textContent = toggle.checked
    ? 'Random length between 14–18'
    : 'Use default 16-char password';
});
