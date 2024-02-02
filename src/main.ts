import { Canvas, Scene } from "./canvas";
import { ShapeRenderer } from "./shapes-renderers/shape-renderer";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const COLOR_DEAD = { r: 207, g: 184, b: 60, a: 50 };
const COLOR_ALIVE = { r: 60, g: 143, b: 145, a: 79 };

const size = 8;
const gap = 2;
const height = 100;
const width = 100;
const flattenCells = generateBoard(height, width, size, gap);
let dirtyCells = [...flattenCells];

const widthPx = width * size + (width - 1) * gap;
const heightPx = height * size + (height - 1) * gap;

const scene: Scene = {
  width: widthPx,
  height: heightPx,
  clickHandler(x, y) {
    const xCell = Math.floor(x / (size + gap));
    const yCell = Math.floor(y / (size + gap));
    const target = flattenCells[xCell + width * yCell];
    if (!target) return;

    if (!target.in(x, y)) return;

    if (target) {
      if (target.isAlive) {
        target.isAlive = false;
        target.changeColorTo(COLOR_DEAD, 10);
      } else {
        target.isAlive = true;
        target.changeColorTo(COLOR_ALIVE, 10);
      }
      dirtyCells.push(target);
    }
  },

  sceneRenderer(context) {
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

function runAnimation(){
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
