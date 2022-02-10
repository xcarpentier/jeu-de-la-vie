function buildDiv() {
  return document.createElement("div");
}

function buildCell(size = 10, color = "red") {
  const square = buildDiv();
  square.style.background = color;
  square.style.opacity = "50%";
  square.style.width = `${size}px`;
  square.style.height = `${size}px`;
  // square.style.border = "solid";
  // square.style.borderWidth = "thin";
  // square.style.borderColor = "red";
  return square;
}

function buildContainer() {
  const container = buildDiv();
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.margin = "auto";
  return container;
}

function buildLineContainer() {
  const lineContainer = buildDiv();
  lineContainer.style.display = "flex";
  lineContainer.style.flexDirection = "row";
  return lineContainer;
}

function getDimension() {
  const body = document.body,
    html = document.documentElement;

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  const width = Math.max(
    body.scrollWidth,
    body.offsetWidth,
    html.clientWidth,
    html.scrollWidth,
    html.offsetWidth
  );

  return { width, height };
}

function buildGrid({
  container,
  cellSize = 10,
  color = { alive: "green", dead: "lightgrey" },
  state,
}) {
  const numberOfCellPerLine = state[0].length;
  const numberOfCellPerColumn = state.length;
  for (let indexLine = 0; indexLine < numberOfCellPerColumn; indexLine++) {
    const lineContainer = buildLineContainer();
    for (
      let indexColumn = 0;
      indexColumn < numberOfCellPerLine;
      indexColumn++
    ) {
      lineContainer.appendChild(
        buildCell(
          cellSize,
          state[indexLine][indexColumn] ? color.alive : color.dead
        )
      );
    }
    container.appendChild(lineContainer);
  }
  return container;
}

export function countAliveNeighbors({ state, indexLine, indexColumn }) {
  // side?
  const isSideTop = indexLine === 0;
  const isSideBottom = indexLine === state.length - 1;
  const isSideRight = indexColumn === state[0].length - 1;
  const isSideLeft = indexColumn === 0;

  // corner?
  const isCornerLeftUp = isSideTop && isSideLeft;
  const isCornerRightUp = isSideTop && isSideRight;
  const isCornerRightBottom = isSideBottom && isSideRight;
  const isCornerLeftBottom = isSideBottom && isSideLeft;

  // alive?
  // TODO: change state[x][y] by getCell(x, y) to memoïze (dont miss to clean memory before next step)
  const isLeftUpCellAlive =
    !isCornerLeftUp &&
    !isCornerRightUp &&
    !isCornerLeftBottom &&
    !isSideTop &&
    state[indexLine - 1][indexColumn - 1];
  const isUpCellAlive = !isSideTop && state[indexLine - 1][indexColumn];
  const isRightUpCellAlive =
    !isCornerLeftUp &&
    !isCornerRightUp &&
    !isCornerRightBottom &&
    !isSideTop &&
    state[indexLine - 1][indexColumn + 1];
  const isLeftCellAlive = !isSideLeft && state[indexLine][indexColumn - 1];
  const isRightCellAlive = !isSideRight && state[indexLine][indexColumn + 1];
  const isLeftBottomCellAlive =
    !isCornerLeftUp &&
    !isCornerRightBottom &&
    !isCornerLeftBottom &&
    !isSideBottom &&
    state[indexLine + 1][indexColumn - 1];
  const isBottomCellAlive = !isSideBottom && state[indexLine + 1][indexColumn];
  const isRightBottomCellAlive =
    !isCornerRightUp &&
    !isCornerRightBottom &&
    !isCornerLeftBottom &&
    !isSideBottom &&
    state[indexLine + 1][indexColumn + 1];

  let count = 0;
  isLeftUpCellAlive && count++;
  isUpCellAlive && count++;
  isRightUpCellAlive && count++;
  isLeftCellAlive && count++;
  isRightCellAlive && count++;
  isLeftBottomCellAlive && count++;
  isBottomCellAlive && count++;
  isRightBottomCellAlive && count++;

  return count;
}

export function getInitialState({ dimension, cellSize }) {
  const numberOfCellPerLine = dimension.width / cellSize;
  const numberOfCellPerColumn = dimension.height / cellSize;
  const centerLine = Math.floor(numberOfCellPerLine / 2);
  const centerColumn = Math.floor(numberOfCellPerColumn / 2);
  // start middle 3 cells alive
  const result = [];
  for (let indexLine = 0; indexLine < numberOfCellPerColumn; indexLine++) {
    const line = [];
    for (
      let indexColumn = 0;
      indexColumn < numberOfCellPerLine;
      indexColumn++
    ) {
      line.push(
        centerLine === indexLine &&
          (centerColumn - 1 === indexColumn ||
            centerColumn === indexColumn ||
            centerColumn + 1 === indexColumn)
      );
    }
    result.push(line);
  }

  return result;
}

function getState({ state, dimension, cellSize }) {
  const numberOfCellPerLine = dimension.width / cellSize;
  const numberOfCellPerColumn = dimension.height / cellSize;
  const result = [];
  for (let indexLine = 0; indexLine < numberOfCellPerColumn; indexLine++) {
    const line = [];
    for (
      let indexColumn = 0;
      indexColumn < numberOfCellPerLine;
      indexColumn++
    ) {
      // https://fr.wikipedia.org/wiki/Jeu_de_la_vie
      // normal cell
      if (state) {
        const aliveNeighbors = countAliveNeighbors({
          state,
          indexColumn,
          indexLine,
        });
        line.push(
          state[indexLine][indexColumn]
            ? aliveNeighbors >= 2
            : aliveNeighbors >= 3
        );
      }
    }
    result.push(line);
  }
  return result;
}

function render(body, cellSize = 10) {
  let grid = null;
  const dimension = getDimension();
  let state = getInitialState({ dimension, cellSize });
  return () => {
    const tick = new Date().getSeconds();
    const container = buildContainer();
    if (grid) {
      body.removeChild(grid);
    }
    state = getState({ dimension, cellSize, tick, state });
    grid = buildGrid({ container, cellSize, state });

    body.appendChild(grid);
  };
}

function start(timeout = 5000) {
  setInterval(render(document.body), timeout);
}

document.addEventListener("DOMContentLoaded", start);
