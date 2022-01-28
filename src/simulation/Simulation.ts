import { Graphics } from "../graphics/Graphics";
import { SimulationState } from "./SimulationState";
import { BehaviorSubject } from "../observable/BehaviourSubject";
import { World } from "../world/World";
import { Creature } from "../world/bio/Creature";

export class Simulation {
  private graphics: Graphics;
  state$: BehaviorSubject<SimulationState>;
  world$: BehaviorSubject<World>;

  constructor (canvas: HTMLCanvasElement) {
    this.world$ = new BehaviorSubject(new World());
    this.state$ = new BehaviorSubject(new SimulationState());
    this.graphics = new Graphics(canvas, this.world$.value.width, this.world$.value.height);
    this.initialPopulation();
  }

  initialPopulation() {
    for(let i=0; i<1000; i++) {
      this.world$.value.addRandomFood();
    }
    for(let i=0; i<100; i++) {
      const cr = Creature.randomCreature(this.world$.value);
      this.world$.value.addCreature(cr);
    }
  }

  draw() {
    if (this.state$.value.updateGraphics) {
      this.graphics.resizeCanvasToDisplaySize();
      this.graphics.clearCanvas();
      this.world$.value.food.forEach(f => this.graphics.dot(f.x, f.y, '#00FF00'))
      //TODO creature size to radius
      this.world$.value.creatures.forEach( cr => this.graphics.circle(cr.x, cr.y, cr.size, '#FF0000'))
    }
  }

  processTick() {
    this.world$.value.generateFood();
    this.world$.value.iterateCreatures(1);
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