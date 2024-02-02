import { RGBA, ShapeRenderer as ShapeRenderer } from "./shape-renderer";

export class SquareRenderer extends ShapeRenderer {
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

  drawShape(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = `rgba(${this.color.r}  ${this.color.g}  ${this.color.b} / ${this.color.a}%)`
    context.fillRect(this.positionX, this.positionY, this.a, this.a);
    context.restore();

    //TODO: this requires a proper benchmarking in order to decide which one is faster

    // const image = context.getImageData(
    //   this.positionX,
    //   this.positionY,
    //   this.a,
    //   this.a
    // );
    // const imageData = image.data;
    // const { r, g, b, a } = this.color;
    // for (let i = 0; i < imageData.length; i += 4) {
    //   imageData[i] = r;
    //   imageData[i + 1] = g;
    //   imageData[i + 2] = b;
    //   imageData[i + 3] = a;
    // }
    // context.putImageData(image, this.positionX, this.positionY);
  }
}
