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

    const binary1 = num1.toString(2).padStart(8, "0");
    const binary2 = num2.toString(2).padStart(8, "0");
    const binaryAnswer = correctAnswer.toString(2).padStart(9, "0");

    document.getElementById("binary1").innerHTML = 
        `<div class="transparent"></div>` +
        binary1.split("").map(bit => `<div>${bit}</div>`).join("");

    document.getElementById("binary2").innerHTML = 
        `<div class="plus-box">+</div>` +
        binary2.split("").map(bit => `<div>${bit}</div>`).join("");

    document.getElementById("line").innerHTML = 
        `<div class="underline">${'─'.repeat(binaryAnswer.length * 3)}</div>`;

    document.getElementById("answer").innerHTML = binaryAnswer
        .split("")
        .map(() => `<div>0</div>`)
        .join("");

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
        setTimeout(() => highlightMistakes(studentAnswer), 0); // Ensure DOM updates before running
    }
}

// Highlight mistakes
function highlightMistakes(studentAnswer) {
    const correctBinary = correctAnswer.toString(2).padStart(9, "0");
    const studentAnswerPadded = studentAnswer.padStart(9, "0");
    const answerDivs = document.getElementById("answer").children;

    for (let i = 0; i < correctBinary.length; i++) {
        if (studentAnswerPadded[i] !== correctBinary[i]) {
            answerDivs[i].classList.add("red");
            answerDivs[i].classList.remove("white");
        } else {
            answerDivs[i].classList.add("white");
            answerDivs[i].classList.remove("red");
        }
    }
}

// Pass functionality and timer are unchanged, same as before.

generateProblem();
updateTimer();
