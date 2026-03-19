const HUMAN = "X";
const AI = "O";
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every(Boolean)) {
    return "draw";
  }

  return null;
}

function minimax(board, currentPlayer, depth = 0) {
  const result = getWinner(board);
  if (result === AI) {
    return { score: 10 - depth };
  }
  if (result === HUMAN) {
    return { score: depth - 10 };
  }
  if (result === "draw") {
    return { score: 0 };
  }

  const availableMoves = board
    .map((value, index) => (value ? null : index))
    .filter((value) => value !== null);

  const candidates = availableMoves.map((index) => {
    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const outcome = minimax(
      nextBoard,
      currentPlayer === AI ? HUMAN : AI,
      depth + 1,
    );

    return {
      index,
      score: outcome.score,
    };
  });

  if (currentPlayer === AI) {
    return candidates.reduce((best, move) =>
      move.score > best.score ? move : best,
    );
  }

  return candidates.reduce((best, move) =>
    move.score < best.score ? move : best,
  );
}

function createInitialState() {
  return {
    board: Array(9).fill(""),
    locked: false,
    score: {
      human: 0,
      ai: 0,
      draw: 0,
    },
  };
}

function initializeApp(doc = document) {
  const state = createInitialState();
  const boardEl = doc.getElementById("board");
  const statusText = doc.getElementById("status-text");
  const scoreText = doc.getElementById("score-text");
  const restartRoundBtn = doc.getElementById("restart-round");
  const restartAllBtn = doc.getElementById("restart-all");

  function createBoard() {
    boardEl.innerHTML = "";

    state.board.forEach((value, index) => {
      const button = doc.createElement("button");
      button.className = `cell ${value ? value.toLowerCase() : ""}`;
      button.type = "button";
      button.textContent = value;
      button.disabled = Boolean(value) || state.locked;
      button.setAttribute("aria-label", `第 ${index + 1} 格 ${value || "空白"}`);
      button.addEventListener("click", () => handleHumanMove(index));
      boardEl.appendChild(button);
    });
  }

  function render() {
    createBoard();
    scoreText.textContent = `你 ${state.score.human} : ${state.score.ai} AI（平手 ${state.score.draw}）`;
  }

  function finishRound(result) {
    state.locked = true;

    if (result === HUMAN) {
      state.score.human += 1;
      statusText.textContent = "你居然贏了？如果規則沒被改，這不應該發生。";
    } else if (result === AI) {
      state.score.ai += 1;
      statusText.textContent = "AI 獲勝。再試一次，它還是不會輸。";
    } else {
      state.score.draw += 1;
      statusText.textContent = "平手。這已經是你能拿到的最佳結果。";
    }

    render();
  }

  function handleHumanMove(index) {
    if (state.locked || state.board[index]) {
      return;
    }

    state.board[index] = HUMAN;
    const humanResult = getWinner(state.board);
    if (humanResult) {
      finishRound(humanResult);
      return;
    }

    state.locked = true;
    statusText.textContent = "AI 正在思考最佳羞辱方式⋯⋯";
    render();

    window.setTimeout(() => {
      const { index: bestMove } = minimax([...state.board], AI);
      state.board[bestMove] = AI;
      state.locked = false;

      const aiResult = getWinner(state.board);
      if (aiResult) {
        finishRound(aiResult);
        return;
      }

      statusText.textContent = "你的回合。理論上你最多只能逼和。";
      render();
    }, 250);
  }

  function resetRound() {
    state.board = Array(9).fill("");
    state.locked = false;
    statusText.textContent = "你的回合，先手出招吧。";
    render();
  }

  restartRoundBtn.addEventListener("click", resetRound);
  restartAllBtn.addEventListener("click", () => {
    state.score = { human: 0, ai: 0, draw: 0 };
    resetRound();
  });

  render();

  return { state, resetRound, handleHumanMove };
}

if (typeof document !== "undefined") {
  initializeApp(document);
}

if (typeof module !== "undefined") {
  module.exports = {
    AI,
    HUMAN,
    WIN_LINES,
    createInitialState,
    getWinner,
    initializeApp,
    minimax,
  };
}
