// ============================================================================
// SENTENCE CONFIGURATION - Images are stored in /images folder
// ============================================================================
// Each sentence uses a local image file from the /images folder.
// Generate images using ImageFX and upload them to /images folder.
// See IMAGES.md for detailed instructions on generating and uploading images.
// Recommended image size: 800x600px or similar landscape ratio (PNG format)
// ============================================================================

const sentences = [
    {
        text: "O menino está comendo pizza",
        description: "O que está acontecendo?",
        // IMAGE: images/boy-eating-pizza.png
        // Generate with ImageFX: Young boy eating pizza, happy expression, casual setting
        imageUrl: "images/boy-eating-pizza.png"
    },
    {
        text: "A menina está bebendo suco",
        description: "O que está acontecendo?",
        // IMAGE: images/girl-drinking-juice.png
        // Generate with ImageFX: Young girl drinking juice from a glass or juice box
        imageUrl: "images/girl-drinking-juice.png"
    },
    {
        text: "O cachorro está correndo no parque",
        description: "O que está acontecendo?",
        // IMAGE: images/dog-running-park.png
        // Generate with ImageFX: Dog running in a park, outdoor setting with grass/trees
        imageUrl: "images/dog-running-park.png"
    },
    {
        text: "O carro está na garagem",
        description: "Onde está o carro?",
        // IMAGE: images/car-in-garage.png
        // Generate with ImageFX: Car parked inside a garage, clear garage setting
        imageUrl: "images/car-in-garage.png"
    },
    {
        text: "O livro está em cima da mesa",
        description: "Onde está o livro?",
        // IMAGE: images/book-on-table.png
        // Generate with ImageFX: Book on top of a table, clear view showing book and table surface
        imageUrl: "images/book-on-table.png"
    }
];

let gameState = {
    rounds: [],
    currentRound: 0,
    score: 0,
    stars: 0,
    attempts: 0,
    perfectRounds: 0
};

function initGame() {
    gameState.rounds = [];
    for (let i = 0; i < 5; i++) {
        for (let sentence of sentences) {
            gameState.rounds.push({ ...sentence, completed: false });
        }
    }
    shuffleArray(gameState.rounds);
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.stars = 0;
    gameState.attempts = 0;
    gameState.perfectRounds = 0;

    showRound();
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

    document.getElementById('currentRound').textContent = gameState.currentRound + 1;
    document.getElementById('roundDisplay').textContent = `${gameState.currentRound + 1}/25`;
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
        gameState.stars++;
        gameState.perfectRounds++;
    } else if (gameState.attempts === 1) {
        points = 50;
    } else {
        points = 25;
    }

    gameState.score += points;
    showPointPopup(points, starEarned);

    document.getElementById('sentenceReveal').textContent = round.text;

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

    if (gameState.currentRound >= 25) {
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
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('starsDisplay').textContent = `⭐ ${gameState.stars}`;

    const progress = ((gameState.currentRound) / 25) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function endGame() {
    document.getElementById('gameCard').classList.remove('active');
    document.getElementById('celebration').classList.add('show');

    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('totalStars').textContent = gameState.stars;
    document.getElementById('perfectRounds').textContent = gameState.perfectRounds;
    document.getElementById('avgPoints').textContent = Math.round(gameState.score / 25);

    let rank = 'bronze';
    let rankText = 'Bronze';
    if (gameState.score >= 2000) {
        rank = 'diamond';
        rankText = '💎 Diamante';
    } else if (gameState.score >= 1500) {
        rank = 'gold';
        rankText = '🥇 Ouro';
    } else if (gameState.score >= 1000) {
        rank = 'silver';
        rankText = '🥈 Prata';
    } else {
        rankText = '🥉 Bronze';
    }

    const rankDisplay = document.getElementById('rankDisplay');
    rankDisplay.textContent = rankText;
    rankDisplay.className = `rank ${rank}`;

    const highScore = localStorage.getItem('highScore') || 0;
    if (gameState.score > highScore) {
        localStorage.setItem('highScore', gameState.score);
        document.getElementById('highScore').textContent = gameState.score + ' 🆕';
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
