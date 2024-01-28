import { RGBA, ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
  isAlive: boolean = false;
  constructor(
    positionX: number,
    positionY: number,
    color: RGBA,
    private a: number
  ) {
    super(positionX, positionY, color);
  }

  drawInternal(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.positionX, this.positionY, this.a, this.a);
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
