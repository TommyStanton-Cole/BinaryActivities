// Global variables
let score = 0;
let hints = 5; // Initial number of hints
let startTime = Date.now();
let denaryNumber, correctBinary;
let hintActive = false;
let lastHintAwardTime = startTime; // Track last hint award time

// Preload sounds
const correctSound = new Audio('success.wav');
const incorrectSound = new Audio('incorrect.wav');
correctSound.preload = 'auto';
incorrectSound.preload = 'auto';

// Timer update
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
    const seconds = (elapsedTime % 60).toString().padStart(2, "0");
    document.getElementById("timer").innerText = `Time: ${minutes}:${seconds}`;

    // Award a hint every minute
    if (elapsedTime - Math.floor((lastHintAwardTime - startTime) / 1000) >= 60) {
        hints++;
        lastHintAwardTime = Date.now();
        updateHintButton();
    }

    requestAnimationFrame(updateTimer);
}

// Generate denary problem
function generateProblem() {
    denaryNumber = Math.floor(Math.random() * 256);
    correctBinary = denaryNumber.toString(2).padStart(8, "0");

    // Create the helper row
    const helperRow = [128, 64, 32, 16, 8, 4, 2, 1];
    document.getElementById("helperRow").innerHTML =
        helperRow.map(num => `<div>${num}</div>`).join("");

    // Display the denary number
    document.getElementById("denaryNumber").innerText = `Denary: ${denaryNumber}`;

    // Populate the answer row
    const answerRow = Array(8).fill(0).map(() => `<div class="answer_bits">0</div>`).join("");
    document.getElementById("answer").innerHTML = answerRow;

    document.getElementById("feedback").innerText = "";
    hintActive = false; // Reset hint state
}

// Toggle bits in the answer
document.getElementById("answer").addEventListener("click", (e) => {
    if (e.target.classList.contains("answer_bits")) {
        e.target.innerText = e.target.innerText === "0" ? "1" : "0";
        if (hintActive) {
            updateHelperTotal();
        }
    }
});

// Hint button pressed

function hint_button() {
    hints--;
    updateHelperTotal();
}

// Update the helper total
function updateHelperTotal() {
    if (hints > 0) {
        const bits = [...document.getElementById("answer").children].map(div => parseInt(div.innerText));
        const helperRow = [128, 64, 32, 16, 8, 4, 2, 1];
        const total = bits.reduce((sum, bit, index) => sum + bit * helperRow[index], 0);
        document.getElementById("feedback").innerText = `Current Total: ${total}`;
        hintActive = true; // Hint is now active
        updateHintButton();
    } else {
        document.getElementById("feedback").innerText = "No hints left!";
    }
}

// Update hint button
function updateHintButton() {
    const hintButton = document.getElementById("hintButton");
    hintButton.innerText = `Hint (${hints})`;
    hintButton.disabled = hints === 0;
}

// Submit answer
function submitAnswer() {
    const studentAnswer = [...document.getElementById("answer").children].map(div => div.innerText).join("");

    if (studentAnswer === correctBinary) {
        score++;
        document.getElementById("score").innerText = `Score: ${score}`;
        document.getElementById("feedback").innerText = "Well done!";
        correctSound.currentTime = 0;
        correctSound.play();
        flashGreen();
        generateProblem();
    } else {
        score--;
        document.getElementById("score").innerText = `Score: ${score}`;
        document.getElementById("feedback").innerText = "Incorrect!";
        incorrectSound.currentTime = 0;
        incorrectSound.play();
        setTimeout(() => highlightMistakes(studentAnswer), 0);
    }
}

// Highlight mistakes
function highlightMistakes(studentAnswer) {
    const answerDivs = document.getElementById("answer").children;

    for (let i = 0; i < correctBinary.length; i++) {
        if (studentAnswer[i] !== correctBinary[i]) {
            answerDivs[i].style.backgroundColor = "red"; // Incorrect bit
        } else {
            answerDivs[i].style.backgroundColor = "white"; // Correct bit
        }
    }
}

// Flash green for correct answer
function flashGreen() {
    const flash = document.getElementById("flash");
    flash.style.display = "block";
    setTimeout(() => {
        flash.style.display = "none";
    }, 500);
}

// Start game
generateProblem();
updateTimer();
hintButton.innerText = `Hint (${hints})`;