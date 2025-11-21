// URL for Math (Science: Mathematics)
const apiURL = "https://opentdb.com/api.php?amount=10&category=19";

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
    flashcards = data.results.map(q => ({
      front: decodeHTML(q.question),
      back: decodeHTML(q.correct_answer)
    }));

    // Start at the first card
    currentIndex = 0;

    // Unhide flashcard + controls
    flashcardDiv.classList.remove("hidden");
    controls.classList.remove("hidden");

    // Render first card using app.js function
    displayCard();

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
