/*
NOTES
    - Description:
        Classic Blackjack game with options for "betting".
    - Timeline:
        Started on 2022 Apr 15 11:00. Finished v1 on 21:45, after 5~7 hours of coding.
        Code is very much not clean and may also contain bugs, but the game works.
        Hope to clean the code and add more features later.
*/

//Show player's cash.
//Animate card dealing.

//Document Objects
const welcomePg = document.querySelector('.welcomePage');
const gamePg = document.querySelector('.gamePage');
const resultPage = document.querySelector('.result');
const betAmt = document.querySelector('#betBar');
const betContainer = document.querySelector('.betContainer');
const betValue = document.querySelector('#betValue');
const rangeInput = document.querySelector('#rangeInput');
const pot = document.querySelector('#pot');
const header = document.querySelector('.headerAboveCards');
const btns = document.querySelectorAll('.btn');
const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');

const cashTxt = document.querySelector('#cashText');

let cP1 = document.querySelector('#player1');
let cP2 = document.querySelector('#player2');
let cP3 = document.querySelector('#player3');
let cP4 = document.querySelector('#player4');
let cP5 = document.querySelector('#player5');
const pCardsDisplay = [cP1, cP2, cP3, cP4, cP5];

let cC1 = document.querySelector('#comp1');
let cC2 = document.querySelector('#comp2');
let cC3 = document.querySelector('#comp3');
let cC4 = document.querySelector('#comp4');
let cC5 = document.querySelector('#comp5');
const cCardsDisplay = [cC1, cC2, cC3, cC4, cC5];

const cComp = document.querySelector('.compCards');
const cPlayer = document.querySelector('.playerCards');

//Bet & Values
let bet = 0;
let cash = 100;

//Deck Arrays
let deckT = ['spades', 'hearts', 'diamonds', 'clubs'];
let deck = [];
let pCards = [];
let cCards = [];

//cardNumbers and values;
let pCCount = 0;
let cCCount = 0;
let playerValue = 0;
let compValue = 0;

let threeCardFlag;
//Populating the deck
let dIndex=0;
function cardBuilder(){
    for(let i=1; i<14; i++){
        for(let j=0; j<4; j++){
            cardPopulator(i,j);
        }
    }
}
function cardPopulator(number, type){
    deck[dIndex] = {
        cNumber: number,
        cType: deckT[type],
        cImg: `deck/${number}_of_${deckT[type]}.png`
    };
    dIndex++;
}


//Resets
//In development
// function reset(){
//     resultPage.style.display='none';
//     gamePg.style.display = 'block';
//     deck = [];
//     pCards = [];
//     cCards = [];
//     bet = 0;
//     //cardNumbers and values;
//     pCCount = 0;
//     cCCount = 0;
//     playerValue = 0;
//     compValue = 0;
//     dIndex=0;
//     cardBuilder();
// }

//Starts the game
function start(){
    welcomePg.style.display = 'none';
    gamePg.style.display = 'block';
    cardBuilder();
    // rangeInput.innerHTML = `<input type="range" id="betBar" min="1" max = "${cash}" onchange="showVal(this.val)"/>`;
    // betValue.innerHTML = betAmt.value;
    //test code
}

function showVal(val){
    betValue.innerHTML = betAmt.value;
}

function confirmBet(){
    bet = betAmt.value;
    cash-=bet;
    betContainer.style.display='none';
    pot.textContent = bet*2;
    cashTxt.textContent = cash;
    dealCards();
}

function dealCards(){
    // Header part
    header.innerHTML = "<h2> GET READY ... </h2>";
    setTimeout(()=>{
        header.style.display = 'none';
    },2000);

    //Dealing cards (initial)
    dealAndShow('player', pCCount,1);
    dealAndShow('comp', cCCount,1);
    dealAndShow('player', pCCount,1);
    dealAndShow('comp',cCCount,1);

    //Displaying Buttons. (StandBtn will display only when playerValue>14)
    setTimeout(()=>{btns.forEach((element) => {element.style.display='block';});}, 5000); //Displaying buttons.
    setTimeout(()=>{if(checkValue(pCards)<15){btns[1].style.display='none';}},5000);
    //test
}

//Hit and Stand Buttons:
function hit(){
    dealAndShow('player',pCCount,0);
    if(pCCount === 5){
        hitBtn.style = 'disable';
    }
    if(checkValue(pCards)>14 || pCCount === 5){
        standBtn.style.display='block';
    }
}
function stand(){
    //Comp will stand when it's (15,16,17) or more.
    let compChoice = Math.floor(Math.random()*3)+15;
    while(checkValue(cCards)<compChoice && cCCount !== 5){
        dealAndShow('comp',cCCount,0);
    }
    //Showing Comp's Cards:
    let i = 0;
    while(i<cCards.length){
        cCardsDisplay[i].src = cCards[i].cImg;
        i++;
    }
    setTimeout(()=>result(), 3000);
}
function result(){
    //Makes sure if A-9-K is not 29 but 20.
    threeCardFlag = false;
    playerValue = checkValue(pCards);
    if (threeCardFlag === true && pCCount===3 && playerValue > 21){
        playerValue -= 9;
    }

    threeCardFlag = false;
    compValue = checkValue(cCards);
    if (threeCardFlag === true && cCCount===3 && compValue > 21){
       compValue -= 9;
    }

    console.log("player: ", playerValue);
    console.log("computer:", compValue);

    //Conditions:
    if(cCCount ===5 && compValue < 22){
        compWin();
    }else if(pCCount === 5 && playerValue < 22){
        playerWin();
    }else if(playerValue>21 && compValue < 22){
        compWin();
    }else if(compValue >21 && playerValue<22){
        playerWin();
    }else if(playerValue>compValue){
        playerWin();
    }else if(compValue>playerValue){
        compWin();
    }else{
        draw();
    }
}

//Win,Lose,Draw
function playerWin(){
    document.querySelector('.win').style.display='block';
    gamePg.style.display='none';
    cash+=bet*2;
    cashTxt.textContent = cash;
}
function compWin(){
    document.querySelector('.lose').style.display='block';
    gamePg.style.display='none';
}
function draw(){
    document.querySelector('.draw').style.display='block';
    gamePg.style.display='none';
    cash+=bet;
    cashTxt.textContent = cash;
}

function dealAndShow(turn,time,delay){
    //deals the cards and shows them on the screen. On 1 sec intervals.
    //turn:'player' or 'comp'. time: total cards for that receiver. delay: yes or no.
    deal(turn);
    if(turn === 'player'){
        pCardsDisplay[time].src = pCards[time].cImg;
        setTimeout(()=>{pCardsDisplay[time].style.display='block';},(3**time)*1000*delay);
    }else if(turn === 'comp'){
        cCardsDisplay[time].src = 'cardBack01.png';
        setTimeout(()=>{cCardsDisplay[time].style.display='block';},(2**time)*2000*delay);
    }
}

//Dealing Cards
function deal(turn){
    //Didn't know how to delete an Array Element at the moment.
    let n = Math.floor(Math.random()*52);
    while(deck[n] === null){
        n = Math.floor(Math.random()*52);
    }
    if(turn === 'player'){
        pCards[pCCount] = deck[n];
        pCCount++;
    }else if(turn==='comp'){
        cCards[cCCount] = deck[n];
        cCCount++;
    }
    deck[n] = null;
}

//Checking Values
function checkValue(cArray){
    let cValue = 0;
    let arrLen = cArray.length;
    // return cArray[0].cNumber;
    for(let i = 0; i<arrLen; i++){
        if(cArray[i].cNumber===1){
            if(arrLen === 2){
                cValue += 11;
            } else if(arrLen === 3){
                cValue += 10;
                threeCardFlag = true;
            } else{
                cValue += 1;
            }
        } else if(cArray[i].cNumber >= 10){
            cValue += 10;
        } else {
            cValue += cArray[i].cNumber;
        }
    }
    return cValue;
}
