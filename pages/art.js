import { CATEGORY, DIFFICULTY, buildURL } from "../api_constants.js";

// GLOBAL DIFFICULTY SETTING
let currentDifficulty = DIFFICULTY.EASY;   // instead of "easy"

// Set this page’s category (Art)
const currentCategory = CATEGORY.ART;

// Build the API URL using your difficulty & category
let apiURL = buildURL(currentCategory, currentDifficulty);
// let apiURL = 'https://opentdb.com/api.php?amount=10&category=19&difficulty=easy';

let currentMode = "flashcards"; // add this global tracker
let flaggedQuestions = new Set();   // stores question indices

let quizSeconds = 0;
let quizTimerInterval = null;

let selectedAnswerIndex = null;

let questionResults = {};

// Decode HTML entities (OpenTDB uses &amp;, &#039;, etc.)
function decodeHTML(str) {
	const txt = document.createElement("textarea");
	txt.innerHTML = str;
	return txt.value;
}

function showSaveToast() {
	const toast = document.getElementById("save-toast");
	toast.classList.add("show");

	setTimeout(() => {
		toast.classList.remove("show");
	}, 1500);
}

async function loadAPIFlashcards() {
	try {
		const response = await fetch(apiURL);
		const data = await response.json();

		// Reset question results each time new questions load
		questionResults = {};

		// Convert API results into flashcards that match app.js format
		flashcards = data.results.map((q, index) => {
			const options = [...q.incorrect_answers, q.correct_answer];

			// Shuffle options
			for (let i = options.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[options[i], options[j]] = [options[j], options[i]];
			}

			// Correct index AFTER shuffling
			const correctIndex = options.indexOf(q.correct_answer);

			// Save correctIndex into questionResults
			questionResults[index] = {
				correctIndex: correctIndex,
				userAnswer: null,
				status: null,
				locked: false
			};

			// Build front text with line breaks
			const question = decodeHTML(q.question);
			const formattedOptions = options
				.map((opt, i) => `${i + 1}. ${decodeHTML(opt)}`)
				.join("\n");

			const frontText = `${question}\n\n${formattedOptions}`;

			return {
				front: frontText,
				back: `${correctIndex + 1}. ${decodeHTML(q.correct_answer)}`
			};
		});

		currentIndex = 0;

		flashcardDiv.classList.remove("hidden");
		controls.classList.remove("hidden");

		displayCard();

		setupQuestionJumping();
		updateRightSideListDisplay();
		refreshQuizControls();

	} catch (err) {
		frontDiv.textContent = "Error loading questions.";
	}
}

// Hide all the add/import/export sections (unused in math mode)
addSec.classList.add("hidden");
exportSec.classList.add("hidden");
importArea.classList.add("hidden");

// overwrite localStorage load
flashcards = [];   // clear any old local saved data

// Fetch questions instead of using localStorage
loadAPIFlashcards();

function setMode(mode) {
	currentMode = mode;

	const rightTitle = document.getElementById("right-title");

	const flagBtn = document.getElementById("flag-btn");
	const flipBtn = document.getElementById("flipBtn");
	const saveBtn = document.getElementById("save-btn");
	const quizTimer = document.getElementById("quiz-timer");
	const quizOptions = document.getElementById("quiz-options");
	const submitBtn = document.getElementById("submitBtn");

	if (mode === "flashcards") {
		rightTitle.textContent = "Cards";
		flagBtn.classList.add("hidden");
		flipBtn.classList.remove("hidden");
		saveBtn.classList.remove("hidden");
		quizTimer.classList.add("hidden");
		quizOptions.classList.add("hidden");
		submitBtn.classList.add("hidden");
		stopQuizTimer();

	} else if (mode === "learn") {
		rightTitle.textContent = "Notes";
		flagBtn.classList.remove("hidden");
		flipBtn.classList.remove("hidden");
		saveBtn.classList.add("hidden");
		quizTimer.classList.add("hidden");
		quizOptions.classList.add("hidden");
		submitBtn.classList.add("hidden");
		stopQuizTimer();

	} else if (mode === "quiz") {
		rightTitle.textContent = "Questions";
		flagBtn.classList.add("hidden");
		flipBtn.classList.remove("hidden");
		saveBtn.classList.add("hidden");
		quizTimer.classList.remove("hidden");
		quizOptions.classList.remove("hidden");
		submitBtn.classList.remove("hidden");   // SHOW submit button in quiz
		startQuizTimer();
		refreshQuizControls();
	}

	updateRightSideListDisplay();
}

function updateRightSideListDisplay() {
	const items = document.querySelectorAll(".question-item");

	items.forEach((item, i) => {

		// remove old styles
		item.classList.remove("flagged", "correct", "incorrect");

		// learn mode → show flag status
		if (currentMode === "learn" && flaggedQuestions.has(i)) {
			item.classList.add("flagged");
		}

		// quiz mode → show grading (correct / incorrect)
		if (currentMode === "quiz") {
			if (questionResults[i].status === "correct") {
				item.classList.add("correct");
			} else if (questionResults[i].status === "incorrect") {
				item.classList.add("incorrect");
			}
		}
	});
}

// Jump to a specific flashcard when clicking “Question X”
function setupQuestionJumping() {
	const items = document.querySelectorAll(".question-item");

	items.forEach(item => {
		item.addEventListener("click", () => {
			const index = parseInt(item.dataset.index);

			// update global flashcard index
			currentIndex = index;

			// show that card
			displayCard();
		});
	});
}

function startQuizTimer() {
	quizSeconds = 0;
	const timerEl = document.getElementById("quiz-timer");

	quizTimerInterval = setInterval(() => {
		quizSeconds++;
		const mins = String(Math.floor(quizSeconds / 60)).padStart(2, '0');
		const secs = String(quizSeconds % 60).padStart(2, '0');
		timerEl.textContent = `Time: ${mins}:${secs}`;
	}, 1000);
}

function stopQuizTimer() {
	if (quizTimerInterval) {
		clearInterval(quizTimerInterval);
		quizTimerInterval = null;
	}
}

function refreshQuizControls() {
	if (currentMode !== "quiz") return;

	const result = questionResults[currentIndex];
	const submitBtn = document.getElementById("submitBtn");
	const flipBtn = document.getElementById("flipBtn");

	// ALWAYS clear selected ABCD
	selectedAnswerIndex = null;   // ✔ FIX

	document.querySelectorAll(".quiz-opt").forEach(b => {
		b.classList.remove("selected");
		b.classList.remove("disabled-submit");
	});

	// If locked → freeze all buttons
	if (result.locked) {
		// disable ABCD buttons
		document.querySelectorAll(".quiz-opt").forEach(b => {
			b.classList.add("disabled-submit");
		});

		// disable submit
		submitBtn.classList.add("disabled-submit");

		// disable flip
		flipBtn.classList.add("disabled-submit");

	} else {
		// enable ABCD + Submit
		document.querySelectorAll(".quiz-opt").forEach(b => {
			b.classList.remove("disabled-submit");
		});

		submitBtn.classList.remove("disabled-submit");
		flipBtn.classList.remove("disabled-submit");
	}
}

function checkIfQuizComplete() {
    const done = Object.values(questionResults).every(q => q.status !== null);
    if (!done) return;

    stopQuizTimer();

    // Count correct answers
    const score = Object.values(questionResults).filter(q => q.status === "correct").length;

    // Format time
    const mins = String(Math.floor(quizSeconds / 60)).padStart(2, '0');
    const secs = String(quizSeconds % 60).padStart(2, '0');
    const timeFormatted = `${mins}:${secs}`;

    // Save to localStorage (your existing code)
    saveQuizResultsToLocalStorage("Art", currentDifficulty, score, timeFormatted);

    // SHOW POPUP
    const popup = document.getElementById("quiz-popup");
    const scoreEl = document.getElementById("popup-score");
    const timeEl = document.getElementById("popup-time");

    scoreEl.textContent = `Score: ${score} / 10`;
    timeEl.textContent = `Time: ${timeFormatted}`;

    popup.classList.remove("hidden");

    // Close button
    document.getElementById("popup-close").onclick = () => {
        popup.classList.add("hidden");
    };

    console.log("Quiz Complete → Popup shown");
}

function setDifficulty(level) {
	if (level === "easy") currentDifficulty = DIFFICULTY.EASY;
	else if (level === "medium") currentDifficulty = DIFFICULTY.MEDIUM;
	else if (level === "hard") currentDifficulty = DIFFICULTY.HARD;

	// Update UI highlight
	document.querySelectorAll(".difficulty-btn").forEach(btn => {
		btn.classList.remove("active-difficulty");
	});
	document.getElementById(`diff-${level}`).classList.add("active-difficulty");

	// rebuild the API URL with the new difficulty
	apiURL = buildURL(currentCategory, currentDifficulty);

	// reload questions
	loadAPIFlashcards();
}

document.getElementById("flag-btn").addEventListener("click", () => {

	// toggle flag for this index
	if (flaggedQuestions.has(currentIndex)) flaggedQuestions.delete(currentIndex);
	else flaggedQuestions.add(currentIndex);

	updateRightSideListDisplay();
});

document.querySelectorAll(".quiz-opt").forEach(btn => {
	btn.addEventListener("click", () => {
		if (currentMode !== "quiz") return;

		// Prevent selecting when question locked
		if (questionResults[currentIndex].locked) return;

		const index = parseInt(btn.dataset.index);

		if (selectedAnswerIndex === index) {
			btn.classList.remove("selected");
			selectedAnswerIndex = null;
			document.getElementById("submitBtn").classList.add("disabled-submit");
			return;
		}

		selectedAnswerIndex = index;

		document.querySelectorAll(".quiz-opt").forEach(b => {
			b.classList.remove("selected");
		});
		btn.classList.add("selected");

		document.getElementById("submitBtn").classList.remove("disabled-submit");
	});
});

document.getElementById("flipBtn").addEventListener("click", () => {
	if (currentMode === "quiz") {
		const result = questionResults[currentIndex];

		if (!result.locked) {
			result.status = "incorrect"; // gave up
			result.locked = true;
			updateRightSideListDisplay();
			checkIfQuizComplete();
		}
	}

	// original flip behavior proceeds
});

document.getElementById("submitBtn").addEventListener("click", () => {
	if (currentMode !== "quiz") return;
	if (selectedAnswerIndex === null) return;
	if (questionResults[currentIndex].locked) return;

	const result = questionResults[currentIndex];
	result.userAnswer = selectedAnswerIndex;

	if (selectedAnswerIndex === result.correctIndex) {
		result.status = "correct";
	} else {
		result.status = "incorrect";
	}

	result.locked = true;  // LOCK the question

	updateRightSideListDisplay();
	refreshQuizControls();
	checkIfQuizComplete();
	console.log(currentIndex + " C ");
});

document.getElementById("nextBtn").addEventListener("click", () => {
	if (currentMode !== "quiz") {
		displayCard();
		refreshQuizControls();
		return;
	}

	let found = false;
	let start = currentIndex;

	do {
		let next = (currentIndex + 1) % flashcards.length;
		if (next === start) break;
		if (!questionResults[currentIndex].locked) {
			found = true;
			break;
		}
		currentIndex = next;
	} while (true);

	if (!found) {
		console.log("All questions are already answered.");
		return;
	}

	// Reset visual selection & show next card
	selectedAnswerIndex = null;
	displayCard();
	refreshQuizControls();
});

document.getElementById("prevBtn").addEventListener("click", () => {
	if (currentMode !== "quiz") {
		displayCard();
		refreshQuizControls();
		return;
	}

	let found = false;
	let start = currentIndex;

	do {
		let prev = (currentIndex - 1 + flashcards.length) % flashcards.length;
		if (prev === start) break;
		if (!questionResults[currentIndex].locked) {
			found = true;
			break;
		}
		currentIndex = prev;
	} while (true);

	if (!found) {
		console.log("All questions answered.");
		return;
	}

	selectedAnswerIndex = null;
	displayCard();
	refreshQuizControls();
});

window.setMode = setMode;
window.setDifficulty = setDifficulty;
window.setupQuestionJumping = setupQuestionJumping;

function saveQuizResultsToLocalStorage(subject, difficulty, score, time) {
	const record = {
		subject,
		difficulty,
		score,
		time,
		date: new Date().toLocaleDateString()
	};

	// Load existing
	let stats = JSON.parse(localStorage.getItem("smartSausageStats")) || [];

	stats.push(record);

	localStorage.setItem("smartSausageStats", JSON.stringify(stats));
}

document.getElementById("save-btn").addEventListener("click", () => {
	if (currentMode !== "flashcards") return;

	const card = flashcards[currentIndex];
	const correctIndex = questionResults[currentIndex].correctIndex;
	const correctAnswer = card.back;   // already contains the correct answer text

	// Build entry
	const entry = {
		subject: "Art",               // CHANGE THIS per subject file
		difficulty: currentDifficulty,
		question: card.front,
		answer: correctAnswer,
		date: new Date().toLocaleDateString()
	};

	// Load old saved list
	let saved = JSON.parse(localStorage.getItem("savedFlashcards") || "[]");

	// Prevent duplicates
	const exists = saved.some(
		item => item.question === entry.question && item.subject === entry.subject
	);

	if (!exists) {
		saved.push(entry);
		localStorage.setItem("savedFlashcards", JSON.stringify(saved));
		showSaveToast();
	}
});
