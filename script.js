const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const journalDiv = document.querySelector('.journal');

let timer;
let isRunning = false;
let isWorkTime = true;
let workMinutes = 25;
let breakMinutes = 5;
let currentTime = workMinutes * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            isWorkTime = !isWorkTime;
            if (isWorkTime) {
                alert('Break is over! Time to focus.');
                currentTime = workMinutes * 60;
                journalDiv.style.display = 'none';
            } else {
                alert('Work session is over! Time for a break.');
                currentTime = breakMinutes * 60;
                journalDiv.style.display = 'block';
            }
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    isWorkTime = true;
    currentTime = workMinutes * 60;
    journalDiv.style.display = 'none';
    updateTimerDisplay();
}

const saveEntryBtn = document.getElementById('save-entry');
const journalEntryTextarea = document.getElementById('journal-entry');
const entriesList = document.getElementById('entries-list');

let journalEntries = [];

function saveJournalEntry() {
    const entryText = journalEntryTextarea.value.trim();
    if (entryText) {
        const entry = {
            id: Date.now(),
            text: entryText,
            date: new Date().toLocaleString()
        };
        journalEntries.push(entry);
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        journalEntryTextarea.value = '';
        displayJournalEntries();
    }
}

function displayJournalEntries() {
    entriesList.innerHTML = '';
    journalEntries.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${entry.date}:</strong> ${entry.text}`;
        entriesList.appendChild(li);
    });
}

function loadJournalEntries() {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
        journalEntries = JSON.parse(storedEntries);
        displayJournalEntries();
    }
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
saveEntryBtn.addEventListener('click', saveJournalEntry);

updateTimerDisplay();
loadJournalEntries();
