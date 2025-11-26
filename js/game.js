// ============================================================================
// SENTENCE CONFIGURATION - Images are stored in /images folder
// ============================================================================
// Each sentence uses a local image file from the /images folder.
// All 13 images have been generated and uploaded to the /images folder.
// The game has 15 rounds: all 13 sentences appear once, plus 2 random sentences repeat.
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
    totalRounds: 0,
    journeyProgress: 0
};

function initGame() {
    gameState.rounds = [];
    // Add all 13 sentences once (13 rounds)
    for (let sentence of sentences) {
        gameState.rounds.push({ ...sentence, completed: false });
    }

    // Randomly select 2 sentences to repeat (2 more rounds = 15 total)
    const sentencesToRepeat = [];
    const availableIndices = [...Array(sentences.length).keys()]; // [0, 1, 2, ..., 12]

    // Select 2 random sentences to repeat
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const sentenceIndex = availableIndices.splice(randomIndex, 1)[0];
        sentencesToRepeat.push(sentences[sentenceIndex]);
    }

    // Add the 2 repeated sentences
    for (let sentence of sentencesToRepeat) {
        gameState.rounds.push({ ...sentence, completed: false });
    }

    shuffleArray(gameState.rounds);
    gameState.totalRounds = gameState.rounds.length; // Should be 15
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
    // Initial Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    // Check for consecutive duplicates and fix them
    let maxAttempts = 100; // Prevent infinite loops
    let attempts = 0;

    while (hasConsecutiveDuplicates(array) && attempts < maxAttempts) {
        attempts++;
        // Find the first consecutive duplicate
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i].imageUrl === array[i + 1].imageUrl) {
                // Try to swap with a non-adjacent element that won't create a new duplicate
                let swapped = false;
                for (let j = i + 2; j < array.length && !swapped; j++) {
                    // Check if swapping would create a new consecutive duplicate
                    const wouldCreateDuplicate =
                        (j > 0 && array[j - 1].imageUrl === array[i + 1].imageUrl) ||
                        (j < array.length - 1 && array[j + 1].imageUrl === array[i + 1].imageUrl);

                    if (!wouldCreateDuplicate) {
                        // Safe to swap
                        [array[i + 1], array[j]] = [array[j], array[i + 1]];
                        swapped = true;
                    }
                }

                // If we couldn't find a good swap, do a random swap and try again
                if (!swapped && i + 2 < array.length) {
                    const randomIndex = Math.floor(Math.random() * (array.length - i - 2)) + i + 2;
                    [array[i + 1], array[randomIndex]] = [array[randomIndex], array[i + 1]];
                }
                break;
            }
        }
    }
}

function hasConsecutiveDuplicates(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i].imageUrl === array[i + 1].imageUrl) {
            return true;
        }
    }
    return false;
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

// ============================================================================
// JOURNEY MAP FUNCTIONS
// ============================================================================

function initJourneyMap() {
    const journeyPath = document.getElementById('journeyPath');
    journeyPath.innerHTML = '';

    // Define milestone positions for 15 rounds
    const milestones = [5, 10, 15];
    const milestoneIcons = ['🎯', '⭐', '🏆'];

    // Create steps from 1 to totalRounds
    for (let i = 1; i <= gameState.totalRounds; i++) {
        const step = document.createElement('div');
        step.className = 'journey-step';
        step.id = `journey-step-${i}`;

        // Check if this is a milestone
        const milestoneIndex = milestones.indexOf(i);
        if (milestoneIndex !== -1) {
            step.classList.add('milestone');
            step.textContent = milestoneIcons[milestoneIndex];
        } else {
            step.textContent = i;
        }

        journeyPath.appendChild(step);
    }

    // Mark first step as current
    document.getElementById('journey-step-1').classList.add('current');

    // Position character at start
    updateJourneyCharacter();
}

function updateJourneyProgress() {
    gameState.journeyProgress++;

    const currentStep = document.getElementById(`journey-step-${gameState.journeyProgress}`);
    const previousStep = document.getElementById(`journey-step-${gameState.journeyProgress - 1}`);

    if (previousStep) {
        previousStep.classList.remove('current');
        previousStep.classList.add('completed');
    }

    if (currentStep) {
        currentStep.classList.add('current');

        // Check if this is a milestone
        if (currentStep.classList.contains('milestone')) {
            celebrateMilestone();
        }
    }

    // Update character position with jump animation
    updateJourneyCharacter();
}

function updateJourneyCharacter() {
    const character = document.getElementById('journeyCharacter');
    const currentStepElement = document.getElementById(`journey-step-${gameState.journeyProgress || 1}`);

    if (!currentStepElement || !character) return;

    // Add jumping animation
    character.classList.add('jumping');
    setTimeout(() => {
        character.classList.remove('jumping');
    }, 600);

    // Calculate position based on current step
    const journeyPath = document.getElementById('journeyPath');
    const pathRect = journeyPath.getBoundingClientRect();
    const stepRect = currentStepElement.getBoundingClientRect();

    // Check if we're in mobile mode (horizontal layout)
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
        // Horizontal positioning for mobile
        const leftPosition = stepRect.left - pathRect.left + (stepRect.width / 2) - 20;
        character.style.left = `${leftPosition}px`;
        character.style.bottom = '60px';
    } else {
        // Vertical positioning for desktop
        const bottomPosition = stepRect.bottom - pathRect.bottom + (stepRect.height / 2) - 20;
        character.style.bottom = `${Math.abs(bottomPosition)}px`;
        character.style.left = '50%';
        character.style.transform = 'translateX(-50%)';
    }
}

function celebrateMilestone() {
    // Create confetti
    createConfetti();

    // Play celebration sound effect (optional - could add later)
    // You could add an audio element for a "ding" sound
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Handle window resize for character repositioning
window.addEventListener('resize', () => {
    if (gameState.journeyProgress > 0) {
        updateJourneyCharacter();
    }
});

initGame();
