/**
 * objects
 */
const startButton = document.getElementById('start-button');
const deck = document.querySelector('.deck');
const restartIcon = document.querySelector('.restart');
const timerSpan = document.querySelector('.timer-time');
const stars = document.querySelector('.score-panel').children;
const getCard = document.querySelector('.card');
const scoreBoard = document.querySelector('.scores');

let player;
let moveCount = 0;
let pairCount = 0;
let starCount = 0;
let seconds = 0;
let minutes = 0;
let zeroSec;
let zeroMin;
let timerObj;
let scores;

let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let openCards = [];
cards = cards.concat(cards);

/**
 * update scoreboard
 */
function updateScoreboard() {
    scores = JSON.parse(localStorage.getItem('scores'));
    scoreBoard.innerHTML = '';

    for(score of scores) {
        let scoreTemplate = '<li class="col-3">'+score.name+'</li><li class="col-3">'+score.moves+'</li><li class="col-3">'+score.time+'</li><li class="col-3">'+score.stars+'</li>';
        scoreBoard.innerHTML = scoreTemplate;
    }
}

startButton.addEventListener('click', (e)=>{
    e.preventDefault();
    startGame();
});

/**
 * set name for game
 */
function setName() {
    const initialsInputs = document.getElementById('enter-name').children;
    let playerInitials = '';

    for(initial of initialsInputs) {
        playerInitials += initial.value;
    }

    player = playerInitials + '';

    // gsap animation here...
    document.querySelector('.modal-container').classList.replace('d-flex', 'd-none');
    document.querySelector('#name-modal').classList.add('d-none');
}

/**
 * get scores
 */
function getScores() {
    /**
     * check storage available
     */
    function storageAvailable(type) {
        var storage;
        try {
            storage = window[type];
            var x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }
    if(storageAvailable('localStorage')) {
        // if scores dont exist add empty array
        if(localStorage.getItem('scores') === null) {
            let scores = [];
            localStorage.setItem('scores', JSON.stringify(scores));
            console.log('empty');
        }
        // else get stored scores
        else {
            return 
        }
    } else {
        return;
    }
}

/**
 * start game
 */
function startGame() {
    setName();
    getScores();
    shuffle(cards);

    for (let card of cards) {
        const cardDiv = document.createElement('DIV');

        cardDiv.className = 'card';
        cardDiv.innerHTML = '<div class="card-internal">' +
            '<div class="card-front flex align justify-center"><i class="fa fa-question-circle"></i></div>' +
            '<div class="card-back flex align justify-center"><i class="fa ' + card + '"></i></div>' +
            '</div>'
        deck.appendChild(cardDiv);
    }

    boxSize();
    window.addEventListener('resize', () => { boxSize();});
    startTimer();
};

/**
 * set height of cards / margin-bottom based on window
 */
function boxSize() {
    let deckW = deck.clientWidth;
    let cardW = deck.children[0].clientWidth;
    for (let card of deck.children) {
        card.style.height = card.clientWidth + 'px';
        card.style.marginBottom = ((deckW - (cardW * 4)) / 3) + 'px';
    }
}

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} array is the cards
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * capture click event on any card in deck
 */
deck.addEventListener('click', (e) => {

    if (openCards.length < 2) {

        // check if same card is clicked twice
        if (e.target.classList.contains('show')) {
            return;
        } else {

            // get card based on e.target
            if (e.target.classList.contains('card-front') || e.target.classList.contains('fa-question-circle')) {
                let whichCard = climbDOM(e.target);

                // accept click from icon or card
                function climbDOM (el) {
                    for ( ; !el.classList.contains('card-internal'); el = el.parentNode ) {
                        if (el.classList.contains('card-front')) {
                            return el;
                        }
                    }
                    return null;
                }

                showCard(whichCard);

                // check if cards match
                if (openCards.length > 1) {
                    moveCounter();
                    starRating();
                    if (openCards[0].classList.value === openCards[1].classList.value) {
                        isMatch();
                        if (pairCount === 1) {
                            completed();
                        }
                    } else {
                        noMatch();
                    }
                }

            }

        }
    }
});

/**
 * add timer interval
 */
function startTimer() {
    timerObj = setInterval(timer, 1000);
}

/**
 * timer action
 */
function timer() {
    (seconds < 9) ? zeroSec = 0 : zeroSec = '';
    if (seconds < 59) {
        seconds += 1;
    } else {
        minutes += 1;
        seconds = 0;
        zeroSec = 0;
    }
    (minutes <= 9) ? zeroMin = 0 : zeroMin = '';
    timerSpan.textContent = `${zeroMin}${minutes}:${zeroSec}${seconds}`;
}

/**
 * restart during game
 */
restartIcon.addEventListener('click', () => {
    restartGame();
});

/**
 * show selected card
 * @param {node} selection is the target clicked
 */
function showCard(selection) {
    let cardParent = selection.parentNode;
    let cardGParent = cardParent.parentNode;

    cardGParent.className += ' open';
    cardParent.className += ' flip-it';
    addCard(cardParent.children[1]);
}

/**
 * add card to openCards
 * @param {node} cardBack is the target clicked
 */
function addCard(cardBack) {
    return openCards.push(cardBack.firstElementChild);
}

/**
 * cards match
 */
function isMatch() {
    for (let card of deck.children) {
        if (card.classList.contains('open')) {
            setTimeout(() => {
                card.firstElementChild.children[1].classList.add('match');
                card.className += ' enlarge';
            }, 800);
        }
    }
    openCards = [];
    pairCount += 1;
}

/**
 * cards dont match - remove from openCards array
 */
function noMatch() {
    setTimeout(() => {
        for (let card of deck.children) {
            let cardInternal = card.firstElementChild;
            if (cardInternal.children[1].classList.contains('match')) {
                continue;
            } else {
                card.classList.remove('open');
                cardInternal.classList.remove('flip-it');
                cardInternal.children[1].classList.remove('flip-it');
            }
        }
        openCards = [];
    }, 1000);
}

// count player's moves
function moveCounter() {
    const moveCounterSpan = document.querySelector('.moves');

    moveCount += 1;
    moveCounterSpan.innerHTML = moveCount;
}

// star rating
function starRating() {
    if (moveCount > 12) {
        stars[2].firstElementChild.classList.replace('star-lit', 'star-out');
    }
    if (moveCount > 20) {
        stars[1].firstElementChild.classList.replace('star-lit', 'star-out');
    }
}

/**
 * game is completed
 */
function completed() {
    const successUl = document.getElementById('success-stars');

    // clear timer
    clearInterval(timerObj);

    // load stars rating into success modal
    successUl.innerHTML = stars[0].parentNode.innerHTML;

    // load time into success modal
    setTimeout( () => {
        const successContainer = document.querySelector('.modal-container');
        const successCount = document.querySelector('.success-count');
        const timeAmount = document.querySelector('.time-amount');

        timeAmount.innerHTML = timerSpan.innerHTML;
        successCount.innerHTML = moveCount;
        successContainer.classList.replace('d-none', 'd-flex');
        // gsap animate modal here ---->
        successContainer.querySelector('#success-modal').classList.replace('d-none', 'd-flex');
    },1500);

}

/**
 * success modal
 */
function successModal() {
    const restartButton = document.querySelector('.restart-btn');

    restartButton.addEventListener('click', () => {
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.classList.replace('d-none', 'd-flex');
        restartGame();
    });
}

/**
 * restart game
 */
function restartGame() {
    const moveCounterSpan = document.querySelector('.moves');
    const eachCard = deck.children;
    const successContainer = document.querySelector('.modal-container');

    successContainer.classList.replace('d-flex', 'd-none');

    moveCounterSpan.innerHTML = 0;

    // un-flip cards
    for (let card of eachCard) {
            card.classList.remove('flip-it', 'open', 'enlarge');
            card.firstElementChild.classList.remove('flip-it');
            card.firstElementChild.children[1].classList.remove('match');
    }

    shuffle(cards);

    // reload the deck
    setTimeout(() => {
        for (let j = 0; j < eachCard.length; j++) {
            eachCard[j].firstElementChild.children[1].firstElementChild.className = `fa ${cards[j]}`;
        }
    }, 800);

    // reload the stars
    for (star of stars) {
        if (star.firstElementChild.classList.contains('star-lit')) {
            continue;
        }
        else {
            star.firstElementChild.classList.replace('star-out', 'star-lit');
        }
    }

    // add score to score board
    addScore();

    // reset values
    moveCount = 0;
    pairCount = 0;
    starCount = 0;
    openCards = [];

    // clear timer
    clearInterval(timerObj);
    timerSpan.textContent = '00:00';
    seconds = 0;
    minutes = 0;

    // start timer
    startTimer();
}

/**
 * add score
 */
function addScore() {
    let scores = localStorage.getItem('scores');

    const stars = document.getElementById('success-stars').children;
    console.log(stars);
    let starCounting = 0;
    for(star of stars) {
        if(star.firstElementChild.classList.contains('star-lit')) {
            starCounting += 1;
        }
    }    

    const scoreObj = {
        name: player,
        moves: moveCount,
        stars: starCounting,
        time: timerSpan.textContent
    }

    scores = JSON.parse(scores);
    scores.push(scoreObj);
    scores = JSON.stringify(scores);
    localStorage.setItem('scores', scores);
    updateScoreboard();
}