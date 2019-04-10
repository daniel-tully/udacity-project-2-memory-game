/**
 * module - queries
 */
const query = (() => {
    const deck = document.querySelector('.deck');
    const restartIcon = document.querySelector('.restart');
    const timerSpan = document.querySelector('.timer-time');
    const stars = document.querySelector('.score-panel').children;
    const getCard = document.querySelector('.card');

    return {
        deck: deck,
        restartIcon: restartIcon,
        timerSpan: timerSpan,
        stars: stars,
        getCard: getCard
    };
})();

/**
 * module - values
 */
const nums = (() => {
    let moveCount = 0;
    let pairCount = 0;
    let starCount = 0;
    let seconds = 0;
    let minutes = 0;
    let zeroSec;
    let zeroMin;
    let timerObj;
    
    return {
        moveCount: moveCount,
        pairCount: pairCount,
        starCount: starCount,
        seconds: seconds,
        minutes: minutes,
        zeroSec: zeroSec,
        zeroMin: zeroMin,
        timerObj: timerObj,
    };
})();

/**
 * module - arrays
 */
const arr = (() => {
    let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    let openCards = [];

    return {
        cards: cards,
        openCards: openCards,
    };
})();

/**
 * start game
 */
document.addEventListener('DOMContentLoaded', () => {

    shuffle(arr.cards);

    for (let card of arr.cards) {
        const cardDiv = document.createElement('DIV');
        
        cardDiv.className = 'card';
        cardDiv.innerHTML = '<div class="card-internal">' +
            '<div class="card-front flex align justify-center"><i class="fa fa-question-circle"></i></div>' +
            '<div class="card-back flex align justify-center"><i class="fa ' + card + '"></i></div>' +
            '</div>'
        query.deck.appendChild(cardDiv);
    }
    boxSize();
    startTimer();
});

/**
 * set height of cards / margin-bottom based on window
 */
function boxSize() {
    let deckW = query.deck.clientWidth;
    let cardW = query.deck.children[0].clientWidth;
    for (let card of query.deck.children) {
        card.style.height = card.clientWidth + 'px';
        card.style.marginBottom = ((deckW - (cardW * 4)) / 3) + 'px';
    }
}
window.addEventListener('resize', () => {
    boxSize();
});

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
query.deck.addEventListener('click', (e) => {

    if (arr.openCards.length < 2) {

        // check if same card is clicked twice
        if (e.target.classList.contains('show')) {
            return;
        } else {

            // get card based on e.target
            if (e.target.classList.contains('card-front') || e.target.classList.contains('fa-question-circle')) {
                let whichCard = climbDOM(e.target);
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
                if (arr.openCards.length > 1) {
                    moveCounter();
                    starRating();
                    if (arr.openCards[0].classList.value === arr.openCards[1].classList.value) {
                        isMatch();
                        if (nums.pairCount === 1) {
                            completed();
                            successModal();
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
    nums.timerObj = setInterval(timer, 1000);
}
/**
 * timer action
 */
function timer() {
    (nums.seconds < 9) ? nums.zeroSec = 0 : nums.zeroSec = '';
    if (nums.seconds < 59) {
        nums.seconds += 1;
    } else {
        nums.minutes += 1;
        nums.seconds = 0;
        nums.zeroSec = 0;
    }
    (nums.minutes <= 9) ? nums.zeroMin = 0 : nums.zeroMin = '';
    query.timerSpan.textContent = `${nums.zeroMin}${nums.minutes}:${nums.zeroSec}${nums.seconds}`;
}

/**
 * restart during game
 */
query.restartIcon.addEventListener('click', () => {
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
    return arr.openCards.push(cardBack.firstElementChild);
}

/**
 * cards match
 */
function isMatch() {
    for (let card of query.deck.children) {
        if (card.classList.contains('open')) {
            setTimeout(() => {
                card.firstElementChild.children[1].classList.add('match');
                card.className += ' enlarge';
            }, 800);
        }
    }
    arr.openCards = [];
    nums.pairCount += 1;
}

/**
 * cards dont match - remove from openCards array
 */
function noMatch() {
    setTimeout(() => {
        for (let card of query.deck.children) {
            let cardInternal = card.firstElementChild;
            if (cardInternal.children[1].classList.contains('match')) {
                continue;
            } else {
                card.classList.remove('open');
                cardInternal.classList.remove('flip-it');
                cardInternal.children[1].classList.remove('flip-it');
            }
        }
        arr.openCards = [];
    }, 1000);
}

// count player's moves
function moveCounter() {
    const moveCounterSpan = document.querySelector('.moves');
    nums.moveCount += 1;
    moveCounterSpan.innerHTML = nums.moveCount;
}

// star rating
function starRating() {
    if (nums.moveCount > 2) {
        query.stars[2].firstElementChild.classList.replace('star-lit', 'star-out');
    }
    if (nums.moveCount > 20) {
        query.stars[1].firstElementChild.classList.replace('star-lit', 'star-out');
    }
}

/**
 * game is completed
 */
function completed() {
    const successUl = document.getElementById('success-stars');

    // clear timer
    clearInterval(nums.timerObj);

    // load stars rating into success modal
    successUl.innerHTML = query.stars[0].parentNode.innerHTML;

    // load time into success modal
    setTimeout( () => {
        const successContainer = document.querySelector('.success-container');
        const successCount = document.querySelector('.success-count');
        const timeAmount = document.querySelector('.time-amount');

        timeAmount.innerHTML = query.timerSpan.innerHTML;
        successCount.innerHTML = nums.moveCount;
        successContainer.classList.replace('modal-closed', 'modal-open');
        successContainer.className += ' enlarge';
    },1500);

}

/**
 * success modal
 */
function successModal() {
    const restartButton = document.querySelector('.restart-btn');

    restartButton.addEventListener('click', () => {
        const successContainer = document.querySelector('.success-container');
        successContainer.classList.replace('modal-open', 'modal-closed');
        restartGame();
    });
}

/**
 * restart game
 */
function restartGame() {
    const moveCounterSpan = document.querySelector('.moves');
    const eachCard = query.deck.children;

    moveCounterSpan.innerHTML = 0;

    // un-flip cards
    for (let card of eachCard) {
            card.classList.remove('flip-it', 'open', 'enlarge');
            card.firstElementChild.classList.remove('flip-it');
            card.firstElementChild.children[1].classList.remove('match');
    }

    shuffle(arr.cards);

    // reload the deck
    setTimeout(() => {
        for (let j = 0; j < eachCard.length; j++) {
            eachCard[j].firstElementChild.children[1].firstElementChild.className = `fa ${arr.cards[j]}`;
        }
    }, 800);

    // reload the stars
    for (star of query.stars) {
        if (star.firstElementChild.classList.contains('star-lit')) {
            continue;
        }
        else {
            star.firstElementChild.classList.add('star-lit');
        }
    }

    // reset values
    nums.moveCount = 0;
    nums.pairCount = 0;
    nums.starCount = 0;
    arr.openCards = [];

    // clear timer
    clearInterval(nums.timerObj);
    query.timerSpan.textContent = '00:00';
    nums.seconds = 0;
    nums.minutes = 0;

    // start timer
    startTimer();
}
