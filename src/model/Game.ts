export type GameSettings = { width: number; height: number };

type GameStateChangedHandler = (
  column: number,
  row: number,
  toState: boolean
) => void;

const DO_NOTHING: GameStateChangedHandler = (_, __, ___) => {};

export class Game {
  private width: number;
  private height: number;
  private board: boolean[];
  private generation: number;
  private onGameStateChanged: GameStateChangedHandler;

  constructor(settings: GameSettings) {
    if (settings.height <= 0 || settings.width <= 0)
      throw new Error("Board dimensions must be greater than zero!");
    this.width = settings.width;
    this.height = settings.height;
    this.board = new Array(this.width * this.height).fill(false);
    this.generation = 0;
    this.onGameStateChanged = DO_NOTHING;
  }

  tick() {
    let aliveCellsCounter = 0;
    const updates: (() => void)[] = [];

    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        const currentState = this.getCellStateForPosition(column, row);
        const aliveNeighbours = this.countAliveNeighbours(column, row);
        const newState = this.calculateNewState(currentState, aliveNeighbours);
        const stateChanged = newState !== currentState;
        if (newState) aliveCellsCounter++;
        if (stateChanged) {
          updates.push(this.updateCellState.bind(this, newState, column, row));
        }
      }
    }

    for (let update = 0; update < updates.length; update++) updates[update]();
    this.generation++;
  }

  changeCellState(column: number, row: number) {
    const cell = this.getCellForPosition(column, row);
    this.board[cell] = !this.board[cell];
    this.onGameStateChanged(column, row, this.board[cell]);
  }

  setGameStateChangedHandler(handler: GameStateChangedHandler) {
    this.onGameStateChanged = handler;
  }

  private getCellStateForPosition(column: number, row: number) {
    return this.board[this.getCellForPosition(column, row)];
  }

  private updateCellState(newState: boolean, column: number, row: number) {
    const cell = this.getCellForPosition(column, row);
    this.board[cell] = newState;
    this.onGameStateChanged(column, row, this.board[cell]);
  }

  private calculateNewState(
    currentState: boolean,
    aliveNeighboursCount: number
  ) {
    if (!currentState && aliveNeighboursCount === 3) {
      return true;
    }
    if (
      currentState &&
      (aliveNeighboursCount === 3 || aliveNeighboursCount === 2)
    ) {
      return true;
    }

    return false;
  }

  private countAliveNeighbours(column: number, row: number) {
    let aliveNeighboursCount = 0;

    for (
      let currentRow = row - 1;
      currentRow <= row + 1 && currentRow < this.height;
      currentRow++
    ) {
      for (
        let currentColumn = column - 1;
        currentColumn <= column + 1 && currentColumn < this.width;
        currentColumn++
      ) {
        if (currentRow === row && currentColumn === column) continue;
        if (currentRow < 0 || currentColumn < 0) continue;

        const isCurrentNeighbourAlive = this.getCellStateForPosition(
          currentColumn,
          currentRow
        );
        if (isCurrentNeighbourAlive) {
          aliveNeighboursCount++;
        }
      }
    }

    return aliveNeighboursCount;
  }

  private getCellForPosition(column: number, row: number) {
    return column + this.width * row;
  }
}
