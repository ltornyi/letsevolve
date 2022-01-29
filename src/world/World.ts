import { Creature } from "./bio/Creature";
import { Food } from "./Food";

export class World {
  width = 2000;
  height = 1000;
  foodTargetArea = {
    x: 0,
    y: 0,
    w: 2000,
    h: 1000
  };
  foodProbability = 1;
  foodEnergyValue = 500;
  peaceful = true;

  food: Food[] = [];
  creatures: Creature[] = [];

  addFood(f: Food) {
    this.food.push(f);
  }

  addCreature(cr: Creature) {
    this.creatures.push(cr);
  }

  removeCreature(cr: Creature) {
    this.creatures = this.creatures.filter(c => c !== cr);
  }

  getThingAt(x: number, y: number) {
    const creature = this.creatures.find(cr => cr.x === x && cr.y === y);
    if (creature) {
      return creature
    } else {
      return this.food.find(f => f.x === x && f.y === y)
    }
  }

  removeFood(f: Food) {
    this.food = this.food.filter(ff => ff !== f)
  }

  bounded(x: number, y: number) {
    return {
      x: Math.min(Math.max(0, x), this.width),
      y: Math.min(Math.max(0, y), this.height),
    }
  }

  addRandomFood() {
    const foodX = Math.random() * this.foodTargetArea.w + this.foodTargetArea.x;
    const foodY = Math.random() * this.foodTargetArea.h + this.foodTargetArea.y;
    this.addFood(new Food(foodX, foodY, this.foodEnergyValue));
  }

  generateFood() {
    if (Math.random() <= this.foodProbability) {
      this.addRandomFood();
    }
  }

  iterateCreatures(ticks: number) {
    this.creatures.forEach(cr => cr.iterate(this, ticks));
    this.creatures.forEach(cr => cr.move(this, ticks));
    this.creatures = this.creatures.filter(c => c.currentEnergy > 0);
    this.creatures.forEach(cr => {
      const child = cr.reproduce(this);
      if (child) {
        this.addCreature(child);
      }
    });
  }
}