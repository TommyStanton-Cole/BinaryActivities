let score = 0;
let passes = 3;
let startTime = Date.now();
let num1, num2, correctAnswer;

// Preload sounds
const correctSound = new Audio('success.wav');
correctSound.preload = 'auto';

const incorrectSound = new Audio('incorrect.wav');
incorrectSound.preload = 'auto';

// Timer update
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
    const seconds = (elapsedTime % 60).toString().padStart(2, "0");
    document.getElementById("timer").innerText = `Time: ${minutes}:${seconds}`;

    if (elapsedTime % 120 === 0 && elapsedTime > 0) {
        passes += 1;
        updatePassButton();
    }

    requestAnimationFrame(updateTimer);
}

// Generate binary problem
function generateProblem() {
    num1 = Math.floor(Math.random() * 256);
    num2 = Math.floor(Math.random() * 256);
    correctAnswer = num1 + num2;

    const binary1 = num1.toString(2).padStart(8, "0"); // Top line: 8 bits
    const binary2 = num2.toString(2).padStart(8, "0"); // Second line: 8 bits
    const binaryAnswer = correctAnswer.toString(2).padStart(9, "0"); // Bottom line: 9 bits

    // Top line with a transparent box
    document.getElementById("binary1").innerHTML = 
        `<div class="transparent"></div>` + 
        binary1.split("").map(bit => `<div>${bit}</div>`).join("");

    // Second line with a "+" in the first box
    document.getElementById("binary2").innerHTML = 
        `<div class="plus-box">+</div>` + 
        binary2.split("").map(bit => `<div>${bit}</div>`).join("");

    // Underline spanning the entire bottom line
    document.getElementById("line").innerHTML = 
        `<div class="underline">${'─'.repeat(binaryAnswer.length * 3)}</div>`;

    // Bottom line (answer line) with 9 bits
    document.getElementById("answer").innerHTML = binaryAnswer
        .split("")
        .map(() => `<div>0</div>`)
        .join("");

    // Reset feedback and styles
    document.getElementById("feedback").innerText = "";
}

// Toggle bits in the answer
document.getElementById("answer").addEventListener("click", (e) => {
    if (e.target.tagName === "DIV") {
        e.target.innerText = e.target.innerText === "0" ? "1" : "0";
    }
});

// Submit answer
function submitAnswer() {
    const studentAnswer = [...document.getElementById("answer").children].map(div => div.innerText).join("");
    const studentValue = parseInt(studentAnswer, 2);

    if (studentValue === correctAnswer) {
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
        playIncorrectSound();
        highlightMistakes(studentAnswer);
    }
}

// Play incorrect sound with cooldown
function playIncorrectSound() {
    const now = Date.now();
    if (now - lastIncorrectSoundTime > 10000) {
        incorrectSound.currentTime = 0;
        incorrectSound.play();
        lastIncorrectSoundTime = now;
    }
}

// Highlight mistakes
function highlightMistakes(studentAnswer) {
    const correctBinary = correctAnswer.toString(2).padStart(9, "0");
    const answerDivs = document.getElementById("answer").children;

    for (let i = 0; i < correctBinary.length; i++) {
        answerDivs[i].style.backgroundColor = studentAnswer[i] !== correctBinary[i] ? "red" : "white";
    }
}

// Pass question
const PASS_DELAY_SECONDS = 5; // Change this to adjust the delay duration

function passQuestion() {
    if (passes > 0) {
        passes--;
        updatePassButton();

        // Disable the Pass and Submit buttons
        document.getElementById("passButton").disabled = true;
        document.getElementById("submitButton").disabled = true;

        let countdown = PASS_DELAY_SECONDS; // Use the variable here
        document.getElementById("feedback").innerText = `Next question in ${countdown}...`;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                document.getElementById("feedback").innerText = `Next question in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                generateProblem(); // Load the next question

                // Re-enable the buttons
                document.getElementById("passButton").disabled = passes > 0 ? false : true;
                document.getElementById("submitButton").disabled = false;

                document.getElementById("feedback").innerText = ""; // Clear feedback
            }
        }, 1000);
    } else {
        document.getElementById("feedback").innerText = "No passes left!";
    }
}



// Update pass button
function updatePassButton() {
    const passButton = document.getElementById("passButton");
    passButton.innerText = `Pass (${passes})`;
    if (passes === 0) {
        passButton.classList.add("disabled");
        passButton.disabled = true;
    } else {
        passButton.classList.remove("disabled");
        passButton.disabled = false;
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
