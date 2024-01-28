import { RGB, ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
  isAlive: boolean = false;
  constructor(
    positionX: number,
    positionY: number,
    color: RGB,
    private a: number
  ) {
    super(positionX, positionY, color);
  }

  drawInternal(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = `rgb(${this.color.r},${this.color.g}, ${this.color.b})`;
    ctx.fillRect(this.positionX, this.positionY, this.a, this.a);
    ctx.restore();
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
