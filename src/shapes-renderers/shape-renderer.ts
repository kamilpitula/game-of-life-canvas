export type RGBA = { r: number; g: number; b: number; a: number };

export abstract class ShapeRenderer {
  private transitionTime: number;
  private colorDiff: RGBA;
  public dirty: boolean;
  protected abstract _pixels: { x: number; y: number }[];

  constructor(
    public positionX: number,
    public positionY: number,
    public color: RGBA,
    private _containingArea: { x: number; y: number; w: number; h: number }
  ) {
    this.transitionTime = 0;
    this.colorDiff = { r: 0, g: 0, b: 0, a: 0 };
    this.dirty = true;
  }
  abstract in(x: number, y: number): boolean;

  get pixels() {
    return this._pixels;
  }

  get containingArea() {
    return this._containingArea;
  }

  animateTransition() {
    if (this.transitionTime <= 0) {
      this.dirty = false;
      return;
    }

    this.color = {
      r: this.color.r + this.colorDiff.r,
      g: this.color.g + this.colorDiff.g,
      b: this.color.b + this.colorDiff.b,
      a: this.color.a + this.colorDiff.a,
    };
    this.transitionTime--;
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
    this.dirty = true;
  }
}
