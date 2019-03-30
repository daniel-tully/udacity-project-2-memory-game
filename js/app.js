/**
 * cards
 */
var cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

/**
 * global variables
 */
const deck = document.querySelector('.deck');
const moveCounterSpan = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');
const timerSpan = document.querySelector('.timer-time');
const stars = document.querySelector('.score-panel').children;
let moveCount = 0;
let pairCount = 0;
let starCount = 0;
let openCards = [];
// timer variables
let seconds = 0;
let minutes = 0;
let zeroSec;
let zeroMin;
let timerObj;

/**
 * start game
 */
window.onload = function() {
    shuffle(cards);
    for (let card of cards) {
        var li = document.createElement('li');
        var icon = document.createElement('i');
        icon.classList.add('fa'); // add 'fa-question-circle'
        icon.classList.add(card);
        li.classList.add('card', 'flex', 'align', 'justify-center');
        li.appendChild(icon);
        deck.appendChild(li);
    }
    startTimer();
};

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
deck.addEventListener('click', function(e) {
    if (openCards.length < 2) {
        const selection = e.target;

        // check if same card is clicked twice
        if (selection.classList.contains('show')) {
            return;
        } else {

            // check if target is card li
            if (selection.nodeName === 'LI') {
                showCard(selection);
                addCard(selection);
    
                // check if cards match
                if (openCards.length > 1) {
                    moveCounter();
                    starRating();
                    if (openCards[0].classList.value === openCards[1].classList.value) {
                        isMatch();
                        if (pairCount === 8) {
                            completed();
                            successContainer();
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
restartButton.addEventListener('click', () => {
    restartGame();
});

/**
 * show selected card
 * @param {node} selection is the target clicked
 */
function showCard(selection) {
    selection.classList.add('open', 'show');
}

/**
 * add card to openCards
 * @param {node} selection is the target clicked
 */
function addCard(selection) {
    return openCards.push(selection.firstElementChild);
}

/**
 * cards match
 */
function isMatch() {
    for (let card of deck.children) {
        if (card.classList.contains('open')) {
            card.classList.add('match', 'enlarge');
            card.classList.remove('open', 'show');
        }
    }
    openCards = [];
    pairCount += 1;
}

/**
 * cards dont match
 */
function noMatch() {
    // timing to allow openCards comparison
    setTimeout(function(){
        for (let card of deck.children) {
            card.classList.remove('open', 'show');
        }
        openCards = [];
    }, 1000);
}

// count player's moves
function moveCounter() {
    moveCount += 1;
    moveCounterSpan.innerHTML = moveCount;
}

// star rating
function starRating() {
    if (moveCount > 10) {
        stars[2].firstElementChild.classList.remove('star-lit');
    }
    if (moveCount > 15) {
        stars[1].firstElementChild.classList.remove('star-lit');
    }
    if (moveCount > 20) {
        stars[0].firstElementChild.classList.remove('star-lit');
    }
}

/**
 * game is completed
 */
function completed() {
    const successUl = document.getElementById('success-stars');

    // clear timer
    clearInterval(timerObj);
    timerSpan.textContent = '00:00';

    successUl.innerHTML = stars[0].parentNode.innerHTML;

    setTimeout( () => {
        var successContainer = document.querySelector('.success-container');
        var successCount = document.querySelector('.success-count');
        successCount.innerHTML = moveCount;
        successContainer.style.display = 'flex';
    },1000);
}

// success container
function successContainer() {
    var restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', () => {
        var successContainer = document.querySelector('.success-container');
        successContainer.style.display = 'none';
        restartGame();
    });
}

// restart game
function restartGame() {
    var eachCard = deck.querySelectorAll('.card');
    
    moveCounterSpan.innerHTML = 0;
    shuffle(cards);

    // reload the deck
    for (let i = 0; i < eachCard.length; i++) {
        eachCard[i].classList.remove('match', 'show', 'open', 'enlarge');
        eachCard[i].firstElementChild.classList = 'fa ' + cards[i];
    }

    // reload the stars
    for (star of stars) {
        if (star.firstElementChild.classList.contains('star-lit')) {
            continue;
        }
        else {
            star.firstElementChild.classList.add('star-lit');
        }
    }

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
