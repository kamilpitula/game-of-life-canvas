import { SquareRenderer } from "./shapes-renderers/square-renderer";

const ZOOM_SENSITIVITY = 0.005;
const ZOOM_MAX = 3;
const ZOOM_MIN = 0.5;

const RED = { r: 255, g: 0, b: 0, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const cells = [
  new SquareRenderer(200, 200, RED, 20),
  new SquareRenderer(2000, 200, RED, 20),
];

export class Canvas {
  canvasElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  zoom: number = 1;

  mouseMove: boolean = false;
  mouseMoveStartX: number = 0;
  mouseMoveStartY: number = 0;

  translateX: number = 0;
  translateY: number = 0;

  constructor(id: string) {
    const el = <HTMLCanvasElement>document.getElementById(id);
    if (!el) throw new Error(`Couldn't find canvas element with id: ${id}`);

    const context = el.getContext("2d");
    if (!context) throw new Error("Couldn't initialize context.");

    this.canvasElement = el;
    this.context = context;

    this.initializeCanvas();
  }

  private initializeCanvas() {
    const canvas = this.canvasElement;
    canvas.addEventListener("wheel", onScroll.bind(this));
    canvas.addEventListener("click", onClick.bind(this));
    canvas.addEventListener("mousedown", onMouseDown.bind(this));
    canvas.addEventListener("mouseup", onMouseUp.bind(this));
    canvas.addEventListener("mousemove", onMouseMove.bind(this));

    function onScroll(this: Canvas, event: Event) {
      const targetZoom =
        this.zoom + (<WheelEvent>event).deltaY * ZOOM_SENSITIVITY;
      if (targetZoom >= ZOOM_MAX || targetZoom <= ZOOM_MIN) return;
      this.zoom = targetZoom;
    }

    function onMouseDown(this: Canvas, event: Event) {
      this.mouseMoveStartX = (<MouseEvent>event).offsetX / this.zoom;
      this.mouseMoveStartY = (<MouseEvent>event).offsetY / this.zoom;
      this.mouseMove = true;
    }

    function onMouseMove(this: Canvas, event: Event) {
      if (!this.mouseMove) return;
      const x = (<MouseEvent>event).offsetX / this.zoom;
      const y = (<MouseEvent>event).offsetY / this.zoom;
      this.translateX -= this.mouseMoveStartX - x;
      this.translateY -= this.mouseMoveStartY - y;
      this.mouseMoveStartX = x;
      this.mouseMoveStartY = y;
    }

    function onMouseUp(this: Canvas, _: Event) {
      this.mouseMove = false;
    }

    function onClick(this: Canvas, event: Event) {
      const x = ((<MouseEvent>event).offsetX - this.translateX) / this.zoom;
      const y = ((<MouseEvent>event).offsetY - this.translateY) / this.zoom;

      const target = cells.find((c) => c.in(x, y));
      if (target) {
        if (target.isAlive) {
          target.isAlive = false;
          target.changeColorTo(RED, 20);
        } else {
          target.isAlive = true;
          target.changeColorTo(GREEN, 20);
        }
      }
    }
  }

  animateCanvas() {
    resize.call(this);

    this.context.translate(this.translateX, this.translateY);
    this.context.scale(this.zoom, this.zoom);
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    for (const cell of cells) {
      cell.draw(this.context);
    }

    window.requestAnimationFrame(() => this.animateCanvas());

    function resize(this: Canvas) {
      const canvas = this.context.canvas;
      const parent = canvas.parentElement;
      canvas.width = parent!.clientWidth;
      canvas.height = parent!.clientHeight;
    }
  }
}
