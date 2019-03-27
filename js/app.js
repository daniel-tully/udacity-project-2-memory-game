// cards
var cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];

// global variables
const deck = document.querySelector('.deck');
const moveCounterSpan = document.querySelector('.moves');
const restartButton = document.querySelector('.restart');
const timerSpan = document.querySelector('.timerTime');
const stars = document.querySelector('.score-panel').firstElementChild;
let moveCount = 0;
let pairCount = 0;
let starCount = 0;
let openCards = [];

// start game
window.onload = function() {
    shuffle(cards);
    for (let card of cards) {
        var li = document.createElement('li');
        var icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add(card);
        li.classList.add('card');
        li.appendChild(icon);
        deck.appendChild(li);
    }
};

// Shuffle function from http://stackoverflow.com/a/2450976
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
 * timer
 */


/** 
 * capture click event on any card in deck
*/
deck.addEventListener('click', function(e) {
    if (openCards.length < 2) {
        const selection = e.target;

        if (selection.classList.contains('card')) {
            showCard(selection);
            addCard(selection);

            // check if cards match
            if (openCards.length > 1) {
                moveCounter();
                starRating();
                if (openCards[0].value === openCards[1].value) {
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

});

// restart during game
restartButton.addEventListener('click', function() {
    if(moveCount >= 1 || openCards.length >= 1) {
        restartGame();
    }
});

// show selected card
function showCard(param) {
    param.classList.add('open', 'show');
}

// add card to openCards
function addCard(param) {
    const icon = param.firstElementChild.classList;
    return openCards.push(icon);
}

// cards match
function isMatch() {
    for (let card of deck.children) {
        if (card.classList.contains('open')) {
            card.classList.add('match');
            card.classList.remove('open', 'show');
        }
    }
    openCards = [];
    pairCount += 1;
}

// cards dont match
function noMatch() {
    setTimeout(function () {
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
        stars.children[2].firstElementChild.classList.remove('star-lit');
    } else if (moveCount > 15) {
        stars.children[1].firstElementChild.classList.remove('star-lit');
    } else if (moveCount > 20) {
        stars.children[0].firstElementChild.classList.remove('star-lit');
    }
}

// game is completed
function completed() {
    const successUl = document.getElementById('success-stars');

    successUl.innerHTML = stars.innerHTML;

    setTimeout(function () {
        var successContainer = document.querySelector('.success-container');
        var successCount = document.querySelector('.success-count');
        successCount.innerHTML = moveCount;
        successContainer.style.display = 'flex';
    },300);
}

// success container
function successContainer() {
    var restartButton = document.querySelector('.restart-button');
    restartButton.addEventListener('click', function (){
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
        eachCard[i].classList.remove('match', 'show', 'open');
        eachCard[i].firstElementChild.classList = 'fa ' + cards[i];
    }

    // reload the stars
    for (star of stars.children) {
        if (star.firstElementChild.classList.contains('star-lit')) {
            continue;
        }
        else {
            star.firstElementChild.classList.add('star-lit');
        }
    }

    moveCount = 0;
    pairCount = 0;
    starCount = 0;
    openCards = [];
}
