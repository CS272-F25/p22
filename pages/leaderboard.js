// Load stored quiz results
const stats = JSON.parse(localStorage.getItem("smartSausageStats")) || [];

// -----------------------------
// HELPERS
// -----------------------------
function parseTimeString(str) {
    if (!str || !str.includes(":")) return null;
    const [m, s] = str.split(":").map(Number);
    return m * 60 + s;
}

function normalizeDate(str) {
    const d = new Date(str);
    if (isNaN(d)) return null;
    return d.toISOString().split("T")[0]; // yyyy-mm-dd
}


// -----------------------------
// FAVORITE SUBJECT
// -----------------------------
function computeFavoriteSubject() {
    if (stats.length === 0) return null;

    const count = {};
    stats.forEach(r => {
        count[r.subject] = (count[r.subject] || 0) + 1;
    });

    return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

const subjectIcons = {
    Math: "../images/math1.png",
    Science: "../images/science1.png",
    Geography: "../images/geo1.png",
    History: "../images/history1.png",
    Art: "../images/art1.png"
};

const fav = computeFavoriteSubject();
if (fav) {
    document.getElementById("fav-subject-img").src = subjectIcons[fav];
    document.getElementById("fav-subject-name").textContent = fav;
}


// -----------------------------
// FASTEST PERFECT SCORE
// -----------------------------
function computeFastestPerfect() {
    const perfects = stats.filter(r => r.score === 10);
    if (perfects.length === 0) return null;

    perfects.sort((a, b) => parseTimeString(a.time) - parseTimeString(b.time));
    return perfects[0].time;
}

document.getElementById("fastest-time").textContent =
    computeFastestPerfect() ?? "None";


// -----------------------------
// MOST ACTIVE DAY
// -----------------------------
function computeMostActiveDay() {
    if (stats.length === 0) return null;

    const dayCount = {};

    stats.forEach(r => {
        dayCount[r.date] = (dayCount[r.date] || 0) + 1;
    });

    return Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0];
}

document.getElementById("most-active-day").textContent =
    computeMostActiveDay() ?? "--";


// -----------------------------
// SUBJECT-SPECIFIC STATS
// -----------------------------
function getSubjectData(subject) {
    return stats
        .filter(s => s.subject === subject)
        .map(s => ({
            score: s.score,
            time: parseTimeString(s.time),
            date: normalizeDate(s.date)
        }))
        .filter(s => s.date !== null);
}

function computeStats(subject) {
    const data = getSubjectData(subject);

    if (data.length === 0) {
        return {
            bestTime: "--",
            avgScore: "--",
            totalTime: "--",
            totalGames: 0,
            dailyCounts: {}
        };
    }

    const perfects = data.filter(d => d.score === 10 && d.time !== null);
    const bestTime = perfects.length
        ? Math.min(...perfects.map(d => d.time))
        : "--";

    const avgScore = (data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(2);
    const totalTime = data.reduce((sum, d) => sum + (d.time ?? 0), 0);

    const dailyCounts = {};
    data.forEach(d => {
        dailyCounts[d.date] = (dailyCounts[d.date] || 0) + 1;
    });

    return {
        bestTime,
        avgScore,
        totalTime,
        totalGames: data.length,
        dailyCounts
    };
}

// -----------------------------
// GRAPH RENDERING
// -----------------------------
function renderGraph(canvasId, dailyCounts) {
    const ctx = document.getElementById(canvasId);

    const labels = [];
    const counts = [];

    for (let i = 30; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().split("T")[0];

        labels.push(iso.substring(5)); // "MM-DD"
        counts.push(dailyCounts[iso] || 0);
    }

    new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Games Played",
                data: counts,
                borderColor: "#1a4ac9",
                backgroundColor: "rgba(26, 74, 201, 0.1)",
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // <-- Makes chart fill container nicely

            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,          
                    ticks: {
                        stepSize: 2, 
                    },
                    grid: {
                        drawBorder: false,
                        color: "rgba(0,0,0,0.08)"
                    }
                },

                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 65,
                        minRotation: 65
                    },
                    grid: {
                        display: false
                    }
                }
            },

            plugins: {
                legend: { display: true }
            }
        }
    });
}


// -----------------------------
// RENDER SUBJECT BLOCK
// -----------------------------
function renderSubject(subject, prefix) {
    const s = computeStats(subject);

    document.getElementById(`${prefix}-best-time`).textContent =
        s.bestTime === "--" ? "--" : formatTime(s.bestTime);

    document.getElementById(`${prefix}-average-score`).textContent = s.avgScore;
    document.getElementById(`${prefix}-total-time`).textContent =
        s.totalTime === "--" ? "--" : formatTime(s.totalTime);

    document.getElementById(`${prefix}-total-games`).textContent = s.totalGames;

    renderGraph(`${prefix}-graph`, s.dailyCounts);
}

function formatTime(sec) {
    if (sec === "--") return "--";
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
}


// -----------------------------
// LEADERBOARD TABLE
// -----------------------------
function loadLeaderboard() {
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = "";

    if (stats.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No data yet</td></tr>`;
        return;
    }

    stats.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.subject}</td>
            <td>${r.difficulty}</td>
            <td>${r.score}/10</td>
            <td>${r.time}</td>
            <td>${r.date}</td>
        `;
        tbody.appendChild(tr);
    });
}


// -----------------------------
// RUN EVERYTHING
// -----------------------------
renderSubject("Math", "math");
renderSubject("Science", "science");
renderSubject("Geography", "geo");
renderSubject("History", "history");
renderSubject("Art", "art");

loadLeaderboard();
