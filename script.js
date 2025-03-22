// Alcohol constants (in grams per unit)
const ALCOHOL_PER_UNIT = 8; // 1 unit = 8g of pure alcohol
const METABOLISM_RATE = 0.015; // Alcohol metabolized per hour (grams per hour)

// Drink types and their alcohol content (in %)
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
    updateResults();
  });
  calendar.appendChild(day);
}

// Update selected day style
function updateSelectedDay() {
  const days = calendar.querySelectorAll('div');
  days.forEach(day => day.classList.remove('selected'));
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
  drinks.push({ date: selectedDate, alcohol: alcoholContent });

  updateResults();
});

// Update results
function updateResults() {
  const totalAlcohol = drinks.reduce((sum, drink) => sum + drink.alcohol, 0);
  const waitTime = totalAlcohol / METABOLISM_RATE;

  document.getElementById('total-alcohol').textContent = totalAlcohol.toFixed(2);
  document.getElementById('wait-time').textContent = waitTime.toFixed(2);
}