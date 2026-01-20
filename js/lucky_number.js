var audio = new Audio('./sound/sound_1.wav');

// State management
let luckyNumber = null;
let luckyDigits = [];
let revealedDigits = [];
let minRange = 0;
let maxRange = 2000;
let flippedCount = 0;
let requiredDigits = 0;

// Get DOM elements
const minRangeInput = document.getElementById('minRange');
const maxRangeInput = document.getElementById('maxRange');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const envelopeContainer = document.getElementById('envelopeContainer');

// Generate random number from range
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get number of digits in a number
function getDigitCount(number) {
    return String(number).length;
}

// Pad number with leading zeros
function padNumber(number, length) {
    return String(number).padStart(length, '0');
}

// Split number into individual digits
function splitIntoDigits(number) {
    return String(number).split('').map(digit => parseInt(digit));
}

// Create envelope cards for each digit
function generateEnvelopes(number, digitCount) {
    envelopeContainer.innerHTML = '';

    // Pad the number to match the required digit count
    const paddedNumber = padNumber(number, digitCount);

    luckyNumber = number;
    luckyDigits = splitIntoDigits(paddedNumber);
    revealedDigits = new Array(luckyDigits.length).fill('_');
    flippedCount = 0;
    requiredDigits = digitCount;

    for (let i = 0; i < luckyDigits.length; i++) {
        const scene = document.createElement('div');
        scene.className = 'scene scene--card';

        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;

        const front = document.createElement('div');
        front.className = 'card__face card__face--front';
        front.id = `front_${i}`;

        const back = document.createElement('div');
        back.className = 'card__face card__face--back';
        back.id = `back_${i}`;

        card.appendChild(front);
        card.appendChild(back);
        scene.appendChild(card);
        envelopeContainer.appendChild(scene);

        // Add click event listener
        card.addEventListener('click', function() {
            handleCardClick(card, i);
        });
    }
}

// Handle card click
function handleCardClick(card, index) {
    if (card.classList.contains('is_flipped')) {
        return;
    }

    audio.play();
    card.classList.add('is_flipped');

    const digit = luckyDigits[index];
    flipCardInterval(`back_${index}`, digit, index);
}

// Flip card animation with spinning numbers
function flipCardInterval(cardID, finalDigit, index) {
    let count = 0;
    const goInterval = setInterval(() => {
        document.getElementById(cardID).innerHTML = randomIntFromInterval(0, 9);
        count++;

        if (count == 60) {
            document.getElementById(cardID).innerHTML = finalDigit;
            audio.currentTime = 0;
            audio.pause();
            clearInterval(goInterval);

            flippedCount++;
            revealedDigits[index] = finalDigit;

            console.log('Revealed Digits:', revealedDigits);
            console.log('Flipped:', flippedCount);

            // Check if all cards are flipped
            if (flippedCount === luckyDigits.length) {
                setTimeout(() => {
                    if (typeof confetti_start === 'function') {
                        confetti_start();
                    }
                }, 1000);
            }
        }
    }, 50);
}

// Generate button click handler
generateBtn.addEventListener('click', function() {
    minRange = parseInt(minRangeInput.value);
    maxRange = parseInt(maxRangeInput.value);

    // Validation
    if (minRange >= maxRange) {
        alert('Minimum range must be less than maximum range!');
        return;
    }

    if (minRange < 0) {
        alert('Minimum range must be 0 or greater!');
        return;
    }

    // Calculate required digits based on max range
    const digitCount = getDigitCount(maxRange);

    // Generate a random number from the range
    const randomNumber = randomIntFromInterval(minRange, maxRange);
    console.log('Generated Lucky Number:', randomNumber);
    console.log('Required Digits:', digitCount);
    console.log('Padded Number:', padNumber(randomNumber, digitCount));

    // Generate envelopes for each digit
    generateEnvelopes(randomNumber, digitCount);
});

// Reset button click handler
resetBtn.addEventListener('click', function() {
    envelopeContainer.innerHTML = '';
    luckyNumber = null;
    luckyDigits = [];
    revealedDigits = [];
    flippedCount = 0;
    requiredDigits = 0;

    // Reset input values to defaults
    minRangeInput.value = 0;
    maxRangeInput.value = 2000;

    // Stop confetti if running
    if (typeof confetti_stop === 'function') {
        confetti_stop();
    }
});

// Initialize on page load with default values
window.addEventListener('DOMContentLoaded', function() {
    minRange = parseInt(minRangeInput.value);
    maxRange = parseInt(maxRangeInput.value);

    // Calculate required digits based on max range
    const digitCount = getDigitCount(maxRange);

    // Generate initial lucky number
    const randomNumber = randomIntFromInterval(minRange, maxRange);
    console.log('Initial Lucky Number:', randomNumber);
    console.log('Required Digits:', digitCount);
    console.log('Padded Number:', padNumber(randomNumber, digitCount));

    generateEnvelopes(randomNumber, digitCount);
});
