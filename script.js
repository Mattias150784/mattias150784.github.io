const genPokemon = {
    gen1: [
        'bulbasaur', 'charmander', 'squirtle', 'pikachu',
        'jigglypuff', 'meowth', 'psyduck', 'snorlax'
    ],
    gen2: [
        'chikorita', 'cyndaquil', 'totodile', 'togepi',
        'mareep', 'sudowoodo', 'espeon', 'umbreon'
    ],
    gen3: [
        'treecko', 'torchic', 'mudkip', 'ralts',
        'sableye', 'aron', 'swablu', 'absol'
    ],
    all: [
        // Combine all generations here
        ...[
            'bulbasaur', 'charmander', 'squirtle', 'pikachu',
            'jigglypuff', 'meowth', 'psyduck', 'snorlax',
            'chikorita', 'cyndaquil', 'totodile', 'togepi',
            'mareep', 'sudowoodo', 'espeon', 'umbreon',
            'treecko', 'torchic', 'mudkip', 'ralts',
            'sableye', 'aron', 'swablu', 'absol'
        ]
    ]
};

// Get the selected generation from the URL
const params = new URLSearchParams(window.location.search);
const selectedGeneration = params.get('generation');

// Validate the selected generation
if (!genPokemon[selectedGeneration]) {
    alert('Invalid game mode selected!');
    window.history.back();
}

// Set up the Pokémon based on the selected generation
let pokemonArray = genPokemon[selectedGeneration];
if (selectedGeneration === 'all') {
    pokemonArray = Object.values(genPokemon).flat();
}

// Ensure there are enough Pokémon for a 4x4 grid (8 pairs)
if (pokemonArray.length < 8) {
    alert('Not enough Pokémon to generate a 4x4 grid!');
    window.history.back();
}

// Select 8 Pokémon randomly for the game
pokemonArray = pokemonArray.sort(() => 0.5 - Math.random()).slice(0, 8);

// Duplicate and shuffle the cards
let gameCards = [...pokemonArray, ...pokemonArray];
gameCards = gameCards.sort(() => 0.5 - Math.random());

const grid = document.getElementById('game-grid-' + selectedGeneration);
const stepCounter = document.querySelector('.step-counter');
const resultDisplay = document.getElementById('result');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let steps = 0;

// Function to update step counter
function updateStepCounter() {
    stepCounter.textContent = `Steps: ${steps}`;
}

// Function to create the grid
function createGrid() {
    gameCards.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-pokemon', pokemon);

        const img = document.createElement('img');
        img.src = `img/pokemon/${pokemon}.png`;
        img.alt = pokemon;

        card.appendChild(img);
        grid.appendChild(card);

        card.addEventListener('click', flipCard);
    });
}

// Function to handle card flipping
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    steps++;
    updateStepCounter();
    checkForMatch();
}

// Function to check for a match
function checkForMatch() {
    const isMatch = firstCard.dataset.pokemon === secondCard.dataset.pokemon;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Function to disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matchesFound++;

    if (matchesFound === gameCards.length / 2) {
        resultDisplay.textContent = "Congratulations, you won!";
    }
}

// Function to unflip cards if not matched
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Function to reset the board
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Function to set background and music
function initializeGame() {
    applyBackground();
    setMusic();
    createGrid();
    updateStepCounter();
}

// Function to set the music based on generation
function setMusic() {
    const music = document.getElementById(selectedGeneration + '-audio');
    if (music) {
        music.play();
    }
}

// Function to apply background based on generation
function applyBackground() {
    document.body.classList.add(selectedGeneration);
}

// Initialize the game on window load
window.onload = initializeGame;
