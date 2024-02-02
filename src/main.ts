import { Canvas, Scene } from "./canvas";
import { createScene, runScene, stopScene } from "./gameScene";
import { Game } from "./model/Game";
import "./style.css";

function setButtonState(
  button: HTMLButtonElement,
  state: "active" | "disabled"
) {
  if (state === "disabled") {
    button.classList.add("bg-slate-400");
    button.classList.add("hover:bg-slate-500");
    return;
  }

  button.classList.remove("bg-slate-400");
  button.classList.remove("hover:bg-slate-500");
}

const startBtn = <HTMLButtonElement>document.getElementById("startBtn");
const stopBtn = <HTMLButtonElement>document.getElementById("stopBtn");
  setButtonState(stopBtn, "disabled");

startBtn.addEventListener("click", () => {
  runScene();
  setButtonState(startBtn, "disabled");
  setButtonState(stopBtn, "active");
});
stopBtn.addEventListener("click", () => {
  stopScene();
  setButtonState(startBtn, "active");
  setButtonState(stopBtn, "disabled");
});

const height = 100;
const width = 100;

const game = new Game({ width, height });
const scene: Scene = createScene(game, 8, 2);
const canvas = new Canvas("canvas", scene);

runAnimation();

function runAnimation() {
  canvas.animateScene();
  window.requestAnimationFrame(() => runAnimation());
}
