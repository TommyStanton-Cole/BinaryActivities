// Global variables
let score = 0;
let startTime = Date.now();
let binaryNumber, correctDenary;

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
        binaryNumber.split("").map(bit => `<div>${bit}</div>`).join("");

    // Reset input field and feedback
    document.getElementById("feedback").innerText = "";
    document.getElementById("denaryAnswer").value = ""; // Reset input field
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

    // Add an event listener for the Enter key
    document.getElementById("denaryAnswer").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            submitAnswer();
        }
    });
}


// Wait for DOM content to load before starting the game
document.addEventListener("DOMContentLoaded", startGame);
