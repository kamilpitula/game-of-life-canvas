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

  drawShapeOnImage(imageData: Uint8ClampedArray): void {
    const { r, g, b, a } = this.color;
    for (let i = 0; i < imageData.length; i += 4) {
      imageData[i] = r;
      imageData[i + 1] = g;
      imageData[i + 2] = b;
      imageData[i + 3] = a;
    }
  }
}
