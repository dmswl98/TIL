let animals = [
  { content: "😺", name: "cat", isSleep: false },
  { content: "🐶", name: "dog", isSleep: false },
  { content: "🐻", name: "bear", isSleep: true },
  { content: "🐸", name: "frog", isSleep: true },
  { content: "🐰", name: "rabbit", isSleep: false },
];

const $main = document.querySelector(".main");

const $box1 = document.createElement("div");
$box1.setAttribute("droppable", "true");
$box1.className = "box";

const $box2 = document.createElement("div");
$box2.setAttribute("droppable", "true");
$box2.className = "box";

const render = () => {
  $box1.innerHTML = `${animals
    .filter((animal) => animal.isSleep)
    .map(
      (animal) =>
        `<div class="item" data-name="${animal.name}" draggable="true">${animal.content}</div>`
    )
    .join("")}`;

  $box2.innerHTML = `${animals
    .filter((animal) => !animal.isSleep)
    .map(
      (animal) =>
        `<div class="item" data-name="${animal.name}" draggable="true">${animal.content}</div>`
    )
    .join("")}`;
};

$main.appendChild($box1);
$main.appendChild($box2);

render();

const $item = document.querySelector(".item");

$main.addEventListener("dragstart", (e) => {
  const $item = e.target.closest(".item");
  e.dataTransfer.setData("animal", $item.dataset.name);
});

$main.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
});

$main.addEventListener("drop", (e) => {
  e.preventDefault();
  const droppedAnimalName = e.dataTransfer.getData("animal");

  const droppedAnimalIndex = animals.findIndex(
    (animal) => animal.name === droppedAnimalName
  );

  const nextState = [...animals];
  console.log(nextState[droppedAnimalIndex]);
  nextState[droppedAnimalIndex].isSleep =
    !nextState[droppedAnimalIndex].isSleep;

  animals = [...nextState];

  render();
});
