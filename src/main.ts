import { Canvas, Scene } from "./canvas";
import { createScene, runScene, stopScene } from "./gameScene";
import { Game } from "./model/Game";
import "./style.css";

const startBtn = <HTMLButtonElement>document.getElementById("startBtn");
const stopBtn = <HTMLButtonElement>document.getElementById("stopBtn");

startBtn.addEventListener("click", runScene);
stopBtn.addEventListener("click", stopScene);

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
