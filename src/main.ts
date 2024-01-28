import { SquareRenderer } from "./shapes-renderers/square-renderer";
import "./style.css";

let zoom = 1;
const ZOOM_SENSITIVITY = 0.005;

let mouseMove = false;
let mouseMoveStartX = 0;
let mouseMoveStartY = 0;

let translateX = 0;
let translateY = 0;

const RED = { r: 255, g: 0, b: 0, a: 80 };
const GREEN = { r: 0, g: 255, b: 0, a: 40 };

const cells = [
  new SquareRenderer(200, 200, RED, 20),
  new SquareRenderer(2000, 200, RED, 20),
];

function initializeCanvas(canvasId: string) {
  const canvas = <HTMLCanvasElement>document.getElementById(canvasId);
  canvas.addEventListener("wheel", onScroll);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Couldn't initialize context.");
  return context;

  function onScroll(event: Event) {
    zoom += (<WheelEvent>event).deltaY * ZOOM_SENSITIVITY;
  }

  function onMouseDown(event: Event) {
    mouseMoveStartX = (<MouseEvent>event).offsetX / zoom;
    mouseMoveStartY = (<MouseEvent>event).offsetY / zoom;
    mouseMove = true;
  }

  function onMouseMove(event: Event) {
    if (!mouseMove) return;
    const x = (<MouseEvent>event).offsetX / zoom;
    const y = (<MouseEvent>event).offsetY / zoom;
    translateX -= mouseMoveStartX - x;
    translateY -= mouseMoveStartY - y;
    mouseMoveStartX = x;
    mouseMoveStartY = y;
  }

  function onMouseUp(event: Event) {
    mouseMove = false;
  }

  function onClick(event: Event) {
    const x = (<MouseEvent>event).offsetX / zoom;
    const y = (<MouseEvent>event).offsetY / zoom;

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

function animateCanvas(context: CanvasRenderingContext2D) {
  resize();
  context.translate(translateX, translateY);

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
