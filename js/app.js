/*
 * Create a list that holds all of your cards
 */
var cards = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb"
]
var deck = document.querySelector(".deck");
var moveCounterSpan = document.querySelector(".moves");
var moveCount = 0;
var pairCount = 0;
var openCards = [];

// shuffle the list of cards using the provided "shuffle" method below
shuffle(cards);
// loop through each card and create its HTML add each card's HTML to the page
for (const card of cards) {

    const li = document.createElement("li");
    const icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add(card);
    li.classList.add("card");
    li.appendChild(icon);
    deck.appendChild(li);

}



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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener("click", function(e) {

    const selection = e.target;

    if (selection.classList.contains("card")) {

        displaySymbol(selection);

        // check if cards match
        if (openCards.length > 1) {
            moveCounter();
            if (openCards[0].value === openCards[1].value) {
                isMatch();
                if (pairCount === 2) {
                    pairCounter();
                    restartGame();
                }
            } else {
                noMatch();
            }
        }
    
    }

    // show card function
    function displaySymbol(arg) {
        arg.classList.add("open", "show");
        addCard(arg);
    };
    
    // add card to 'openCards' function
    function addCard(arg) {
        let icon = arg.firstElementChild.classList;
        return openCards.push(icon);
    };

    // cards match
    function isMatch() {
        for (const card of deck.children) {
            if (card.classList.contains("open")) {
                card.classList.add("match");
                card.classList.remove("open", "show");
            }
        }
        openCards = [];
        pairCount += 1;
    }

    // cards dont match
    function noMatch() {
        setTimeout(function () {
            for (const card of deck.children) {
                card.classList.remove("open", "show");
            }
            openCards = [];
        }, 1000);
    }

    // count player's moves
    function moveCounter() {
        moveCount += 1;
        moveCounterSpan.innerHTML = moveCount;
    }

    function pairCounter() {
        setTimeout(function () {
            var successContainer = document.querySelector(".success-container");
            var successCount = document.querySelector(".success-count");
            successCount.innerHTML = moveCount;
            successContainer.style.display = "flex";
        },300);
    }

    function restartGame() {
        var restartButton = document.querySelector(".restart-button");
        restartButton.addEventListener("click", function (){
            var successContainer = document.querySelector(".success-container");
            successContainer.style.display = "none";
            // zero counter
            moveCounterSpan.innerHTML = 0;
            // clear all cards
            for (let i = 0; i < deck.children.length; i++) {
                deck.children[i].classList.remove("match");
            }
        });
    }

});
