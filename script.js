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

// Utility: inclusive random integer
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Simplified month list
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Generate username as first+last + (either a month abbrev or a year between 1985–2005)
 */
function makeUsername(first, last) {
  // 50/50 split
  if (Math.random() < 0.5) {
    // pick a month
    const month = MONTHS[randomInRange(0, MONTHS.length - 1)];
    return `${first}${last}${month}`.toLowerCase();
  } else {
    // pick a year between 1985 and 2005
    const year = randomInRange(1985, 2005);
    return `${first}${last}${year}`.toLowerCase();
  }
}

// // Mix of month-abbrev OR year
// function makeUsername(first, last) {
//   if (Math.random() < 0.5) {
//     const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
//       .format(new Date(Date.UTC(2020, randomInRange(0,11), 1)));
//     return `${first}${last}${month}`.toLowerCase();
//   } else {
//     return `${first}${last}${randomInRange(1970, new Date().getFullYear())}`.toLowerCase();
//   }
// }

// // Mix of month-abbrev OR year between 1985–2005
// function makeUsername(first, last) {
//   const useMonth = Math.random() < 0.5;
//   let suffix;
//   if (useMonth) {
//     // month path
//     const monthIdx = randomInRange(0, 11);
//     suffix = new Intl.DateTimeFormat('en-US', {
//       month: 'short',
//       timeZone: 'UTC'
//     }).format(new Date(Date.UTC(2020, monthIdx, 1)));
//   } else {
//     // **year strictly between 1985–2005**
//     suffix = randomInRange(1985, 2005);
//   }
//   return `${first}${last}${suffix}`.toLowerCase();
// }

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
