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
      gen4: [
            'turtwig', 'chimchar', 'piplup', 'lucario',
            'garchomp', 'glaceon', 'electivire', 'togekiss'
        ],
          gen5: [
                'snivy', 'tepig', 'oshawott', 'zoroark',
                'excadrill', 'chandelure', 'haxorus', 'hydreigon'
            ],
              gen6: [
                    'chespin', 'fennekin', 'froakie', 'talonflame',
                    'aegislash', 'goodra', 'greninja', 'sylveon'
                ],
                   gen7: [
                            'rowlet', 'litten', 'popplio', 'incineroar',
                            'decidueye', 'lycanroc', 'tapukoko', 'mimikyu'
                        ],
                          gen8: [
                                'grookey', 'scorbunny', 'sobble', 'corviknight',
                                'toxtricity', 'dragapult', 'zacian', 'zamazenta'
                            ],
                              gen9: [
                                    'sprigatito', 'fuecoco', 'quaxly', 'miraidon',
                                    'koraidon', 'tinkaton', 'baxcalibur', 'palafin'
                                ],
    all: [

        ...[
            'bulbasaur', 'charmander', 'squirtle', 'pikachu',
            'jigglypuff', 'meowth', 'psyduck', 'snorlax',

            'chikorita', 'cyndaquil', 'totodile', 'togepi',
            'mareep', 'sudowoodo', 'espeon', 'umbreon',

            'treecko', 'torchic', 'mudkip', 'ralts',
            'sableye', 'aron', 'swablu', 'absol',

            'turtwig', 'chimchar', 'piplup', 'lucario',
            'garchomp', 'glaceon', 'electivire', 'togekiss',

            'snivy', 'tepig', 'oshawott', 'zoroark',
            'excadrill', 'chandelure', 'haxorus', 'hydreigon',

            'chespin', 'fennekin', 'froakie', 'talonflame',
            'aegislash', 'goodra', 'greninja', 'sylveon',

            'rowlet', 'litten', 'popplio', 'incineroar',
            'decidueye', 'lycanroc', 'tapukoko', 'mimikyu',

            'grookey', 'scorbunny', 'sobble', 'corviknight',
            'toxtricity', 'dragapult', 'zacian', 'zamazenta',

            'sprigatito', 'fuecoco', 'quaxly', 'miraidon',
            'koraidon', 'tinkaton', 'baxcalibur', 'palafin'
            // Combine All Here
        ]
    ]
};


const params = new URLSearchParams(window.location.search);
const selectedGeneration = params.get('generation');


if (!genPokemon[selectedGeneration]) {
    alert('Invalid game mode selected!');
    window.history.back();
}


let pokemonArray = genPokemon[selectedGeneration];
if (selectedGeneration === 'all') {
    pokemonArray = Object.values(genPokemon).flat();
}


if (pokemonArray.length < 8) {
    alert('Not enough Pokémon to generate a 4x4 grid!');
    window.history.back();
}


pokemonArray = pokemonArray.sort(() => 0.5 - Math.random()).slice(0, 8);


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


function updateStepCounter() {
    stepCounter.textContent = `Steps: ${steps}`;
}


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


function checkForMatch() {
    const isMatch = firstCard.dataset.pokemon === secondCard.dataset.pokemon;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}


function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matchesFound++;

    if (matchesFound === gameCards.length / 2) {
        resultDisplay.textContent = "Congratulations, you won!";
    }
}


function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}


function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}


function initializeGame() {
    applyBackground();
    setMusic();
    createGrid();
    updateStepCounter();
}


function setMusic() {
    const music = document.getElementById(selectedGeneration + '-audio');
    if (music) {
        music.play();
    }
}


function applyBackground() {
    document.body.classList.add(selectedGeneration);
}


window.onload = initializeGame;
