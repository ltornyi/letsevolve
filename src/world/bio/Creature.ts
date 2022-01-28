import { Geom } from "../../utils/Geom";
import { Eye, Vision } from "./Eye";
import { World } from "../World";

export const NUMBER_OF_EYES = 4;
export const MOVEMENT_ENERGY_FACTOR = 1;
export const VISION_ENERGY_FACTOR = 1;
export const MAX_SPEED = 20;
export const MAX_ENERGY = 10e10;

export class Creature {
  x: number;
  y: number;
  private _size: number;
  private _eyes: Eye[]
  private _age: number;
  private _heading: number;
  private _currentSpeed: number;
  private _currentEnergy: number;

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
    const eye = new Eye(cr, 0, {viewAngle: Math.PI/10, viewDistance: 1});
    //starting with energy enough for 1000 steps
    let energy = 1000 * (MOVEMENT_ENERGY_FACTOR * Math.pow(speed, 2) * Math.pow(size, 3));
    energy += 1000 * VISION_ENERGY_FACTOR * eye.energyUsed(1)
    cr._currentEnergy = energy;
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

  eat(w: World) {
    const reach = this.size;
    const reach2 = this.size * this.size;
    //quick filtering to reduce calculation effort
    w.food.filter(food => 
      this.x - reach <= food.x && food.x <= this.x + reach &&
      this.y - reach <= food.y && food.y <= this.y + reach
    )
    .filter(food =>
      Geom.distance2(this, food) <= reach2
    ).forEach(food => {
      console.log('EATING');
      this.addEnergy(food.value);
      w.removeFood(food);
    });
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

  iterate(w: World, ticks: number) {
    //eat if food is nearby
    this.eat(w);

    //look around
    const vision = this.see(w, ticks);

    //think

    // apply brain output; accelerate and rotate
    this.accelerate(0, ticks);
    if (Math.random() < 0.1) {
      this.rotate(0.04, ticks);
    }
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
}