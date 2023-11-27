const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"),
        difficulties: document.querySelectorAll('input[type="radio"][name="difficulty"]')
    },
    values: {
        timerId: null,
        countDownTimerId: null,
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        currentLives: 3,
    },
    button: document.getElementById("start"),
    difficulty: document.getElementById("start-button"),
    overlay: document.getElementById("overlay")
}

//função do contador de tempo
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0){
        clearInterval(state.values.countDownTimerId);
        clearInterval(state.values.timerId);
        alert("Acabou o tempo! Sua pontuação foi: " + state.values.result);
        location.reload();
    }
}

// função para tocar sons
function playSound(){
    let audio = new Audio("./src/audios/hit.wav");
    audio.play();
}

// função para gerar a posição aleatória do personagem
function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");

    state.values.hitPosition = randomSquare.id;
}

// função para checar a dificuldade
function checkDifficulty() {
    state.view.difficulties.forEach(radioButton => {
        radioButton.addEventListener('change', () => {
            if (radioButton.checked) {
                switch (radioButton.value) {
                    case 'facil':
                        state.values.gameVelocity = 1000;
                        break;
                    case 'medio':
                        state.values.gameVelocity = 700;
                        break;
                    case 'dificil':
                        state.values.gameVelocity = 400;
                        break;
                    case 'impossivel':
                        state.values.gameVelocity = 100;
                        break;
                    default:
                        state.values.gameVelocity = 1000;
                }
            }
        })
    }) 
}

// função para mover o inimigo entre os tiles
function moveEnemy() {
    clearInterval(state.values.timerId);
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// função que aguarda os cliques nos tiles
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(square.id === state.values.hitPosition) {
                state.values.result++
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound();
            } else if(square.id !== state.values.hitPosition) {
                state.values.currentLives--;
                state.view.lives.textContent = state.values.currentLives;
                if(state.values.currentLives <= 0) {
                    alert("Game Over! Sua pontuação foi: " + state.values.result);
                    location.reload();
                }
            }
        })
    })
}

// função para começar o jogo
function startGame() {
    state.button.addEventListener("mousedown", () => {
        moveEnemy();
        addListenerHitBox();
        state.values.countDownTimerId = setInterval(countDown, 1000);
        state.button.style.display = "none";
        state.overlay.style.display = "none";
        state.difficulty.style.display = "none";
    })
}

// função inicial para iniciar tudo kkk
function init() {
    checkDifficulty()
    startGame();   
}

init();