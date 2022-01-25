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
  foodEnergyValue = 100;

  food: Food[] = [];

  addFood(x: number, y: number, energy: number) {
    this.food.push(new Food(x, y, energy));
  }

  generateFood() {
    if (Math.random() <= this.foodProbability) {
      const foodX = Math.random() * this.foodTargetArea.w + this.foodTargetArea.x;
      const foodY = Math.random() * this.foodTargetArea.h + this.foodTargetArea.y;
      this.addFood(foodX, foodY, this.foodEnergyValue);
    }
  }
}