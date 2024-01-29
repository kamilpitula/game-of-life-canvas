import { Canvas, Scene } from "./canvas";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const RED = { r: 245, g: 222, b: 179, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const size = 20;
const gap = 5;
const cells = generateBoard(100, 100, size, gap);
const flattenCells = cells.flat();

const scene: Scene = {
  clickHandler(x, y) {
    const xCell = Math.floor(x / (size + gap));
    const yCell = Math.floor(y / (size + gap));
    const target = cells[yCell][xCell];

    if (!target.in(x, y)) return;

    if (target) {
      if (target.isAlive) {
        target.isAlive = false;
        target.changeColorTo(RED, 20);
      } else {
        target.isAlive = true;
        target.changeColorTo(GREEN, 20);
      }
    }
  },

  sceneRenderer(context) {
    for (const shape of flattenCells) {
      shape.draw(context);
    }
  },
};
const canvas = new Canvas("canvas", scene);

canvas.animateScene();

function generateBoard(
  height: number,
  width: number,
  size: number,
  gap: number
) {
  return Array.from(Array(height).keys()).map((i) => generateRow(i));

  function generateRow(i: number): SquareRenderer[] {
    return Array.from(Array(width).keys()).map(
      (j) =>
        new SquareRenderer(size * j + j * gap, size * i + i * gap, RED, size)
    );
  }
}
