import { ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
  constructor(
    positionX: number,
    positionY: number,
    private a: number,
    public isAlive: boolean = false
  ) {
    super(positionX, positionY);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if (this.isAlive) {
      ctx.fillStyle = "red";
    }
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
