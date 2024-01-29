import { Canvas, Scene } from "./canvas";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const RED = { r: 255, g: 0, b: 0, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const cells = [
  new SquareRenderer(200, 200, RED, 20),
  new SquareRenderer(2000, 200, RED, 20),
];

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
