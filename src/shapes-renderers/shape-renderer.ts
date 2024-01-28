export type RGBA = { r: number; g: number; b: number; a: number };

export abstract class ShapeRenderer {
  private transitionTime: number;
  private colorDiff: RGBA;

  constructor(
    protected positionX: number,
    protected positionY: number,
    protected color: RGBA
  ) {
    this.transitionTime = 0;
    this.colorDiff = { r: 0, g: 0, b: 0, a: 0 };
  }

  changeColorTo(color: RGBA, transitionTime: number) {
    this.transitionTime = transitionTime;
    const { r: targetR, g: targetG, b: targetB, a: targetA } = color;
    const { r, g, b, a } = this.color;
    const rDiff = (targetR - r) / transitionTime;
    const gDiff = (targetG - g) / transitionTime;
    const bDiff = (targetB - b) / transitionTime;
    const aDiff = (targetA - a) / transitionTime;
    this.colorDiff = { r: rDiff, g: gDiff, b: bDiff, a: aDiff };
  }

  protected animateTransition() {
    if (this.transitionTime <= 0) return;

    this.color = {
      r: this.color.r + this.colorDiff.r,
      g: this.color.g + this.colorDiff.g,
      b: this.color.b + this.colorDiff.b,
      a: this.color.a + this.colorDiff.a,
    };
    this.transitionTime--;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.animateTransition();
    ctx.save();
    ctx.fillStyle = `rgb(${this.color.r} ${this.color.g} ${this.color.b} / ${this.color.a}%)`;
    this.drawInternal(ctx);
    ctx.restore();
  }

  protected abstract drawInternal(ctx: CanvasRenderingContext2D): void;
  abstract in(x: number, y: number): boolean;
}
