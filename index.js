const chipsDisplay = document.getElementById('chips');
const buyChipsInput = document.getElementById('buy');
const buyChipsButton = document.getElementById('buy-submit');
const betPlayer = document.getElementById('player');
const betBanker = document.getElementById('banker');
const bet1s = document.getElementById('1-1');
const bet2s = document.getElementById('2-2');
const bet3s = document.getElementById('3-3');
const bet4s = document.getElementById('4-4');
const bet5s = document.getElementById('5-5');
const bet6s = document.getElementById('6-6');
const bet3 = document.getElementById('3');
const bet11 = document.getElementById('11');
const bet5 = document.getElementById('5');
const bet7 = document.getElementById('7');
const bet9 = document.getElementById('9');
const rollButton = document.getElementById('roll');
const dice1 = document.getElementById('dice-1');
const dice2 = document.getElementById('dice-2');

let chipCount = 0;

const rollAgainTotals = [5,7,9];
const playerWinPairs = [1,2,4];
const playerWinTotals = [3];
const bankerWinPairs = [3,5,6];
const bankerWinTotals = [11];

const totalWinPayouts = { 3: 3, 5: 8, 7: 5, 9: 8, 11: 3 };

function playerWins(dice1, dice2) {
  return dice1 == dice2 && playerWinPairs.includes(dice1) || playerWinTotals.includes(dice1 + dice2);
}

function bankerWins(dice1, dice2) {
  return dice1 == dice2 && bankerWinPairs.includes(dice1) || bankerWinTotals.includes(dice1 + dice2);
}

function rollAgain(dice1, dice2) {
  return playerWins(dice1, dice2) == bankerWins(dice1, dice2);
}

function playerWagerPayout(isBanker, dice1, dice2) {
  if (rollAgain(dice1, dice2)) {
    return 1;
  }

  return bankerWins(dice1, dice2) == isBanker ? 2 : -0.04;
}

function pairWagerPayout(pair, dice1, dice2) {
  if (dice1 == dice2 && dice1 == pair) {
    return 7;
  }

  return rollAgain(dice1, dice2) ? 1 : 0;
}

function totalWagerPayout(total, isSingleRoll, dice1, dice2) {
  if (total == dice1 + dice2) {
    return totalWinPayouts[total];
  }

  return !isSingleRoll && rollAgain(dice1, dice2) ? 1 : 0;
}

const slots = [
  { input: betPlayer, payout: (...args) => playerWagerPayout(false, ...args) },
  { input: betBanker, payout: (...args) => playerWagerPayout(true, ...args) },
  { input: bet1s, payout: (...args) => pairWagerPayout(1, ...args) },
  { input: bet2s, payout: (...args) => pairWagerPayout(2, ...args) },
  { input: bet3s, payout: (...args) => pairWagerPayout(3, ...args) },
  { input: bet4s, payout: (...args) => pairWagerPayout(4, ...args) },
  { input: bet5s, payout: (...args) => pairWagerPayout(5, ...args) },
  { input: bet6s, payout: (...args) => pairWagerPayout(6, ...args) },
  { input: bet3, payout: (...args) => totalWagerPayout(3, false, ...args) },
  { input: bet11, payout: (...args) => totalWagerPayout(11, false, ...args) },
  { input: bet5, payout: (...args) => totalWagerPayout(5, true, ...args) },
  { input: bet7, payout: (...args) => totalWagerPayout(7, true, ...args) },
  { input: bet9, payout: (...args) => totalWagerPayout(9, true, ...args) }
];

buyChipsButton.addEventListener('click', () => {
  chipCount += parseInt(buyChipsInput.value);
  buyChipsInput.value = '';
  chipsDisplay.innerText = chipCount;
});

rollButton.addEventListener('click', () => {
  const dice1Value = Math.floor(Math.random() * 6) + 1;
  const dice2Value = Math.floor(Math.random() * 6) + 1;
  const diceTotal = dice1Value + dice2Value;

  dice1.innerText = dice1Value;
  dice2.innerText = dice2Value;

  for (const slot of slots) {
    const bet = parseInt(slot.input.value || '0');
    const payout = bet * slot.payout(dice1Value, dice2Value);
    const gain = payout - bet;

    chipCount += gain;

    if (slot.input.nextElementSibling) {
      if (gain > 0) {
        slot.input.nextElementSibling.innerText = 'Win ' + gain;
      } else if (gain < 0) {
        slot.input.nextElementSibling.innerText = 'Lose ' + Math.abs(gain);
      } else {
        slot.input.nextElementSibling.innerText = '';
      }
    }
  }

  chipsDisplay.innerText = chipCount;
});
