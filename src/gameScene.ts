import { Scene } from "./canvas";
import { Game } from "./model/Game";
import { ShapeRenderer } from "./shapes-renderers/shape-renderer";
import { SquareRenderer } from "./shapes-renderers/square-renderer";

const COLOR_DEAD = { r: 207, g: 184, b: 60, a: 50 };
const COLOR_ALIVE = { r: 60, g: 143, b: 145, a: 79 };

let running = false;

export function runScene() {
  running = true;
}

export function stopScene() {
  running = false;
}

export function createScene(game: Game, size: number, gap: number) {
  const { width, height } = game.dimensions;
  game.setGameStateChangedHandler(updateBoardView);
  const widthPx = width * size + (width - 1) * gap;
  const heightPx = height * size + (height - 1) * gap;

  const flattenCells = generateBoard(height, width, size, gap);
  let dirtyCells = [...flattenCells];

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
          const shape = dirtyCells.shift();
          shape.animateTransition();
          shape.drawShape(context);
          if (shape.dirty) next.push(shape);
        }
        dirtyCells = next;
      }
    },
  };

  return scene;

  function updateBoardView(column: number, row: number, state: boolean) {
    const target = flattenCells[column + width * row];
    const newColor = state ? COLOR_ALIVE : COLOR_DEAD;
    target.changeColorTo(newColor, 10);
    dirtyCells.push(target);
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
}
