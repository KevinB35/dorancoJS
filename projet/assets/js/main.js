//Genere un nombre aleatoire entre 0 et 999, et ajoute des 0 au debut justqu'a avoir 3 chiffres
const RAND_NUMBER = Math.floor(Math.random() * 1000)
  .toString()
  .padStart(3, "0");
const LIST_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]; // Utilisé pour generer le pave numerique
let userInput = ""; // Le nombre entre par l'utilisateur
let tries = 1; //Le nombre d'essai de l'utilisateur
let time = 0; // Timer
const audioClick = new Audio("assets/audio/click.wav"); // Son du clic du clavier

// Recuperation des differents HTMLElement
const leftContainer = document.getElementById("leftContainer");
const timerDiv = document.getElementById("timer");
const numberTestDivs = document.getElementsByClassName("numberTest");
const image = document.getElementById("image");
const rightContainer = document.getElementById("rightContainer");
const containers = document.getElementsByClassName("container");

// Timer
const interval = setInterval(() => {
  time++;
  timerDiv.innerHTML = `${Math.floor(time / 100)
    .toString()
    .padStart(2, "0")}:${(time % 100).toString().padStart(2, "0")}`;
}, 10);

/**
 *
 */
const generateNumberDivs = () => {
  // Bloc de Gauche
  LIST_NUMBERS.forEach((num) => {
    const div = document.createElement("div");
    div.setAttribute("class", "number");
    div.textContent = num;
    div.setAttribute("data-id", num);
    div.addEventListener("click", (e) => onClickHandler(e));
    div.style.userSelect = "none";
    leftContainer.appendChild(div);
  });

  // Bloc de Droite
  const div = document.createElement("div");
  div.setAttribute("class", "numberTest");
  div.textContent = "";
  rightContainer.appendChild(div);
};

/**
 *
 * @param {string} i
 * @returns {"#2ecc71" | "#f1c40f" | "none"}
 */
const getSpanColor = (i) => {
  if (
    RAND_NUMBER.includes(i) &&
    i === RAND_NUMBER.slice(userInput.length - 1, userInput.length)
  )
    return "#2ecc71"; // Si le nombre est present et a la bonne place
  if (RAND_NUMBER.includes(i)) return "#f1c40f"; // Si le nombre est present mais pas a la bonne place
  return "none"; // Sinon
};

/**
 *
 * @param {string} i
 * @returns {HTMLSpanElement}
 */
const generateLetter = (i) => {
  const span = document.createElement("span");
  span.style.backgroundColor = getSpanColor(i);

  span.setAttribute("class", "letterNumberTest");
  span.textContent = i;
  return span;
};

/**
 *
 * @param {number} score
 * @returns {[number, number]}
 */
const setItemAndGetHighScoreAndPosition = (score) => {
  localStorage.setItem(localStorage.length, tries);

  // Recuperation des elements de localStorage dans une liste triee de facon decroissante (Peut aussi etre fait avec une boucle comme dans le cours)
  const scores = Array.from(Array(localStorage.length), (_, i) =>
    parseInt(localStorage.getItem(i.toString()))
  ).sort((a, b) => a - b);

  console.log(scores);

  // Renvoie le premier element de score => Le plus petit => Le meilleur score
  // Et la position de la premiere occurrence du score actuel (+1 vu que la liste commence a 0)
  return [scores[0], scores.findIndex((el) => el === score) + 1];
};

/**
 *
 */
const hideDivs = () => {
  for (let container of containers) {
    container.classList.add("dNone");
  }
  image.classList.remove("dNone");
};

/**
 *
 */
const onCodeRight = () => {
  const [highScore, position] = setItemAndGetHighScoreAndPosition(tries);
  clearInterval(interval);

  alert(
    `Bravo, le code etait ${RAND_NUMBER}.\n${tries} essai${
      tries > 1 ? "s" : ""
    }\nMeilleur score: ${highScore}\nPosition: ${position}`
  );

  hideDivs();
};

/**
 *
 * @param {MouseEvent} e
 */
const onClickHandler = (e) => {
  audioClick.play();

  // Bloc de droite
  const parent = numberTestDivs[0];
  const num = e.target.getAttribute("data-id");

  if (userInput.length >= 3) {
    // On reinitialise le choix de l'utilisateur
    tries++;
    userInput = num;
    parent.innerHTML = "";
  } else {
    userInput += num;
  }

  parent.appendChild(generateLetter(num));

  if (userInput.length === 3 && userInput !== RAND_NUMBER) {
    const div = numberTestDivs[0].cloneNode(true);
    rightContainer.append(div);
  }

  // On teste si le choix de l'utilisateur est le bon
  if (userInput.length === 3 && userInput === RAND_NUMBER) {
    onCodeRight();
  }
};

console.log(RAND_NUMBER);

generateNumberDivs();
