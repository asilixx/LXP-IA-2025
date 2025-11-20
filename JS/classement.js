function timeToSeconds(timeStr) {
    const [m, s] = timeStr.split(":").map(Number);
    return m * 60 + s;
}

const entries = Object.entries(localStorage);

const leaderboard = entries
    .filter(([name, chrono]) => /^\d{1,2}:\d{2}$/.test(chrono))
    .map(([name, chrono]) => ({
        name,
        chrono,
        seconds: timeToSeconds(chrono)
    }));

leaderboard.sort((a, b) => b.seconds - a.seconds);

const leaderboardDiv = document.getElementById("leaderboard");

const table = document.createElement("table");
table.classList.add("leaderboard-table");

table.innerHTML = `
    <thead>
        <tr>
            <th>Rang</th>
            <th>Nom</th>
            <th>Temps</th>
        </tr>
    </thead>
    <tbody>
        ${leaderboard.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.chrono}</td>
            </tr>
        `).join('')}
    </tbody>
`;

leaderboardDiv.appendChild(table);

document.addEventListener("DOMContentLoaded", () => {
    const replayBtn = document.getElementById("replayBtn");

    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
});

