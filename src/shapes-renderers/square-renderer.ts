import { RGBA, ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
  isAlive: boolean = false;

  constructor(
    positionX: number,
    positionY: number,
    color: RGBA,
    private a: number
  ) {
    super(positionX, positionY, color, {
      x: positionX,
      y: positionY,
      w: a,
      h: a,
    });
  }

  in(x: number, y: number) {
    return (
      x > this.positionX &&
      y > this.positionY &&
      x < this.positionX + this.a &&
      y < this.positionY + this.a
    );
  }
}
