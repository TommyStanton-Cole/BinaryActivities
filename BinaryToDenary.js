// Global variables
let score = 0;
let startTime = Date.now();
let binaryNumber, correctDenary;
let hintActive = false;
let hints = 5;
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
    setTimeout(updateTimer, 1000); // Update every second

    // Award a hint every minute
    if (elapsedTime - Math.floor((lastHintAwardTime - startTime) / 1000) >= 60) {
        hints++;
        lastHintAwardTime = Date.now();
	updateHintButton();
    }

}

// Update hint button
function updateHintButton() {
    const hintButton = document.getElementById("hintButton");
    hintButton.innerText = `Hint (${hints})`;
}

// Generate binary problem
function generateProblem() {
    // Generate a random binary number
    binaryNumber = Array(8).fill(0).map(() => Math.round(Math.random())).join("");
    correctDenary = parseInt(binaryNumber, 2);

    // Create the helper row
    const helperRow = [128, 64, 32, 16, 8, 4, 2, 1];
    document.getElementById("helperRow").innerHTML =
        helperRow.map(num => `<div>${num}</div>`).join("");

    // Display the binary number
    document.getElementById("binaryRow").innerHTML =
        binaryNumber.split("").map(bit => `<div class="binary-bit">${bit}</div>`).join("");

    // Reset input field and feedback
    document.getElementById("feedback").innerText = "";
    document.getElementById("denaryAnswer").value = ""; // Reset input field
    hintActive = false; // Reset hint state
}

// Submit answer
function submitAnswer() {
    const studentAnswer = parseInt(document.getElementById("denaryAnswer").value, 10);

    if (studentAnswer === correctDenary) {
        score++;
        document.getElementById("score").innerText = `Score: ${score}`;
        correctSound.currentTime = 0;
        correctSound.play();
        flashFeedback("green");
        generateProblem();
    } else {
        incorrectSound.currentTime = 0;
        incorrectSound.play();
        flashFeedback("red");
    }
}

// Hint button functionality
function hint_button() {
    hintActive = true; // Enable hint mode
    hints--;
    updateHintButton();
    updateHints(); // Highlight boxes initially
}

// Update hints dynamically as user types
function updateHints() {
    if (hintActive) {
        const studentAnswer = parseInt(document.getElementById("denaryAnswer").value, 10);

        // Skip highlighting for invalid input
        if (isNaN(studentAnswer)) {
            clearHints();
            return;
        }

        const binaryFromAnswer = studentAnswer.toString(2).padStart(8, "0");
        const binaryBits = document.querySelectorAll(".binary-bit");

        binaryBits.forEach((bit, index) => {
            // Highlight boxes in orange where the binary is `1`
            if (binaryFromAnswer[index] === "1") {
                bit.style.backgroundColor = "orange";
            } else {
                bit.style.backgroundColor = ""; // Reset others
            }
        });
    }
}

// Clear hint highlights
function clearHints() {
    const binaryBits = document.querySelectorAll(".binary-bit");
    binaryBits.forEach(bit => {
        bit.style.backgroundColor = "";
    });
}

// Flash feedback
function flashFeedback(color) {
    const flash = document.getElementById("flash");
    flash.style.backgroundColor = color === "green" ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)";
    flash.style.display = "block";
    setTimeout(() => {
        flash.style.display = "none";
    }, 500);
}

// Start game
function startGame() {
    generateProblem();
    updateTimer();
    updateHintButton();

    // Add an event listener for the Enter key
    document.getElementById("denaryAnswer").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            submitAnswer();
        }
    });

    // Add an event listener for input updates when hints are active
    document.getElementById("denaryAnswer").addEventListener("input", () => {
        if (hintActive) {
            updateHints();
        }
    });
}

// Wait for DOM content to load before starting the game
document.addEventListener("DOMContentLoaded", startGame);
