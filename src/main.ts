import "./style.css";

abstract class Shape {
  constructor(protected positionX: number, protected positionY: number) {}

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract in(x: number, y: number): boolean;
}

class Square extends Shape {
  constructor(
    positionX: number,
    positionY: number,
    private a: number,
    public isAlive: boolean = false
  ) {
    super(positionX, positionY);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isAlive) {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(this.positionX, this.positionY, this.a, this.a);
    ctx.fillStyle = "black";
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

let zoom = 1;
const ZOOM_SENSITIVITY = 0.005;

const cells = [new Square(200, 200, 20), new Square(2000, 200, 20)];

function initializeCanvas(canvasId: string) {
  const canvas = <HTMLCanvasElement>document.getElementById(canvasId);
  canvas.addEventListener("wheel", onScroll);
  canvas.addEventListener("click", onClick);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Couldn't initialize context.");
  return context;

  function onScroll(event: Event) {
    zoom += (<WheelEvent>event).deltaY * ZOOM_SENSITIVITY;
  }

  function onClick(event: Event) {
    const x = (<MouseEvent>event).offsetX / zoom;
    const y = (<MouseEvent>event).offsetY / zoom;

    const target = cells.find((c) => c.in(x, y));
    if (target) target.isAlive = !target.isAlive;
  }
}

function animateCanvas(context: CanvasRenderingContext2D) {
  resize();
  context.scale(zoom, zoom);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for (const cell of cells) {
    cell.draw(context);
  }

  window.requestAnimationFrame(() => animateCanvas(context));

  function resize() {
    const canvas = context.canvas;
    const parent = canvas.parentElement;
    canvas.width = parent!.clientWidth;
    canvas.height = parent!.clientHeight;
  }
}

const context = initializeCanvas("canvas");

animateCanvas(context);
