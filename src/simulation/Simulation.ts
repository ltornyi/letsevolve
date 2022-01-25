import { Graphics } from "../graphics/Graphics";
import { SimulationState } from "./SimulationState";
import { BehaviorSubject } from "../observable/BehaviourSubject";
import { World } from "../world/World";

export class Simulation {
  private graphics: Graphics;
  state$: BehaviorSubject<SimulationState>;
  world$: BehaviorSubject<World>;

  constructor (canvas: HTMLCanvasElement) {
    this.world$ = new BehaviorSubject(new World());
    this.state$ = new BehaviorSubject(new SimulationState());
    this.graphics = new Graphics(canvas, this.world$.value.width, this.world$.value.height);
  }

  draw() {
    if (this.state$.value.updateGraphics) {
      this.graphics.resizeCanvasToDisplaySize();
      this.graphics.clearCanvas();
      this.world$.value.food.forEach(f => this.graphics.dot(f.x, f.y, '#00FF00'))
    }
  }

  processTick() {
    this.world$.value.generateFood();
    /*...*/
    this.draw();
  }

  animate() {
    this.processTick();
    if (this.state$.value.running) {
      requestAnimationFrame(() => this.animate());
    }
  }

  start() {
    this.state$.next({...this.state$.value, running: true});
    requestAnimationFrame(() => this.animate());
  }

  stop() {
    this.state$.next({...this.state$.value, running: false});
  }

  toggleUpdateGraphics() {
    this.state$.next({...this.state$.value, updateGraphics: !this.state$.value.updateGraphics})
  }

  doIterations(num: number) {
    for (let i=0; i<num; i++) {
      this.processTick();
    }
  }

  dump() {
    console.log(this.state$.value);
    console.log(this.world$.value);
  }
}