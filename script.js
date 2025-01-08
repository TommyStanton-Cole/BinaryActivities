// Global variables
let score = 0;
let passes = 3;
let startTime = Date.now();
let num1, num2, correctAnswer;

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

    if (elapsedTime % 120 === 0 && elapsedTime > 0) {
        passes++;
        updatePassButton();
    }

    requestAnimationFrame(updateTimer);
}

// Generate binary problem
function generateProblem() {
    num1 = Math.floor(Math.random() * 256);
    num2 = Math.floor(Math.random() * 256);
    correctAnswer = num1 + num2;

    const binary1 = num1.toString(2).padStart(8, "0");
    const binary2 = num2.toString(2).padStart(8, "0");
    const binaryAnswer = correctAnswer.toString(2).padStart(9, "0");

    // Pad the top two rows with an extra transparent box for alignment
    document.getElementById("binary1").innerHTML =
        `<div class="transparent"></div>` +
        binary1.split("").map(bit => `<div>${bit}</div>`).join("");

    document.getElementById("binary2").innerHTML =
        `<div class="plus-box">+</div>` +
        binary2.split("").map(bit => `<div>${bit}</div>`).join("");

    document.getElementById("line").innerHTML =
        `<div class="underline" data-static="true">${'─'.repeat(binaryAnswer.length * 3)}</div>`;

    document.getElementById("answer").innerHTML = binaryAnswer
        .split("")
        .map(() => `<div class="answer_bits">0</div>`)
        .join("");

    document.getElementById("feedback").innerText = "";
}

// Toggle bits in the answer
document.getElementById("answer").addEventListener("click", (e) => {
    if (e.target.classList.contains("answer_bits")) {
        e.stopPropagation(); // Prevent event bubbling
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
        incorrectSound.currentTime = 0;
        incorrectSound.play();
        setTimeout(() => highlightMistakes(studentAnswer), 0); // Ensure DOM updates before checking
    }
}

// Highlight mistakes
function highlightMistakes(studentAnswer) {
    const correctBinary = correctAnswer.toString(2).padStart(9, "0");
    const answerDivs = document.getElementById("answer").children;

    for (let i = 0; i < correctBinary.length; i++) {
        if (studentAnswer[i] !== correctBinary[i]) {
            answerDivs[i].style.backgroundColor = "red"; // Incorrect bit
        } else {
            answerDivs[i].style.backgroundColor = "white"; // Correct bit
        }
    }
}

// Pass question
const PASS_DELAY_SECONDS = 5;

function passQuestion() {
    if (passes > 0) {
        passes--;
        updatePassButton();

        document.getElementById("passButton").disabled = true;
        document.getElementById("submitButton").disabled = true;

        let countdown = PASS_DELAY_SECONDS;
        document.getElementById("feedback").innerText = `Next question in ${countdown}...`;

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                document.getElementById("feedback").innerText = `Next question in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                generateProblem();
                document.getElementById("passButton").disabled = false;
                document.getElementById("submitButton").disabled = false;
                document.getElementById("feedback").innerText = "";
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
    passButton.disabled = passes === 0;
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
