export abstract class ShapeRenderer {
  constructor(protected positionX: number, protected positionY: number) { }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract in(x: number, y: number): boolean;
}
