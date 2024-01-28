export type RGB = { r: number; g: number; b: number };

export abstract class ShapeRenderer {
  private transitionTime: number;
  private colorDiff: RGB;

  constructor(
    protected positionX: number,
    protected positionY: number,
    protected color: RGB
  ) {
    this.transitionTime = 0;
    this.colorDiff = { r: 0, g: 0, b: 0 };
  }

  changeColorTo(color: RGB, transitionTime: number) {
    this.transitionTime = transitionTime;
    const { r: targetR, g: targetG, b: targetB } = color;
    const { r, g, b } = this.color;
    const rDiff = (targetR - r) / transitionTime;
    const gDiff = (targetG - g) / transitionTime;
    const bDiff = (targetB - b) / transitionTime;
    this.colorDiff = { r: rDiff, g: gDiff, b: bDiff };
  }

  protected animateTransition() {
    if (this.transitionTime <= 0) return;

    this.color = {
      r: this.color.r + this.colorDiff.r,
      g: this.color.g + this.colorDiff.g,
      b: this.color.b + this.colorDiff.b,
    };
    this.transitionTime--;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.animateTransition();
    this.drawInternal(ctx);
  }

  protected abstract drawInternal(ctx: CanvasRenderingContext2D): void;
  abstract in(x: number, y: number): boolean;
}
