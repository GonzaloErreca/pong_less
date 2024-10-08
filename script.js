const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Variables del juego
let player1 = { x: 0, y: canvas.height / 2 - 40, width: 10, height: 80, dy: 0, color: "red" };
let player2 = { x: canvas.width - 10, y: canvas.height / 2 - 40, width: 10, height: 80, dy: 0, color: "blue" };
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 4, dx: 4, dy: 4 };

// Puntuación
let score1 = 0;
let score2 = 0;
let gameActive = false; // Estado del juego

// Elementos de la puntuación
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");
const resetButton = document.getElementById("resetButton");
const startButton = document.getElementById("startButton");
const winnerMessage = document.getElementById("winnerMessage");

// Control de teclas
document.addEventListener("keydown", (event) => {
    if (event.key === "w") player1.dy = -5;
    if (event.key === "s") player1.dy = 5;
    if (event.key === "ArrowUp") player2.dy = -5;
    if (event.key === "ArrowDown") player2.dy = 5;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "s") player1.dy = 0;
    if (event.key === "ArrowUp" || event.key === "ArrowDown") player2.dy = 0;
});

// Dibuja el juego
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Dibuja jugadores
    context.fillStyle = player1.color;
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    context.fillStyle = player2.color;
    context.fillRect(player2.x, player2.y, player2.width, player2.height);
    
    // Dibuja pelota
    context.fillStyle = "white";
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
}

// Actualiza el estado del juego
function update() {
    if (!gameActive) return; // Solo actualiza si el juego está activo

    // Mueve los jugadores
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Limita los movimientos
    player1.y = Math.max(Math.min(player1.y, canvas.height - player1.height), 0);
    player2.y = Math.max(Math.min(player2.y, canvas.height - player2.height), 0);

    // Mueve la pelota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisiones con la pared
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Colisiones con los jugadores
    if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height) {
        ball.dx *= -1;
    }
    
    if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height) {
        ball.dx *= -1;
    }

    // Resetea la pelota y actualiza la puntuación si sale de la pantalla
    if (ball.x + ball.radius < 0) {
        score2++;
        checkWin();
        increaseBallSize(); // Aumentar tamaño de la pelota
        resetBall();
    }
    
    if (ball.x - ball.radius > canvas.width) {
        score1++;
        checkWin();
        increaseBallSize(); // Aumentar tamaño de la pelota
        resetBall();
    }

    // Actualiza la puntuación en la pantalla
    score1Display.textContent = score1;
    score2Display.textContent = score2;
}

// Aumenta el tamaño de la pelota
function increaseBallSize() {
    ball.radius += 2; // Aumenta el tamaño de la pelota
}

// Reinicia la pelota
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // Cambia la dirección de la pelota
}

// Reinicia el juego
function resetGame() {
    score1 = 0;
    score2 = 0;
    ball.radius = 10; // Reinicia el tamaño de la pelota
    score1Display.textContent = score1;
    score2Display.textContent = score2;
    winnerMessage.style.display = "none"; // Oculta el mensaje de victoria
    resetBall();
    gameActive = true;
}

// Comprueba si hay un ganador
function checkWin() {
    if (score1 >= 10 || score2 >= 10) {
        gameActive = false;
        winnerMessage.textContent = score1 >= 10 ? "¡Jugador 1 (Rojo) Gana!" : "¡Jugador 2 (Azul) Gana!";
        winnerMessage.style.display = "block"; // Muestra el mensaje de victoria
        resetButton.style.display = "block"; // Muestra el botón de reinicio
    }
}

// Event Listener para el botón de inicio
startButton.addEventListener("click", () => {
    resetGame(); // Reinicia el juego al comenzar
    startButton.style.display = "none"; // Oculta el botón de inicio
    resetButton.style.display = "none"; // Asegúrate de ocultar el botón de reinicio
    gameLoop(); // Inicia el bucle del juego
});

// Event Listener para el botón de reinicio
resetButton.addEventListener("click", () => {
    resetGame(); // Reinicia el juego
    startButton.style.display = "none"; // Oculta el botón de inicio
});

// Bucle del juego
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

