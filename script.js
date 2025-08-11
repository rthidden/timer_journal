const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const journalDiv = document.querySelector('.journal');

let timer;
let isRunning = false;
let isWorkTime = true;
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');

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
    workMinutes = parseInt(workDurationInput.value) || 25;
    breakMinutes = parseInt(breakDurationInput.value) || 5;

    if(isWorkTime) {
        currentTime = workMinutes * 60;
    } else {
        currentTime = breakMinutes * 60;
    }
    updateTimerDisplay();

    timer = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        if (currentTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            isWorkTime = !isWorkTime;
            if (isWorkTime) {
                alert('Break is over! Time to focus.');
                currentTime = (parseInt(workDurationInput.value) || 25) * 60;
                journalDiv.style.display = 'none';
            } else {
                alert('Work session is over! Time for a break.');
                currentTime = (parseInt(breakDurationInput.value) || 5) * 60;
                journalDiv.style.display = 'block';
            }
            updateTimerDisplay();
            // Automatically start the next timer
            startTimer();
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
    workMinutes = parseInt(workDurationInput.value) || 25;
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
