import { Graphics } from "../graphics/Graphics";
import { SimulationState } from "./SimulationState";
import { BehaviorSubject } from "../observable/BehaviourSubject";
import { World } from "../world/World";
import { Creature } from "../world/bio/Creature";

export class Simulation {
  private _graphics: Graphics;
  private _selectedCreature: Creature;
  state$: BehaviorSubject<SimulationState>;
  world$: BehaviorSubject<World>;

  constructor (canvas: HTMLCanvasElement) {
    this.world$ = new BehaviorSubject(new World());
    this.state$ = new BehaviorSubject(new SimulationState());
    this._graphics = new Graphics(canvas, this.world$.value.width, this.world$.value.height);
    this._selectedCreature = null;
    this.initialPopulation();
  }

  get graphics() {
    return this._graphics;
  }

  selectCreature(cr: Creature) {
    this._selectedCreature = cr;
    this.draw();
  }

  unSelectCreature() {
    this._selectedCreature = null;
  }

  initialPopulation() {
    for(let i=0; i<1000; i++) {
      this.world$.value.addRandomFood();
    }
    for(let i=0; i<100; i++) {
      const cr = Creature.randomCreature(this.world$.value);
      this.world$.value.addCreature(cr);
    }
    //TODO deep copy
    this.world$.next(this.world$.value)
  }

  //TODO creature size to radius
  creatureSizeToRadius(size: number) {
    return size;
  }

  draw() {
    if (this.state$.value.updateGraphics) {
      this._graphics.resizeCanvasToDisplaySize();
      this._graphics.clearCanvas();
      this.world$.value.food.forEach(f => this._graphics.dot(f.x, f.y, '#00FF00'))
      
      this.world$.value.creatures.forEach(cr => {
        const stroke = cr === this._selectedCreature ? '#000000' : null;
        this._graphics.circle(cr.x, cr.y, this.creatureSizeToRadius(cr.size), '#FF0000', stroke)
      })
    }
  }

  processTick() {
    this.world$.value.generateFood();
    this.world$.value.iterateCreatures(1);
    //TODO deep copy
    this.world$.next(this.world$.value);
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