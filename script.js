// Alcohol constants (in grams per unit)
const ALCOHOL_PER_UNIT = 8; // 1 unit = 8g of pure alcohol
const METABOLISM_RATE = 0.015; // Alcohol metabolized per hour (grams per hour)
const HOURS_PER_DAY = 24; // Hours in a day

// Drink and their alcohol content. possibly change to allow dad to input the percentage.
const DRINKS = {
  beer: 5,
  wine: 12,
  spirit: 40,
};

// Initialize selected date and drinks
let selectedDate = null;
let drinks = [];

// Generate calendar
const calendar = document.getElementById('calendar');
const daysInMonth = 31; // Example: Assume 31 days in a month

for (let i = 1; i <= daysInMonth; i++) {
  const day = document.createElement('div');
  day.textContent = i;
  day.addEventListener('click', () => {
    selectedDate = i;
    updateSelectedDay();
    drinks = []; // Reset drinks when a new date is selected
    updateDrinkLog();
    updateResults();
  });
  calendar.appendChild(day);
}

// Update selected day style
function updateSelectedDay() {
  const days = calendar.querySelectorAll('div');
  days.forEach(day => day.classList.remove('selected', 'wait'));
  if (selectedDate) {
    days[selectedDate - 1].classList.add('selected');
  }
}

// Add drink to session
document.getElementById('add-drink').addEventListener('click', () => {
  if (!selectedDate) {
    alert('Please select a date first.');
    return;
  }

  const drinkType = document.getElementById('drink-type').value;
  const quantity = parseInt(document.getElementById('quantity').value, 10);

  const alcoholContent = DRINKS[drinkType] / 100 * quantity * ALCOHOL_PER_UNIT;
  drinks.push({ type: drinkType, quantity, alcohol: alcoholContent });

  updateDrinkLog();
});

// Update drink log table
function updateDrinkLog() {
  const drinkLogBody = document.getElementById('drink-log-body');
  drinkLogBody.innerHTML = ''; // Clear the table

  drinks.forEach((drink, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${drink.type}</td>
      <td>${drink.quantity}</td>
      <td>${drink.alcohol.toFixed(2)}</td>
      <td><button onclick="removeDrink(${index})">Remove</button></td>
    `;
    drinkLogBody.appendChild(row);
  });
}

// Remove drink from session
function removeDrink(index) {
  drinks.splice(index, 1); // Remove the drink at the specified index
  updateDrinkLog();
  updateResults();
}

// Compute results and highlight wait days
document.getElementById('compute-results').addEventListener('click', () => {
  if (!selectedDate || drinks.length === 0) {
    alert('Please select a date and add at least one drink.');
    return;
  }

  updateResults();
});

// Update results and highlight wait days
function updateResults() {
  const totalAlcohol = drinks.reduce((sum, drink) => sum + drink.alcohol, 0);
  const waitTimeHours = totalAlcohol / METABOLISM_RATE;
  const waitTimeDays = Math.ceil(waitTimeHours / HOURS_PER_DAY); // Convert hours to days and round up

  document.getElementById('total-alcohol').textContent = totalAlcohol.toFixed(2);
  document.getElementById('wait-time').textContent = waitTimeDays;

  // Highlight wait days in the calendar
  const days = calendar.querySelectorAll('div');
  days.forEach(day => day.classList.remove('wait'));

  if (selectedDate) {
    const startDate = selectedDate;
    const endDate = startDate + waitTimeDays;

    for (let i = startDate; i < endDate && i <= daysInMonth; i++) {
      days[i - 1].classList.add('wait');
    }
  }
}
