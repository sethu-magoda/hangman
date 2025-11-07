// Game data and state
const gameData = {
    words: {
        easy: [
            { word: "APPLE", clue: "A fruit that keeps the doctor away" },
            { word: "HOUSE", clue: "A place where people live" },
            { word: "MUSIC", clue: "Art form that combines melody and rhythm" },
            { word: "WATER", clue: "Essential liquid for all life forms" },
            { word: "SMILE", clue: "Facial expression showing happiness" }
        ],
        medium: [
            { word: "PYTHON", clue: "A programming language and a snake" },
            { word: "JOURNEY", clue: "An extended period of travel" },
            { word: "MYSTERY", clue: "Something that is difficult to understand or explain" },
            { word: "QUARTZ", clue: "A hard mineral consisting of silica" },
            { word: "VOLCANO", clue: "A mountain that erupts with lava and ash" }
        ],
        hard: [
            { word: "KALEIDOSCOPE", clue: "Optical instrument with changing symmetrical patterns" },
            { word: "ZEPPELIN", clue: "A type of rigid airship named after its German inventor" },
            { word: "JUXTAPOSE", clue: "To place things side by side for comparison" },
            { word: "QUIXOTIC", clue: "Extremely idealistic, unrealistic and impractical" },
            { word: "ZUGZWANG", clue: "Chess situation where any move worsens the position" }
        ],
        extreme: [
            { word: "PARALLELEPIPED", clue: "A 3D figure formed by six parallelograms" },
            { word: "PSYCHOPHYSICS", clue: "Branch of psychology dealing with physical stimuli" },
            { word: "QUIZZICALITIES", clue: "Puzzling or curious aspects or qualities" },
            { word: "XYLOGRAPHICAL", clue: "Related to the art of engraving on wood" },
            { word: "ZOOGEOGRAPHICAL", clue: "Relating to the geographical distribution of animals" }
        ]
    },
    currentWord: "",
    currentClue: "",
    difficulty: "easy",
    level: 1,
    score: 0,
    maxAttempts: 6,
    wrongAttempts: 0,
    guessedLetters: [],
    gameMode: "single",
    playerTurn: 1,
    players: [
        { name: "Player 1", score: 0 },
        { name: "Player 2", score: 0 }
    ],
    aiDifficulty: "medium"
};

// DOM Elements
const elements = {
    modeButtons: document.querySelectorAll('.mode-btn'),
    difficultyButtons: document.querySelectorAll('.difficulty-btn'),
    levelSlider: document.querySelector('.level-slider'),
    currentLevel: document.querySelector('.current-level'),
    playerNameInputs: document.querySelectorAll('.player-name'),
    wordInput: document.querySelector('.word-input'),
    submitWordButton: document.querySelector('.submit-word'),
    startGameButton: document.querySelector('.start-game-btn'),
    gameSetupPanel: document.querySelector('.game-setup-panel'),
    gameContainer: document.querySelector('.game-container'),
    levelDisplay: document.querySelector('.level-number'),
    difficultyDisplay: document.querySelector('.difficulty-name'),
    scoreDisplay: document.querySelector('.score-value'),
    playerTurnDisplay: document.querySelector('.player-turn .player-name'),
    hangmanParts: document.querySelectorAll('.hangman-part'),
    clueText: document.querySelector('.clue-text'),
    wordDisplay: document.querySelector('.word-display'),
    keyboardButtons: document.querySelectorAll('.key-btn'),
    hintButton: document.querySelector('.hint-btn'),
    skipButton: document.querySelector('.skip-btn'),
    pauseButton: document.querySelector('.pause-btn'),
    gameOverScreen: document.querySelector('.game-over-screen'),
    resultTitle: document.querySelector('.result-title'),
    resultMessage: document.querySelector('.result-message'),
    correctWord: document.querySelector('.correct-word'),
    finalLevel: document.querySelector('.final-level'),
    finalScore: document.querySelector('.final-score'),
    wordsSolved: document.querySelector('.words-solved'),
    playAgainButton: document.querySelector('.play-again-btn'),
    mainMenuButton: document.querySelector('.main-menu-btn'),
    pauseMenu: document.querySelector('.pause-menu'),
    resumeButton: document.querySelector('.resume-btn'),
    restartButton: document.querySelector('.restart-btn'),
    quitButton: document.querySelector('.quit-btn'),
    multiplayerTurnScreen: document.querySelector('.multiplayer-turn-screen'),
    turnPlayerName: document.querySelector('.turn-player-name'),
    animationContainer: document.querySelector('.animation-container')
};

// Initialize the game
function initGame() {
    setupEventListeners();
    updateLevelDisplay();
}

// Set up all event listeners
function setupEventListeners() {
    // Mode selection
    elements.modeButtons.forEach(button => {
        button.addEventListener('click', () => selectMode(button));
    });

    // Difficulty selection
    elements.difficultyButtons.forEach(button => {
        button.addEventListener('click', () => selectDifficulty(button));
    });

    // Level slider
    elements.levelSlider.addEventListener('input', updateLevelDisplay);

    // Player name inputs
    elements.playerNameInputs.forEach(input => {
        input.addEventListener('input', validateMultiplayerSetup);
    });

    // Word input
    elements.wordInput.addEventListener('input', validateMultiplayerSetup);

    // Submit word button
    elements.submitWordButton.addEventListener('click', submitWord);

    // Start game button
    elements.startGameButton.addEventListener('click', startGame);

    // Keyboard buttons
    elements.keyboardButtons.forEach(button => {
        button.addEventListener('click', () => handleLetterClick(button));
    });

    // Control buttons
    elements.hintButton.addEventListener('click', provideHint);
    elements.skipButton.addEventListener('click', skipWord);
    elements.pauseButton.addEventListener('click', pauseGame);

    // Game over buttons
    elements.playAgainButton.addEventListener('click', playAgain);
    elements.mainMenuButton.addEventListener('click', showMainMenu);

    // Pause menu buttons
    elements.resumeButton.addEventListener('click', resumeGame);
    elements.restartButton.addEventListener('click', restartGame);
    elements.quitButton.addEventListener('click', showMainMenu);

    // Physical keyboard support
    document.addEventListener('keydown', handlePhysicalKeyboard);
}

// Game mode selection
function selectMode(button) {
    elements.modeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    gameData.gameMode = button.dataset.mode;

    // Show/hide appropriate setup sections
    document.querySelectorAll('.setup-section').forEach(section => {
        section.classList.add('hidden');
    });

    if (gameData.gameMode === 'single') {
        document.querySelector('.single-player-setup').classList.remove('hidden');
    } else if (gameData.gameMode === 'multi') {
        document.querySelector('.multiplayer-setup').classList.remove('hidden');
        validateMultiplayerSetup();
    } else if (gameData.gameMode === 'computer') {
        document.querySelector('.computer-setup').classList.remove('hidden');
    }
}

// Difficulty selection
function selectDifficulty(button) {
    elements.difficultyButtons.forEach(btn => {
        if (btn.parentElement === button.parentElement) {
            btn.classList.remove('active');
        }
    });
    button.classList.add('active');
    
    if (button.closest('.single-player-setup') || button.closest('.computer-setup')) {
        gameData.difficulty = button.dataset.difficulty;
    } else if (button.closest('.multiplayer-setup')) {
        // For multiplayer, difficulty might be used for something else
    }
}

// Update level display based on slider
function updateLevelDisplay() {
    gameData.level = parseInt(elements.levelSlider.value);
    elements.currentLevel.textContent = `Level: ${gameData.level}`;
}

// Validate multiplayer setup
function validateMultiplayerSetup() {
    const player1Name = elements.playerNameInputs[0].value.trim();
    const player2Name = elements.playerNameInputs[1].value.trim();
    const word = elements.wordInput.value.trim();
    
    const isValid = player1Name.length > 0 && player2Name.length > 0 && 
                   word.length >= 4 && /^[a-zA-Z]+$/.test(word);
    
    elements.submitWordButton.disabled = !isValid;
    elements.startGameButton.disabled = !(isValid && gameData.currentWord);
}

// Submit word in multiplayer mode
function submitWord() {
    const word = elements.wordInput.value.trim().toUpperCase();
    gameData.currentWord = word;
    gameData.currentClue = "Multiplayer word - no clue available";
    
    elements.wordInput.value = "";
    elements.submitWordButton.disabled = true;
    elements.startGameButton.disabled = false;
    
    showNotification("Word submitted successfully!");
}

// Start the game
function startGame() {
    // Set player names if in multiplayer mode
    if (gameData.gameMode === 'multi') {
        gameData.players[0].name = elements.playerNameInputs[0].value.trim() || "Player 1";
        gameData.players[1].name = elements.playerNameInputs[1].value.trim() || "Player 2";
        gameData.playerTurn = 1;
    }
    
    // Get a word based on mode
    if (gameData.gameMode === 'single' || gameData.gameMode === 'computer') {
        const wordList = gameData.words[gameData.difficulty];
        const wordData = wordList[(gameData.level - 1) % wordList.length];
        gameData.currentWord = wordData.word;
        gameData.currentClue = wordData.clue;
    }
    
    // Hide setup and show game
    elements.gameSetupPanel.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    
    // Update game info displays
    elements.levelDisplay.textContent = gameData.level;
    elements.difficultyDisplay.textContent = gameData.difficulty.charAt(0).toUpperCase() + gameData.difficulty.slice(1);
    elements.scoreDisplay.textContent = gameData.score;
    elements.playerTurnDisplay.textContent = gameData.players[gameData.playerTurn - 1].name;
    
    // Reset game state
    resetGameState();
    
    // Setup the word display
    setupWordDisplay();
    
    // Show the clue
    elements.clueText.textContent = gameData.currentClue;
    
    // If playing against computer and it's computer's turn, make a move
    if (gameData.gameMode === 'computer' && gameData.playerTurn === 2) {
        setTimeout(computerTurn, 1000);
    }
}

// Reset game state for a new round
function resetGameState() {
    gameData.wrongAttempts = 0;
    gameData.guessedLetters = [];
    
    // Reset hangman drawing
    elements.hangmanParts.forEach(part => {
        if (part.id !== 'base' && part.id !== 'pole' && part.id !== 'top-bar' && part.id !== 'rope') {
            part.classList.add('hidden');
        }
    });
    
    // Enable all keyboard buttons
    elements.keyboardButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('correct', 'incorrect');
    });
}

// Set up the word display with placeholders
function setupWordDisplay() {
    elements.wordDisplay.innerHTML = '';
    
    for (let i = 0; i < gameData.currentWord.length; i++) {
        const letterPlaceholder = document.createElement('div');
        letterPlaceholder.className = 'letter-placeholder';
        letterPlaceholder.dataset.index = i;
        elements.wordDisplay.appendChild(letterPlaceholder);
    }
}

// Handle letter click from virtual keyboard
function handleLetterClick(button) {
    const letter = button.dataset.key;
    guessLetter(letter);
}

// Handle physical keyboard input
function handlePhysicalKeyboard(event) {
    if (elements.gameContainer.classList.contains('hidden')) return;
    
    const key = event.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        guessLetter(key);
    }
}

// Process a letter guess
function guessLetter(letter) {
    // Check if letter was already guessed
    if (gameData.guessedLetters.includes(letter)) {
        showNotification("You already tried that letter!");
        return;
    }
    
    // Add to guessed letters
    gameData.guessedLetters.push(letter);
    
    // Find the button and disable it
    const button = Array.from(elements.keyboardButtons).find(btn => btn.dataset.key === letter);
    if (button) {
        button.disabled = true;
    }
    
    // Check if letter is in the word
    if (gameData.currentWord.includes(letter)) {
        // Correct guess
        if (button) button.classList.add('correct');
        
        // Reveal the letter in the word display
        revealLetter(letter);
        
        // Check if player has won
        if (checkWin()) {
            handleWin();
            return;
        }
    } else {
        // Wrong guess
        if (button) button.classList.add('incorrect');
        gameData.wrongAttempts++;
        updateHangmanDrawing();
        
        // Check if player has lost
        if (gameData.wrongAttempts >= gameData.maxAttempts) {
            handleLoss();
            return;
        }
    }
    
    // If playing against computer and it's computer's turn, make a move
    if (gameData.gameMode === 'computer' && gameData.playerTurn === 2) {
        setTimeout(computerTurn, 1000);
    }
}

// Reveal a correctly guessed letter
function revealLetter(letter) {
    for (let i = 0; i < gameData.currentWord.length; i++) {
        if (gameData.currentWord[i] === letter) {
            const placeholder = elements.wordDisplay.querySelector(`.letter-placeholder[data-index="${i}"]`);
            placeholder.textContent = letter;
            placeholder.classList.add('revealed');
        }
    }
}

// Update hangman drawing based on wrong attempts
function updateHangmanDrawing() {
    const partsToShow = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    
    if (gameData.wrongAttempts > 0 && gameData.wrongAttempts <= partsToShow.length) {
        const partToShow = partsToShow[gameData.wrongAttempts - 1];
        const partElement = document.getElementById(partToShow);
        if (partElement) {
            partElement.classList.remove('hidden');
            
            // Add animation
            partElement.classList.add('shake');
            setTimeout(() => partElement.classList.remove('shake'), 500);
        }
    }
}

// Check if player has won
function checkWin() {
    const placeholders = elements.wordDisplay.querySelectorAll('.letter-placeholder');
    for (let placeholder of placeholders) {
        if (!placeholder.textContent) return false;
    }
    return true;
}

// Handle win condition
function handleWin() {
    // Calculate score based on difficulty and remaining attempts
    const difficultyMultipliers = { easy: 1, medium: 2, hard: 3, extreme: 5 };
    const scoreEarned = (gameData.level * 10) * difficultyMultipliers[gameData.difficulty] * 
                       (1 + (gameData.maxAttempts - gameData.wrongAttempts) / gameData.maxAttempts);
    
    gameData.score += Math.round(scoreEarned);
    
    // In multiplayer mode, add to current player's score
    if (gameData.gameMode === 'multi') {
        gameData.players[gameData.playerTurn - 1].score += Math.round(scoreEarned);
    }
    
    // Show win animation
    showConfetti();
    
    // Show notification
    showNotification(`Great job! +${Math.round(scoreEarned)} points`);
    
    // Prepare next round after a delay
    setTimeout(() => {
        if (gameData.gameMode === 'multi') {
            nextPlayerTurn();
        } else {
            nextLevel();
        }
    }, 2000);
}

// Handle loss condition
function handleLoss() {
    // Show game over screen
    elements.gameOverScreen.classList.remove('hidden');
    elements.resultTitle.textContent = "Game Over";
    elements.resultMessage.textContent = "The word was:";
    elements.correctWord.textContent = gameData.currentWord;
    elements.finalLevel.textContent = gameData.level;
    elements.finalScore.textContent = gameData.score;
    
    // Calculate words solved (for single player)
    if (gameData.gameMode === 'single') {
        const wordsSolved = Math.max(0, gameData.level - 1);
        elements.wordsSolved.textContent = wordsSolved;
    } else {
        elements.wordsSolved.textContent = "N/A";
    }
}

// Move to next level
function nextLevel() {
    gameData.level++;
    
    // If we've exceeded the level range, loop back
    const maxLevel = 1000;
    if (gameData.level > maxLevel) {
        gameData.level = 1;
        showNotification("Starting over from level 1!");
    }
    
    // Update level slider and display
    elements.levelSlider.value = gameData.level;
    updateLevelDisplay();
    
    // Start the next level
    startGame();
}

// Switch to next player's turn (multiplayer)
function nextPlayerTurn() {
    // Show turn screen
    elements.multiplayerTurnScreen.classList.remove('hidden');
    elements.turnPlayerName.textContent = gameData.players[gameData.playerTurn - 1].name;
    
    // After a delay, switch to the next player
    setTimeout(() => {
        elements.multiplayerTurnScreen.classList.add('hidden');
        
        // Switch turns
        gameData.playerTurn = gameData.playerTurn === 1 ? 2 : 1;
        elements.playerTurnDisplay.textContent = gameData.players[gameData.playerTurn - 1].name;
        
        // Reset for the next player's turn
        resetGameState();
        setupWordDisplay();
        
        // Show the input for the next player to enter a word
        elements.wordInput.value = "";
        elements.submitWordButton.disabled = true;
        elements.gameContainer.classList.add('hidden');
        document.querySelector('.multiplayer-setup').classList.remove('hidden');
    }, 3000);
}

// Computer's turn (when playing against AI)
function computerTurn() {
    // Simple AI: guess letters based on frequency in English language
    const letterFrequency = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
    let letterToGuess = '';
    
    // Find a letter that hasn't been guessed yet
    for (let letter of letterFrequency) {
        if (!gameData.guessedLetters.includes(letter)) {
            letterToGuess = letter;
            break;
        }
    }
    
    // If we found a letter, guess it
    if (letterToGuess) {
        // Find and click the corresponding button
        const button = Array.from(elements.keyboardButtons).find(btn => btn.dataset.key === letterToGuess);
        if (button) {
            button.click();
        }
    }
}

// Provide a hint to the player
function provideHint() {
    // Find a letter that hasn't been guessed yet
    const unguessedLetters = [];
    for (let i = 0; i < gameData.currentWord.length; i++) {
        const letter = gameData.currentWord[i];
        if (!gameData.guessedLetters.includes(letter) && !unguessedLetters.includes(letter)) {
            unguessedLetters.push(letter);
        }
    }
    
    if (unguessedLetters.length > 0) {
        // Reveal a random unguessed letter
        const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
        const hintLetter = unguessedLetters[randomIndex];
        revealLetter(hintLetter);
        
        // Add to guessed letters
        gameData.guessedLetters.push(hintLetter);
        
        // Disable the button
        const button = Array.from(elements.keyboardButtons).find(btn => btn.dataset.key === hintLetter);
        if (button) {
            button.disabled = true;
            button.classList.add('correct');
        }
        
        // Deduct points for using hint
        const pointsDeducted = Math.max(10, Math.floor(gameData.level * 0.5));
        gameData.score = Math.max(0, gameData.score - pointsDeducted);
        elements.scoreDisplay.textContent = gameData.score;
        
        showNotification(`Hint used! -${pointsDeducted} points`);
        
        // Check if player has won after the hint
        if (checkWin()) {
            handleWin();
        }
    } else {
        showNotification("No hints available!");
    }
}

// Skip the current word
function skipWord() {
    // Deduct points for skipping
    const pointsDeducted = Math.max(20, Math.floor(gameData.level));
    gameData.score = Math.max(0, gameData.score - pointsDeducted);
    elements.scoreDisplay.textContent = gameData.score;
    
    showNotification(`Word skipped! -${pointsDeducted} points`);
    
    // Move to next level after a delay
    setTimeout(() => {
        if (gameData.gameMode === 'multi') {
            nextPlayerTurn();
        } else {
            nextLevel();
        }
    }, 1000);
}

// Pause the game
function pauseGame() {
    elements.pauseMenu.classList.remove('hidden');
}

// Resume the game
function resumeGame() {
    elements.pauseMenu.classList.add('hidden');
}

// Restart the current level
function restartGame() {
    elements.pauseMenu.classList.add('hidden');
    startGame();
}

// Play again after game over
function playAgain() {
    elements.gameOverScreen.classList.add('hidden');
    
    // Reset score if starting over
    if (gameData.gameMode === 'single') {
        gameData.score = 0;
        gameData.level = 1;
        elements.levelSlider.value = 1;
        updateLevelDisplay();
    }
    
    startGame();
}

// Show main menu
function showMainMenu() {
    // Hide all game screens
    elements.gameOverScreen.classList.add('hidden');
    elements.pauseMenu.classList.add('hidden');
    elements.gameContainer.classList.add('hidden');
    elements.multiplayerTurnScreen.classList.add('hidden');
    
    // Show setup panel
    elements.gameSetupPanel.classList.remove('hidden');
    
    // Reset to single player mode
    document.querySelector('.mode-btn[data-mode="single"]').click();
}

// Show notification message
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Animate out and remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Show confetti animation
function showConfetti() {
    // Clear previous confetti
    elements.animationContainer.innerHTML = '';
    
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}, 100%, 50%);
            top: 0;
            left: ${Math.random() * 100}%;
            animation: confetti ${1 + Math.random() * 2}s ease-out forwards;
        `;
        
        elements.animationContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        elements.animationContainer.innerHTML = '';
    }, 3000);
}

// Add confetti animation to style
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes confetti {
            0% { transform: translateY(0) rotate(0); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
    </style>
`);

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);