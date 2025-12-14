// Load stats
const stats = JSON.parse(localStorage.getItem("smartSausageStats")) || [];

// ===============================
// 1. FAVORITE SUBJECT
// ===============================
function computeFavoriteSubject() {
    if (stats.length === 0) return null;

    const count = {};
    stats.forEach(r => {
        if (!count[r.subject]) count[r.subject] = 0;
        count[r.subject]++;
    });

    const fav = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
    return fav ? fav[0] : null;
}

// Map subject to an icon (use your own images)
const subjectIcons = {
    Math: "../images/subjects/math1.png",
    Science: "../images/subjects/science1.png",
    Geography: "../images/subjects/geo1.png",
    History: "../images/history1.png",
    Art: "../images/art1.png"
};

// Display favorite subject
const favSubject = computeFavoriteSubject();
if (favSubject) {
    document.getElementById("fav-subject-img").src = subjectIcons[favSubject];
    document.getElementById("fav-subject-name").textContent = favSubject;
} else {
    document.getElementById("fav-subject-name").textContent = "No data yet";
}


// ===============================
// 2. FASTEST PERFECT SCORE (10/10)
// ===============================
function computeFastestPerfect() {
    const perfects = stats.filter(r => r.score === 10);
    if (perfects.length === 0) return null;

    function timeToSeconds(t) {
        const [m, s] = t.split(":").map(Number);
        return m * 60 + s;
    }

    perfects.sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time));

    return perfects[0].time;
}

const fastest = computeFastestPerfect();
document.getElementById("fastest-time").textContent =
    fastest ? fastest : "None yet";


// ===============================
// 3. MOST ACTIVE DAY
// ===============================
function computeMostActiveDay() {
    if (stats.length === 0) return null;

    const daily = {};

    stats.forEach(r => {
        const day = r.date;
        if (!daily[day]) daily[day] = 0;
        daily[day]++;
    });

    const top = Object.entries(daily).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
}

const bestDay = computeMostActiveDay();
document.getElementById("most-active-day").textContent =
    bestDay ? bestDay : "No activity yet";


// =======================================================
// BELOW HERE: SAME CHART CODE AS BEFORE
// =======================================================

// ---- GROUP BY SUBJECT ----
function groupBySubject() {
    const counts = {};
    stats.forEach(r => {
        if (!counts[r.subject]) counts[r.subject] = 0;
        counts[r.subject]++;
    });
    return counts;
}

const subjectData = groupBySubject();

// ---- SCORE OVER TIME ----
const timelineLabels = stats.map(r => r.date);
const timelineScores = stats.map(r => r.score);

// ---- SCATTER: TIME vs SCORE ----
function timeToSeconds(t) {
    const [min, sec] = t.split(":").map(Number);
    return min * 60 + sec;
}

const scatterData = stats.map(r => ({
    x: r.score,
    y: timeToSeconds(r.time)
}));

// ------- CREATE CHARTS -------
new Chart(document.getElementById("subjectChart"), {
    type: "bar",
    data: {
        labels: Object.keys(subjectData),
        datasets: [{
            label: "Total Quizzes",
            data: Object.values(subjectData),
            backgroundColor: "rgba(100,150,255,0.7)"
        }]
    }
});

new Chart(document.getElementById("scoreTimeline"), {
    type: "line",
    data: {
        labels: timelineLabels,
        datasets: [{
            label: "Score",
            data: timelineScores,
            borderColor: "blue",
            tension: 0.3
        }]
    }
});

new Chart(document.getElementById("scatterTimeScore"), {
    type: "scatter",
    data: {
        datasets: [{
            label: "Time (seconds) vs Score",
            data: scatterData,
            backgroundColor: "red"
        }]
    },
    options: {
        scales: {
            x: { title: { text: "Score", display: true }},
            y: { title: { text: "Time (seconds)", display: true }}
        }
    }
});

function loadLeaderboard() {
    const tableBody = document.querySelector("#leaderboard-table tbody");

    // Load from localStorage
    const stats = JSON.parse(localStorage.getItem("smartSausageStats")) || [];

    // Empty table first
    tableBody.innerHTML = "";

    if (stats.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No quiz data yet. Go take a quiz!</td></tr>`;
        return;
    }

    // Add each row
    stats.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.subject}</td>
            <td>${record.difficulty}</td>
            <td>${record.score}/10</td>
            <td>${record.time}</td>
            <td>${record.date}</td>
        `;

        tableBody.appendChild(row);
    });
}

loadLeaderboard();
