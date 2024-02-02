import { Scene } from "./canvas";
import { Game } from "./model/Game";
import { ShapeRenderer } from "./shapes-renderers/shape-renderer";
import { SquareRenderer } from "./shapes-renderers/square-renderer";

const COLOR_FRESH = { r: 207, g: 188, b: 138, a: 100 };
const COLOR_ALIVE = { r: 113, g: 126, b: 202, a: 60 };
const COLOR_VISITED = { r: 197, g: 222, b: 136, a: 100 }

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
  let dirtyCells = new Set<ShapeRenderer>(flattenCells);

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
        for (const shape of dirtyCells) {
          shape.animateTransition();
          shape.drawShape(context);
          if (shape.dirty) next.push(shape);
        }
        dirtyCells = new Set<ShapeRenderer>(next);
      }
    },
  };

  return scene;

  function updateBoardView(column: number, row: number, state: boolean) {
    const target = flattenCells[column + width * row];
    const newColor = state ? COLOR_ALIVE : COLOR_VISITED;
    target.changeColorTo(newColor, 1);
    dirtyCells.add(target);
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
          COLOR_FRESH,
          size
        );
      }
    }
    return cells;
  }
}
