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
