// URL for Math (Science: Mathematics)
const apiURL = "https://opentdb.com/api.php?amount=10&category=17";

// Decode HTML entities (OpenTDB uses &amp;, &#039;, etc.)
function decodeHTML(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

async function loadAPIFlashcards() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Convert API results into flashcards that match app.js format
    flashcards = data.results.map(q => {
    const options = [...q.incorrect_answers, q.correct_answer];

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    // Build front text with line breaks
    const question = decodeHTML(q.question);
    const formattedOptions = options
        .map((opt, i) => `${i + 1}. ${decodeHTML(opt)}`)
        .join("\n");

    const frontText = `${question}\n\n${formattedOptions}`;

    return {
        front: frontText,
        back: (options.indexOf(decodeHTML(q.correct_answer))+1) + ". " + decodeHTML(q.correct_answer)
    };
});


    // Start at the first card
    currentIndex = 0;

    // Unhide flashcard + controls
    flashcardDiv.classList.remove("hidden");
    controls.classList.remove("hidden");

    // Render first card using app.js function
    displayCard();

    // enable "jump to question" clicking
    setupQuestionJumping();

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
  const rightTitle = document.getElementById("right-title");

  if (mode === "flashcards") rightTitle.textContent = "Cards";
  else if (mode === "learn") rightTitle.textContent = "Notes";
  else if (mode === "quiz") rightTitle.textContent = "Questions";
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

