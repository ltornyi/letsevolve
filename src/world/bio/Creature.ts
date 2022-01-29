import { Geom } from "../../utils/Geom";
import { Eye, Vision } from "./Eye";
import { World } from "../World";
import { Brain } from "./Brain";
import { Food } from "../Food";

export const NUMBER_OF_EYES = 4;
export const MOVEMENT_ENERGY_FACTOR = 1.0 / 1_000;
export const VISION_ENERGY_FACTOR = 1.0 / 5_000;
export const MAX_SPEED = 20;
export const MAX_ENERGY = 10e10;
export const REACH_FACTOR = 3;

export class Creature {
  x: number;
  y: number;
  private _size: number;
  private _eyes: Eye[]
  private _age: number;
  private _heading: number;
  private _currentSpeed: number;
  private _currentEnergy: number;
  private _brain: Brain;

  constructor(x: number, y: number, heading: number, speed: number, energy: number, size: number) {
    this.x = x;
    this.y = y;
    this._heading = heading;
    this._currentSpeed = speed;
    this._currentEnergy = energy;
    this._size = size;
    this._eyes = [];
    this._age = 0;
  }

  static randomCreature(w: World) {
    const x = Math.random() * w.width;
    const y = Math.random() * w.height;
    const heading = (Math.random() * 2 - 1) * Math.PI;
    const speed = 2;
    const size = 1;
    const cr = new Creature(x, y, heading, speed, 0, size);
    new Eye(cr, 0, {viewAngle: Math.PI/10, viewDistance: 1});
    new Eye(cr, Math.PI / 2, {viewAngle: Math.PI/10, viewDistance: 1});
    new Eye(cr, Math.PI, {viewAngle: Math.PI/10, viewDistance: 1});
    new Eye(cr, -Math.PI / 2, {viewAngle: Math.PI/10, viewDistance: 1});
    //starting with energy enough for 1000 steps
    // let energy = 1_000 * (MOVEMENT_ENERGY_FACTOR * Math.pow(speed, 2) * Math.pow(size, 3));
    // energy += 1_000 * VISION_ENERGY_FACTOR * eye.energyUsed(1)
    cr._currentEnergy = 10 * w.foodEnergyValue;
    cr.generateBrain();
    return cr;
  }

  addEye(e: Eye) {
    this._eyes.push(e);
  }

  get size() {
    return this._size;
  }

  get heading() {
    return this._heading;
  }

  get currentSpeed() {
    return this._currentSpeed;
  }

  get currentEnergy() {
    return this._currentEnergy;
  }

  get brain() {
    return this._brain;
  }

  set brain(b:Brain) {
    this._brain = b;
  }

  reach() {
    return REACH_FACTOR * this.size;
  }

  eat(w: World) {
    const reach = this.reach();
    const reach2 = reach * reach;
    //quick filtering to reduce calculation effort
    w.food.filter(food => 
      this.x - reach <= food.x && food.x <= this.x + reach &&
      this.y - reach <= food.y && food.y <= this.y + reach
    )
    .filter(food =>
      Geom.distance2(this, food) <= reach2
    ).forEach(food => {
      this.addEnergy(food.value);
      w.removeFood(food);
    });

    if (!w.peaceful) {
      w.creatures.filter(cr => 
        this.x - reach <= cr.x && cr.x <= this.x + reach &&
        this.y - reach <= cr.y && cr.y <= this.y + reach
      )
      //if I'm close and I'm 30% bigger, then I eat you
      .filter(cr =>
        (Geom.distance2(this, cr) <= reach2) && (this._size >= cr._size * 1.3 )
      ).forEach(cr => {
        this.addEnergy(cr._size * w.foodEnergyValue);
        w.removeCreature(cr);
      })
    }
  }

  addEnergy(value: number) {
    this._currentEnergy = Math.min(this._currentEnergy + value, MAX_ENERGY);
  }

  loseMovementEnergy(ticks: number) {
    //speed^2 * size^3
    this._currentEnergy -= MOVEMENT_ENERGY_FACTOR * this._currentSpeed * this._currentSpeed * Math.pow(this.size, 3) * ticks;
  }

  loseVisionEnergy(ticks: number) {
    this._currentEnergy -= VISION_ENERGY_FACTOR * this._eyes.reduce((acc, eye) => acc + eye.energyUsed(ticks), 0)
  }

  see(w: World, ticks: number): Vision[] {
    this.loseVisionEnergy(ticks);
    return this._eyes.map(eye => eye.see(w))
  }

  accelerate(change: number, ticks: number) {
    this._currentSpeed = Math.max(Math.min(this._currentSpeed + change * ticks, MAX_SPEED), -MAX_SPEED);
  }

  rotate(change: number, ticks: number) {
    this._heading += change * ticks;
  }

  generateBrain() {
    //4 input per eyes (what, size if creature, distance, heading)
    // + heading + speed + size
    const numInputs = this._eyes.length * 4 + 3;
    //2*input hidden
    const hiddenBias = [];
    hiddenBias.length = 2 * numInputs;
    hiddenBias.fill(0);
    //2 outputs (acceleration and rotation)
    this.brain = new Brain(null, numInputs, hiddenBias,[0,0]);
  }

  //0 if nothing, 0.5 if food, 1 if creature
  seenThingToInput(vision: Vision) {
    let input = 0;
    if (vision.closestThing) {
      input = (vision.closestThing instanceof Food) ? 0.5 : 1;
    }
    return input;
  }

  //0 if nothing, otherwise (my size)/(seen size)
  seenThingSizeToInput(vision: Vision) {
    let input = 0;
    if (vision.closestThing && vision.closestThing instanceof Creature) {
      input = Math.min(this._size / vision.closestThing.size / 2, 1);
    }
    return input;
  }

  //1 if nothing, otherwise distance mapped to (0,1); closer is smaller
  seenDistanceToInput(vision: Vision) {
    let result = 1;
    if (vision.closestThing) {
      result = Math.min(Math.atan(vision.distance / 20), 1);
    }
    return result;
  }

  //[-PI,PI] transformed to [0,1]
  headingToInput(h:number) {
    return (h / Math.PI + 1) / 2
  }

  //0 if nothing, otherwise heading mapped to (0,1)
  seenHeadingToInput(vision: Vision) {
    let result = 0;
    if (vision.closestThing) {
      result = this.headingToInput(vision.heading);
    }
    return result;
  }

  speedToInput(speed:number) {
    return speed/MAX_SPEED;
  }

  sizeToInput(size:number) {
    return Math.min(size/5, 1);
  }

  think(vision: Vision[]) {
    const inputs = [];
    this._eyes.forEach((eye, index) => {
      const v = vision[index];
      inputs.push(this.seenThingToInput(v));
      inputs.push(this.seenThingSizeToInput(v));
      inputs.push(this.seenDistanceToInput(v));
      inputs.push(this.seenHeadingToInput(v));
    })
    inputs.push(this.headingToInput(this._heading));
    inputs.push(this.speedToInput(this._currentSpeed));
    inputs.push(this.sizeToInput(this.size));

    this._brain.applyInputs(inputs);

    return this._brain.outputs;
  }

  iterate(w: World, ticks: number) {
    //eat if food/creature is nearby
    this.eat(w);

    //look around
    const vision = this.see(w, ticks);

    //think
    const outputs = this.think(vision);

    // apply brain output; accelerate and rotate
    this.accelerate(outputs[0] - 0.5, ticks);
    this.rotate(0.04 * (outputs[1] - 0.5), ticks);
  }

  move(w:World, ticks: number) {
    const {x: newX, y: newY} = w.bounded(
      this.x + this._currentSpeed * Math.cos(this.heading) * ticks,
      this.y + this._currentSpeed * Math.sin(this.heading) * ticks
    );
    this.x = newX;
    this.y = newY;
    this.loseMovementEnergy(ticks);
    this._age++
  }

  mutate(energyGiven: number) {
    const heading = (Math.random() * 2 - 1) * Math.PI;
    const newSize = Math.random() < 0.1 ? this.size * (Math.random()/2 + 0.75) : this.size;
    const newCr = new Creature(this.x, this.y, heading, this.currentSpeed, energyGiven, newSize);

    this._eyes.forEach(e => {
      const newEyeGenes = e.genes;
      newEyeGenes.viewAngle = Math.random() < 0.1 ? newEyeGenes.viewAngle * (Math.random()/2 + 0.75) : newEyeGenes.viewAngle;
      newEyeGenes.viewDistance = Math.random() < 0.1 ? newEyeGenes.viewDistance * (Math.random()/2 + 0.75) : newEyeGenes.viewDistance;
      new Eye(newCr, e.relativeDirection, newEyeGenes);
    })

    newCr.brain = this.brain.mutate();
    return newCr;
  }

  reproduce(w:World) {
    if (this._age > 500 && this._currentEnergy > 10 * w.foodEnergyValue) {
      const energyGiven = 5 * w.foodEnergyValue
      const child = this.mutate(energyGiven);
      this._currentEnergy -= energyGiven;
      return child;
    }
  }
}