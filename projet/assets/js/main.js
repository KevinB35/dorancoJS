//Genere un nombre aleatoire entre 0 et 999, et ajoute des 0 au debut justqu'a avoir 3 chiffres
const RAND_NUMBER = Math.floor(Math.random() * 1000)
  .toString()
  .padStart(3, "0");
const LIST_NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]; // Utilisé pour generer le pave numerique
let test_number = ""; // Le nombre entre par l'utilisateur
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

const generateNumberDivs = () => {
  // Bloc de Gauche
  LIST_NUMBERS.forEach((num) => {
    const div = document.createElement("div");
    div.setAttribute("class", "number");
    div.textContent = num;
    div.setAttribute("data-id", num);
    div.addEventListener("click", (e) => onClickNumber(e));
    div.style.userSelect = "none";
    leftContainer.appendChild(div);
  });

  // Bloc de Droite
  const div = document.createElement("div");
  div.setAttribute("class", "numberTest");
  div.textContent = "";
  rightContainer.appendChild(div);
};

const getSpanColor = (i) => {
  if (
    RAND_NUMBER.includes(i) &&
    i === RAND_NUMBER.slice(test_number.length - 1, test_number.length)
  )
    return "green"; // Si le nombre est present et a la bonne place
  if (RAND_NUMBER.includes(i)) return "yellow"; // Si le nombre est present mais pas a la bonne place
  return "none"; // Sinon
};

const generateLetter = (i) => {
  const span = document.createElement("span");
  span.style.backgroundColor = getSpanColor(i);

  span.setAttribute("class", "letterNumberTest");
  span.textContent = i;
  return span;
};

const setItemAndGetHighScoreAndPosition = (score) => {
  localStorage.setItem(localStorage.length, tries);

  // Recuperation des elements de localStorage dans une liste triee de facon decroissante (Peut aussi etre fait avec une boucle comme dans le cours)
  const scores = Array.from(Array(localStorage.length), (_, i) =>
    localStorage.getItem(i.toString())
  ).sort((a, b) => a - b);

  // Renvoie le premier element de score => Le plus petit => Le meilleur score
  // Et la position de la premiere occurrence du score actuel (+1 vu que la liste commence a 0)
  return [scores[0], scores.findIndex((el) => el === score.toString()) + 1];
};

const hideDivsOnCodeRight = () => {
  // TODO: Supprimer les elements plutot qu'ajouter la classe
  for (let container of containers) {
    container.classList.add("dNone");
  }
  image.classList.remove("dNone");
};

const onCodeRight = () => {
  // TODO: Ajouter la liste des nombres tentes
  const [highScore, position] = setItemAndGetHighScoreAndPosition(tries);
  clearInterval(interval);

  alert(
    `Bravo, le code etait ${RAND_NUMBER}.\n${tries} essai${
      tries > 1 ? "s" : ""
    }\nMeilleur score: ${highScore}\nPosition: ${position}`
  );

  hideDivsOnCodeRight();
};

const onClickNumber = (e) => {
  audioClick.play();

  // Bloc de droite
  const parent = numberTestDivs[0];
  const num = e.target.getAttribute("data-id");

  if (test_number.length >= 3) {
    // On reinitialise le choix de l'utilisateur
    tries++;
    test_number = num;
    parent.innerHTML = "";
  } else {
    test_number += num;
  }

  parent.appendChild(generateLetter(num));

  if (test_number.length === 3 && test_number !== RAND_NUMBER) {
    const div = numberTestDivs[0].cloneNode(true);
    rightContainer.append(div);
  }

  // On teste si le choix de l'utilisateur est le bon
  if (test_number.length === 3 && test_number === RAND_NUMBER) {
    onCodeRight();
  }
};

console.log(RAND_NUMBER);

generateNumberDivs();
