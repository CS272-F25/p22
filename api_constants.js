// Base API endpoint
export const OTDB_BASE = "https://opentdb.com/api.php";

// Category ID map (easy to reference everywhere)
export const CATEGORY = {
	MATH: 19,
	SCIENCE: 17,
	GEOGRAPHY: 22,
	HISTORY: 23,
	ART: 25
};

// Difficulty map (easy to reference everywhere)
export const DIFFICULTY = {
	EASY: "easy",
	MEDIUM: "medium",
	HARD: "hard"
};

// A helper that generates URLs for ANY category + ANY difficulty
export function buildURL(categoryID, difficulty, amount = 10) {
	let x = `${OTDB_BASE}?amount=${amount}&category=${categoryID}&difficulty=${difficulty}`;
	console.log(x);
	return x;
}
