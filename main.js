const colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "gray"]

const oppositeColorNames = {
  "red": "Azul",
  "green": "Vermelho",
  "blue": "Laranja",
  "yellow": "Roxo",
  "purple": "Amarelo",
  "orange": "Azul",
  "pink": "Verde",
  "brown": "Azul",
  "gray": "Amarelo"
};

let targetColor
let score = 0
let level = 1
let time = 0
let countdownInterval;
let buttonsContainer = document.getElementById("buttons-container")
let targetWord = document.getElementById("target-word")
let startButton = document.getElementById("start-button")
let rankingButton = document.getElementById("ranking-button")
let scoreElement = document.getElementById("score")
let rankingContainer = document.getElementById("ranking-container")
let rankingList = document.getElementById("ranking-list")
let backButton = document.getElementById("back-button")

function addButton(color) {
  let button = document.createElement("div")
  button.classList.add("button")
  button.style.backgroundColor = color

  let innerContent = document.createElement("div")
  innerContent.textContent = oppositeColorNames[color]

  button.appendChild(innerContent)

  button.addEventListener("click", () => {
    handleButtonClick(color)
  })
  buttonsContainer.appendChild(button)
}

function shuffleButtons() {
  for (let i = buttonsContainer.children.length; i >= 0; i--) {
    buttonsContainer.appendChild(buttonsContainer.children[Math.random() * i | 0])
  }
}

function startRound() {
  targetColor = colors[Math.floor(Math.random() * colors.length)]
  targetWord.textContent = oppositeColorNames[targetColor]

  buttonsContainer.innerHTML = ""
  colors.forEach(addButton)
  if (level >= 3) {
    shuffleButtons()
  }

  time = 3 - (level - 1) * 0.5
  scoreElement.textContent = `Pontuação: ${score}`
  countdownInterval = setInterval(() => {
    time -= 0.1
    if (time <= 0) {
      endGame()
    }
  }, 100)
}

function handleButtonClick(color) {
  if (color === targetColor) {
    clearInterval(countdownInterval)
    score++
    scoreElement.textContent = `Pontuação: ${score}`

    if (score % 10 === 0) {
      level++
    }

    startRound()
  } else {
    endGame()
  }
}

function endGame() {
  clearInterval(countdownInterval)
  targetWord.textContent = "Fim de jogo"
  buttonsContainer.innerHTML = ""
  startButton.style.display = "grid"
  rankingButton.style.display = "inline"
}

function showRanking() {
  let ranking = getRanking()
  rankingList.innerHTML = ""

  for (let i = 0; i < ranking.length; i++) {
    let listItem = document.createElement("li")
    listItem.textContent = `${ranking[i].name}: ${ranking[i].score}`
    rankingList.appendChild(listItem)
  }

  rankingContainer.style.display = "block"
  document.getElementById("game-container").style.display = "none"
}

function hideRanking() {
  rankingContainer.style.display = "none"
  document.getElementById("game-container").style.display = "block"
}

function getRanking() {
  let ranking = localStorage.getItem("ranking")
  return ranking ? JSON.parse(ranking) : []
}

function updateRanking(name) {
  let ranking = getRanking()
  ranking.push({ name, score })
  ranking.sort((a, b) => b.score - a.score)
  if (ranking.length > 10) {
    ranking = ranking.slice(0, 10)
  }
  localStorage.setItem("ranking", JSON.stringify(ranking))
}

startButton.addEventListener("click", () => {
  score = 0
  level = 1
  startButton.style.display = "none"
  rankingButton.style.display = "none"
  startRound()
})

rankingButton.addEventListener("click", () => {
  showRanking()
})

backButton.addEventListener("click", () => {
  hideRanking()
})
