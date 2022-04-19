let pCCount;
let cCCount;
let playerValue;
let compValue;

function conditions(cmt, pCCount, cCCount, playerValue, compValue){
console.log("For the condition of: "+ cmt);
if (pCCount === 5 && playerValue < 22) {
    console.log("playerwins");
} else if (compValue < 22 && (cCCount === 5 || playerValue > 21 || compValue > playerValue)) {
    console.log("computerwins");
} else if (playerValue < 22 && (compValue > 21 || playerValue > compValue)) {
    console.log("playerwins");
} else {
    console.log("draw");
}
}

conditions("normal-playerWins",3,3,20,15);
conditions("normal-computerWins",3,2,17,18);
conditions("normal-draw",3,2,18,18);
conditions("fiveCards-player",5,3,10,21);
conditions("fiveCards-computer",3,5,20,19);
conditions("fiveCards-both",5,5,18,19);
conditions("flopped-player",3,2,22,16);

conditions("flopped-computer",3,3,20,22);

conditions("flopped-both",3,3,23,25);
