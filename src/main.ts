import { Canvas, Scene } from "./canvas";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const RED = { r: 255, g: 0, b: 0, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const cells = generateBoard(100, 100, 20, 5).flat();

const scene: Scene = {
  clickHandler(x, y) {
    const target = cells.find((c) => c.in(x, y));
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
    for (const shape of cells) {
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
