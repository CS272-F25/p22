// Placeholder for future JavaScript functionality

//global variables that will make all of the coding after easier

let flashcards = [];
let currentIndex = 0;
let showingBack = false;

//all the ids we will manipulate through javascript 
const importArea = document.getElementById("importArea");
const flashcardDiv = document.getElementById("flashcard");
const frontDiv = document.getElementById("front");
const backDiv = document.getElementById("back");
const controls = document.getElementById("controls");
const addSec = document.getElementById("addCardSection");
const exportSec = document.getElementById("exportSection");

//load flashcards from the local storage
function loadFromLocalStorage() {
	const storedCards = localStorage.getItem("flashcards");

	if (storedCards !== null) {
		flashcards = JSON.parse(storedCards);
	}

	//can always allow adding and exporting no matter what
	addSec.classList.remove("hidden");
	exportSec.classList.remove("hidden");
	importArea.classList.remove("hidden");

	//if there is cards show them now
	if (flashcards.length > 0) {
		flashcardDiv.classList.remove("hidden");
		controls.classList.remove("hidden");
		displayCard();
	}
}

//save the flashcards to the local storage
function saveToLocalStorage() {
	const data = JSON.stringify(flashcards);
	localStorage.setItem("flashcards", data);
}

//importing a csv andd parsing it and then displaying it
document.getElementById("importBtn").addEventListener("click", function () {
	document.getElementById("csvFile").click();
});


document.getElementById("csvFile").addEventListener("change", function () {
	const file = this.files[0];
	const reader = new FileReader();

	//parsing the csv file here
	reader.onload = function (event) {
		const text = event.target.result;
		const lines = text.split("\n");

		let newCards = [];

		for (let i = 0; i < lines.length; i++) {
			const parts = lines[i].split(",");

			if (parts.length >= 2) {
				const front = parts[0].trim();
				const back = parts[1].trim();
				//for each line we will push to the global variable
				newCards.push({
					front: front,
					back: back
				});
			}
		}

		flashcards = newCards;

		saveToLocalStorage(); //save imported to local storage

		importArea.classList.remove("hidden");
		flashcardDiv.classList.remove("hidden");
		controls.classList.remove("hidden");
		addSec.classList.remove("hidden");
		exportSec.classList.remove("hidden");

		currentIndex = 0; //start at the first card
		displayCard(); //display the card set
	};

	reader.readAsText(file);
});

//display the first card in set
function displayCard() {
	if (flashcards.length === 0) {
		return;
	}

	const card = flashcards[currentIndex];

	frontDiv.textContent = card.front;
	backDiv.textContent = card.back;

	showingBack = false;

	frontDiv.classList.remove("hidden");
	backDiv.classList.add("hidden");
}

//flip current card
document.getElementById("flipBtn").addEventListener("click", function () {
	showingBack = !showingBack;

	if (showingBack === true) { //switch front card from show to hidden and back to not hidden or vice versa
		frontDiv.classList.add("hidden");
		backDiv.classList.remove("hidden");
	} else {
		backDiv.classList.add("hidden");
		frontDiv.classList.remove("hidden");
	}
});

//next card and previous card
document.getElementById("nextBtn").addEventListener("click", function () {

	if (flashcards.length === 0) { //no cards
		return;
	}

	currentIndex = currentIndex + 1;

	//if we find the end then just go back to the first card

	if (currentIndex >= flashcards.length) {
		currentIndex = 0;
	}

	displayCard();
});

document.getElementById("prevBtn").addEventListener("click", function () {
	if (flashcards.length === 0) {
		return;
	}

	currentIndex = currentIndex - 1;
	//if we find the end then just go back to the last card
	if (currentIndex < 0) {
		currentIndex = flashcards.length - 1;
	}

	displayCard();
});

//add a card to the set
document.getElementById("addBtn").addEventListener("click", function () {
	const front = document.getElementById("newFront").value.trim(); //get rid of any whitespace present
	const back = document.getElementById("newBack").value.trim();

	if (front === "" || back === "") return alert("Front and Back must have text!"); //won't take an empty card 

	const wasEmpty = flashcards.length === 0;

	//add new card and push to the local storage
	flashcards.push({ front, back });
	saveToLocalStorage(); //save to local storage right away

	//clear text boxes for card we just addedd
	document.getElementById("newFront").value = "";
	document.getElementById("newBack").value = "";

	//go to the newest card
	currentIndex = flashcards.length - 1;

	//If this is the first card ever added unhide everything
	if (wasEmpty) {
		importArea.classList.remove("hidden");
		flashcardDiv.classList.remove("hidden");
		controls.classList.remove("hidden");
	}

	displayCard();
});

//export the current flashcard set as a csv
document.getElementById("exportBtn").addEventListener("click", function () {
	let csv = "";

	//loop through the cards and manually create a csv string
	for (let i = 0; i < flashcards.length; i++) {
		const card = flashcards[i];
		csv += card.front + "," + card.back;

		if (i < flashcards.length - 1) {
			csv += "\n";
		}
	}

	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "flashcards.csv";
	a.click();

	URL.revokeObjectURL(url);
});

//run js at the page load
loadFromLocalStorage();