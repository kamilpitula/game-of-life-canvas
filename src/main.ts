import { Canvas, Scene } from "./canvas";
import { Game } from "./model/Game";
import { ShapeRenderer } from "./shapes-renderers/shape-renderer";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

let running = false;
const startBtn = <HTMLButtonElement>document.getElementById("startBtn");
const stopBtn = <HTMLButtonElement>document.getElementById("stopBtn");
startBtn.addEventListener("click", () => (running = true));
stopBtn.addEventListener("click", () => (running = false));

const COLOR_DEAD = { r: 207, g: 184, b: 60, a: 50 };
const COLOR_ALIVE = { r: 60, g: 143, b: 145, a: 79 };

const size = 8;
const gap = 2;
const height = 100;
const width = 100;

const game = new Game({ width, height });

const flattenCells = generateBoard(height, width, size, gap);
let dirtyCells = [...flattenCells];

const widthPx = width * size + (width - 1) * gap;
const heightPx = height * size + (height - 1) * gap;

function updateBoardView(column: number, row: number, state: boolean) {
  const target = flattenCells[column + width * row];
  const newColor = state ? COLOR_ALIVE : COLOR_DEAD;
  target.changeColorTo(newColor, 10);
  dirtyCells.push(target);
}

game.setGameStateChangedHandler(updateBoardView);

const scene: Scene = {
  width: widthPx,
  height: heightPx,
  clickHandler(x, y) {
    const cellColumn = Math.floor(x / (size + gap));
    const cellRow = Math.floor(y / (size + gap));
    const target = flattenCells[cellColumn + width * cellRow];
    if (!target) return;

    if (!target.in(x, y)) return;

    game.changeCellState(cellColumn, cellRow);
  },

  sceneRenderer(context) {
    if (running) game.tick();
    renderSquares();

    function renderSquares() {
      const next: ShapeRenderer[] = [];
      while (dirtyCells.length > 0) {
        const shape = dirtyCells.pop();
        shape.animateTransition();
        shape.drawShape(context);
        if (shape.dirty) next.push(shape);
      }
      dirtyCells = next;
    }
  },
};

const canvas = new Canvas("canvas", scene);

runAnimation();

function runAnimation() {
  canvas.animateScene();
  window.requestAnimationFrame(() => runAnimation());
}

function generateBoard(
  height: number,
  width: number,
  size: number,
  gap: number
) {
  const cells = Array(width * height);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      cells[j + width * i] = new SquareRenderer(
        size * j + j * gap,
        size * i + i * gap,
        COLOR_DEAD,
        size
      );
    }
  }
  return cells;
}
