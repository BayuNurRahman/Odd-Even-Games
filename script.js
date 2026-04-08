let score = 0;
let lives = 3;
let currentNumber = 0;
let playerName = "";

// Tambahkan ini agar Highscore muncul saat halaman pertama kali dibuka
document.addEventListener("DOMContentLoaded", function() {
    const scores = JSON.parse(localStorage.getItem('ganjilGenapHighscore')) || [];
    displayHighscores(scores);
});

function startGame() {
    const input = document.getElementById('username-input');
    if (input.value.trim() === "") {
        alert("Silakan masukkan nama!");
        return;
    }
    playerName = input.value;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    generateNumber();
}

function generateNumber() {
    currentNumber = Math.floor(Math.random() * 100) + 1;
    document.getElementById('number').innerText = currentNumber;
}

function tebak(pilihan) {
    const correctAns = (currentNumber % 2 === 0) ? 'genap' : 'ganjil';
    const msg = document.getElementById('message');

    if (pilihan === correctAns) {
        score++;
        msg.innerText = "✅ Benar!";
        msg.style.color = "green";
    } else {
        lives--;
        msg.innerText = `❌ Salah! Itu angka ${correctAns.toUpperCase()}.`;
        msg.style.color = "red";
    }

    document.getElementById('score').innerText = score;
    document.getElementById('lives').innerText = lives;

    if (lives <= 0) {
        saveScore(playerName, score);
        showGameOver();
    } else {
        generateNumber();
    }
}

function saveScore(name, finalScore) {
    let highscores = JSON.parse(localStorage.getItem('ganjilGenapHighscore')) || [];
    
    // Logika Upsert: Update jika nama sama, Insert jika nama baru
    const existingPlayerIndex = highscores.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingPlayerIndex !== -1) {
        if (finalScore > highscores[existingPlayerIndex].score) {
            highscores[existingPlayerIndex].score = finalScore;
        }
    } else {
        highscores.push({ name: name, score: finalScore });
    }
    
    highscores.sort((a, b) => b.score - a.score);
    highscores = highscores.slice(0, 3); // Ambil 3 besar
    
    localStorage.setItem('ganjilGenapHighscore', JSON.stringify(highscores));
    displayHighscores(highscores);
}

// Modifikasi agar mengisi tabel di Layar Login dan Layar Game Over
function displayHighscores(scores) {
    const initialList = document.getElementById('initial-highscore-list'); // Di layar login
    const gameOverList = document.getElementById('highscore-list');         // Di layar game over
    
    let rows = "";
    if (scores.length === 0) {
        rows = "<tr><td colspan='3' style='text-align:center'>Belum ada rekor</td></tr>";
    } else {
        scores.forEach((item, index) => {
            rows += `<tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.score}</td>
            </tr>`;
        });
    }

    if (initialList) initialList.innerHTML = rows;
    if (gameOverList) gameOverList.innerHTML = rows;
}

function showGameOver() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-msg').innerText = `${playerName}, skor akhir kamu adalah ${score}`;
}
