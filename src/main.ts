import { Canvas, Scene } from "./canvas";
import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

const RED = { r: 245, g: 222, b: 179, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const size = 20;
const gap = 5;
const height = 100;
const width = 100;
const flattenCells = generateBoard(height, width, size, gap);

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
        target.changeColorTo(RED, 10);
      } else {
        target.isAlive = true;
        target.changeColorTo(GREEN, 10);
      }
    }
  },

  sceneRenderer(context) {
    const dirtyCells = flattenCells.filter((c) => c.dirty);
    if (dirtyCells.length === 0) return;

    setPixels();

    function setPixels() {
      for (const shape of dirtyCells) {
        shape.animateTransition();
        const { x, y, w, h } = shape.containingArea;
        const { r, g, b, a } = shape.color;
        const imageDataForCell = context.getImageData(x, y, w, h);
        const data = imageDataForCell.data;
        for (let i = 0; i < data.length; i += 4) {
          imageDataForCell.data[i] = r;
          imageDataForCell.data[i + 1] = g;
          imageDataForCell.data[i + 2] = b;
          imageDataForCell.data[i + 3] = a;
        }
        context.putImageData(imageDataForCell, x, y);
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
  const cells = Array(width * height);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      cells[j + width * i] = new SquareRenderer(
        size * j + j * gap,
        size * i + i * gap,
        RED,
        size
      );
    }
  }
  return cells;
}
