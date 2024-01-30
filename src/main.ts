import { Canvas, Scene } from "./canvas";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const RED = { r: 245, g: 222, b: 179, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const size = 20;
const gap = 5;
const height = 100;
const width = 100;
const cells = generateBoard(height, width, size, gap);
const flattenCells = cells.flat();

const tempContext = document
  .createElement("canvas")
  .getContext("2d", { willReadFrequently: true })!;

const widthPx = width * size + (width - 1) * gap;
const heightPx = height * size + (height - 1) * gap;
tempContext.canvas.width = widthPx;
tempContext.canvas.height = heightPx;

const scene: Scene = {
  clickHandler(x, y) {
    const xCell = Math.floor(x / (size + gap));
    const yCell = Math.floor(y / (size + gap));
    const row = cells[yCell];
    if (!row) return;

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
    const dirtyCells = flattenCells.filter((c) => c.dirty);
    if (dirtyCells.length === 0) {
      context.drawImage(tempContext.canvas, 0, 0);
      return;
    }
    const imageData = tempContext.getImageData(0, 0, widthPx, heightPx);
    const lineLength = imageData.width * 4;

    setPixels();
    tempContext.putImageData(imageData, 0, 0);
    context.drawImage(tempContext.canvas, 0, 0);

    function setPixels() {
      for (const shape of dirtyCells) {
        shape.animateTransition();
        for (const pixel of shape.pixels) {
          const startingPosition = pixel.x * 4 + pixel.y * lineLength;
          imageData.data[startingPosition] = shape.color.r;
          imageData.data[startingPosition + 1] = shape.color.g;
          imageData.data[startingPosition + 2] = shape.color.b;
          imageData.data[startingPosition + 3] = shape.color.a;
        }
      }
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
