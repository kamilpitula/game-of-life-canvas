import { RGBA, ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
  protected _pixels: { x: number; y: number }[];
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
    this._pixels = this.generatePixels();
  }

  generatePixels() {
    let pxs = Array(this.a * this.a);

    for (let y = 0; y < this.a; y++) {
      for (let x = 0; x < this.a; x++) {
        pxs[x + y * this.a] = {
          x: x + this.positionX,
          y: y + this.positionY,
        };
      }
    }

    return pxs;
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
