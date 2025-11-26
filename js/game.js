// ============================================================================
// GAME CONFIGURATION
// ============================================================================
// Central configuration object for easy customization and scaling
// ============================================================================

const GAME_CONFIG = {
    roundsPerSession: 15,              // Total rounds per session
    selectedCategories: ['all'],        // Filter by: 'all', 'food-actions', 'object-locations', 'activities', 'daily-routines'
    selectedDifficulty: ['all'],        // Filter by: 'all', 'easy', 'medium', 'hard'
    repetitionsAllowed: true            // Allow sentences to appear multiple times per session
};

// ============================================================================
// SENTENCE HELPER FUNCTIONS
// ============================================================================

/**
 * Get all enabled sentences from SENTENCE_DATA
 * @returns {Array} Array of all enabled sentence objects
 */
function getAllSentences() {
    return SENTENCE_DATA.filter(sentence => sentence.enabled);
}

/**
 * Get sentences filtered by category
 * @param {string|Array} category - Category name(s) or 'all'
 * @returns {Array} Array of matching sentence objects
 */
function getSentencesByCategory(category) {
    const allSentences = getAllSentences();

    if (category === 'all' || (Array.isArray(category) && category.includes('all'))) {
        return allSentences;
    }

    const categories = Array.isArray(category) ? category : [category];
    return allSentences.filter(sentence => categories.includes(sentence.category));
}

/**
 * Get sentences filtered by difficulty
 * @param {string|Array} difficulty - Difficulty level(s) or 'all'
 * @returns {Array} Array of matching sentence objects
 */
function getSentencesByDifficulty(difficulty) {
    const allSentences = getAllSentences();

    if (difficulty === 'all' || (Array.isArray(difficulty) && difficulty.includes('all'))) {
        return allSentences;
    }

    const difficulties = Array.isArray(difficulty) ? difficulty : [difficulty];
    return allSentences.filter(sentence => difficulties.includes(sentence.difficulty));
}

/**
 * Get random selection of sentences based on filters
 * @param {number} count - Number of sentences to return
 * @param {Object} options - Filter options {category, difficulty}
 * @returns {Array} Array of randomly selected sentence objects
 */
function getRandomSentences(count, options = {}) {
    let sentences = getAllSentences();

    // Apply category filter
    if (options.category && options.category !== 'all') {
        sentences = getSentencesByCategory(options.category);
    }

    // Apply difficulty filter
    if (options.difficulty && options.difficulty !== 'all') {
        sentences = sentences.filter(s =>
            Array.isArray(options.difficulty)
                ? options.difficulty.includes(s.difficulty)
                : s.difficulty === options.difficulty
        );
    }

    // If we need more sentences than available, allow repetitions
    const result = [];
    const available = [...sentences];

    for (let i = 0; i < count; i++) {
        if (available.length === 0) {
            // Refill if we run out (allows repetitions)
            available.push(...sentences);
        }

        const randomIndex = Math.floor(Math.random() * available.length);
        result.push({...available[randomIndex]});

        if (!GAME_CONFIG.repetitionsAllowed) {
            available.splice(randomIndex, 1);
        }
    }

    return result;
}

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

    // Get filtered sentences based on GAME_CONFIG
    let availableSentences = getAllSentences();

    // Apply category filter
    if (!GAME_CONFIG.selectedCategories.includes('all')) {
        availableSentences = getSentencesByCategory(GAME_CONFIG.selectedCategories);
    }

    // Apply difficulty filter
    if (!GAME_CONFIG.selectedDifficulty.includes('all')) {
        availableSentences = availableSentences.filter(s =>
            GAME_CONFIG.selectedDifficulty.includes(s.difficulty)
        );
    }

    // Generate rounds based on roundsPerSession
    const roundsNeeded = GAME_CONFIG.roundsPerSession;
    const sentenceCount = availableSentences.length;

    if (roundsNeeded <= sentenceCount) {
        // If we need fewer or equal rounds than available sentences
        // Add all sentences once, then randomly select extras
        for (let sentence of availableSentences) {
            gameState.rounds.push({ ...sentence, completed: false });
        }

        // If we need fewer rounds, randomly remove some
        while (gameState.rounds.length > roundsNeeded) {
            const randomIndex = Math.floor(Math.random() * gameState.rounds.length);
            gameState.rounds.splice(randomIndex, 1);
        }

        // If we need a few more, randomly select from available
        const extrasNeeded = roundsNeeded - gameState.rounds.length;
        if (extrasNeeded > 0) {
            const sentencesToRepeat = [];
            const availableIndices = [...Array(sentenceCount).keys()];

            for (let i = 0; i < extrasNeeded; i++) {
                const randomIndex = Math.floor(Math.random() * availableIndices.length);
                const sentenceIndex = availableIndices.splice(randomIndex, 1)[0];
                sentencesToRepeat.push(availableSentences[sentenceIndex]);
            }

            for (let sentence of sentencesToRepeat) {
                gameState.rounds.push({ ...sentence, completed: false });
            }
        }
    } else {
        // If we need more rounds than available sentences
        // Use getRandomSentences to fill with repetitions
        gameState.rounds = getRandomSentences(roundsNeeded, {
            category: GAME_CONFIG.selectedCategories,
            difficulty: GAME_CONFIG.selectedDifficulty
        }).map(s => ({ ...s, completed: false }));
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
