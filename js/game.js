// ============================================================================
// SENTENCE CONFIGURATION - Images are stored in /images folder
// ============================================================================
// Each sentence uses a local image file from the /images folder.
// All 13 images have been generated and uploaded to the /images folder.
// The game repeats each sentence twice for a total of 26 rounds.
// ============================================================================

const sentences = [
    {
        text: "O menino está comendo pizza",
        description: "O que está acontecendo?",
        imageUrl: "images/boy-eating-pizza.png"
    },
    {
        text: "A menina está bebendo suco",
        description: "O que está acontecendo?",
        imageUrl: "images/girl-drinking-juice.jpeg"
    },
    {
        text: "O cachorro está correndo no parque",
        description: "O que está acontecendo?",
        imageUrl: "images/dog-running-park.jpeg"
    },
    {
        text: "O livro está em cima da mesa",
        description: "Onde está o livro?",
        imageUrl: "images/book-on-table.jpeg"
    },
    {
        text: "O gato está no sofá",
        description: "Onde está o gato?",
        imageUrl: "images/cat-on-sofa.jpeg"
    },
    {
        text: "A mochila está na cadeira",
        description: "Onde está a mochila?",
        imageUrl: "images/backpack-on-chair.jpeg"
    },
    {
        text: "O menino está bebendo leite",
        description: "O que está acontecendo?",
        imageUrl: "images/boy-drinking-milk.jpeg"
    },
    {
        text: "O menino está comendo hambúrguer",
        description: "O que está acontecendo?",
        imageUrl: "images/boy-eating-burger.jpeg"
    },
    {
        text: "O menino está lendo um livro",
        description: "O que está acontecendo?",
        imageUrl: "images/boy-reading-book.jpeg"
    },
    {
        text: "A menina está desenhando",
        description: "O que está acontecendo?",
        imageUrl: "images/girl-drawing-picture.jpeg"
    },
    {
        text: "A menina está comendo maçã",
        description: "O que está acontecendo?",
        imageUrl: "images/girl-eating-apple.jpeg"
    },
    {
        text: "A menina está jogando vôlei",
        description: "O que está acontecendo?",
        imageUrl: "images/girl-playing-volley.jpeg"
    },
    {
        text: "O celular está carregando",
        description: "O que está acontecendo?",
        imageUrl: "images/phone-is-recharging.jpeg"
    }
];

let gameState = {
    rounds: [],
    currentRound: 0,
    todayScore: 0,
    totalScore: 0,
    attempts: 0,
    perfectRounds: 0,
    totalRounds: 0
};

function initGame() {
    gameState.rounds = [];
    // With 13 sentences, repeat each twice for 26 total rounds
    for (let i = 0; i < 2; i++) {
        for (let sentence of sentences) {
            gameState.rounds.push({ ...sentence, completed: false });
        }
    }
    shuffleArray(gameState.rounds);
    gameState.totalRounds = gameState.rounds.length;
    gameState.currentRound = 0;
    gameState.todayScore = 0;
    gameState.attempts = 0;
    gameState.perfectRounds = 0;
    gameState.journeyProgress = 0;

    // Load total score from localStorage
    gameState.totalScore = parseInt(localStorage.getItem('totalScore') || '0');

    showRound();
    initJourneyMap();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showRound() {
    const round = gameState.rounds[gameState.currentRound];
    gameState.attempts = 0;

    document.getElementById('sceneDescription').textContent = round.description;
    document.getElementById('sentenceReveal').textContent = '';
    document.getElementById('attemptCounter').textContent = '';

    // Load and display the image
    loadSceneImage(round.imageUrl);

    updateScore();
}

function loadSceneImage(imageUrl) {
    const imageContainer = document.getElementById('sceneImage');
    const loadingIndicator = document.getElementById('imageLoading');

    // Show loading state
    imageContainer.style.opacity = '0';
    loadingIndicator.style.display = 'block';

    // Create new image
    const img = new Image();

    img.onload = function() {
        imageContainer.src = imageUrl;
        imageContainer.style.opacity = '1';
        loadingIndicator.style.display = 'none';
    };

    img.onerror = function() {
        // If image fails to load, show a fallback
        imageContainer.src = 'https://via.placeholder.com/800x600/CCCCCC/666666?text=Imagem+Indisponivel';
        imageContainer.style.opacity = '1';
        loadingIndicator.style.display = 'none';
    };

    img.src = imageUrl;
}

function markCorrect() {
    const round = gameState.rounds[gameState.currentRound];
    let points = 0;
    let starEarned = false;

    if (gameState.attempts === 0) {
        points = 100;
        starEarned = true;
        gameState.perfectRounds++;
    } else if (gameState.attempts === 1) {
        points = 50;
    } else {
        points = 25;
    }

    gameState.todayScore += points;
    gameState.totalScore += points;
    showPointPopup(points, starEarned);

    document.getElementById('sentenceReveal').textContent = round.text;

    // Update journey progress
    updateJourneyProgress();

    setTimeout(() => {
        nextRound();
    }, 2000);
}

function tryAgain() {
    gameState.attempts++;
    const attemptsText = gameState.attempts === 1 ? '2ª tentativa' : '3ª tentativa';
    document.getElementById('attemptCounter').textContent = attemptsText;
}

function skipRound() {
    nextRound();
}

function nextRound() {
    gameState.currentRound++;

    if (gameState.currentRound >= gameState.totalRounds) {
        endGame();
    } else {
        showRound();
    }
}

function showPointPopup(points, star) {
    const popup = document.createElement('div');
    popup.className = 'point-popup';
    popup.textContent = star ? `+${points} ⭐` : `+${points}`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function updateScore() {
    document.getElementById('todayScore').textContent = gameState.todayScore;
    document.getElementById('totalScore').textContent = gameState.totalScore;

    const progress = ((gameState.currentRound) / gameState.totalRounds) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressPercentage').textContent = Math.round(progress) + '%';
}

function endGame() {
    document.getElementById('gameCard').classList.remove('active');
    document.getElementById('celebration').classList.add('show');

    // Save total score to localStorage
    localStorage.setItem('totalScore', gameState.totalScore);

    document.getElementById('finalScore').textContent = gameState.todayScore;
    document.getElementById('totalStars').textContent = gameState.totalScore;
    document.getElementById('perfectRounds').textContent = gameState.perfectRounds;
    document.getElementById('avgPoints').textContent = Math.round(gameState.todayScore / gameState.totalRounds);

    let rank = 'bronze';
    let rankText = 'Bronze';
    if (gameState.todayScore >= 2000) {
        rank = 'diamond';
        rankText = '💎 Diamante';
    } else if (gameState.todayScore >= 1500) {
        rank = 'gold';
        rankText = '🥇 Ouro';
    } else if (gameState.todayScore >= 1000) {
        rank = 'silver';
        rankText = '🥈 Prata';
    } else {
        rankText = '🥉 Bronze';
    }

    const rankDisplay = document.getElementById('rankDisplay');
    rankDisplay.textContent = rankText;
    rankDisplay.className = `rank ${rank}`;

    const highScore = localStorage.getItem('highScore') || 0;
    if (gameState.todayScore > highScore) {
        localStorage.setItem('highScore', gameState.todayScore);
        document.getElementById('highScore').textContent = gameState.todayScore + ' 🆕';
    } else {
        document.getElementById('highScore').textContent = highScore;
    }
}

function playAgain() {
    document.getElementById('celebration').classList.remove('show');
    document.getElementById('gameCard').classList.add('active');
    initGame();
}

initGame();
