import { Creature } from "./Creature";
import { Eye } from "./Eye";
import { Food } from "../Food";
import { World } from "../World";

test('There is nothing in an empty world', () => {
  const w = new World();
  const thisCreature = new Creature(10, 10, 0, 0, 1000, null);
  const thisEye = new Eye(thisCreature, 0, {viewAngle: 2*Math.PI, viewDistance: 100})
  w.addCreature(thisCreature);
  const vision = thisEye.see(w);
  expect(vision.closestThing).toBeUndefined();
});

test('Cannot see food behind me', () => {
  const w = new World();
  const f = new Food(0,0,100);
  w.addFood(f);
  const thisCreature = new Creature(10, 10, 0, 0, 1000, null);
  const thisEye = new Eye(thisCreature, 0, {viewAngle: Math.PI/2, viewDistance: 100})
  w.addCreature(thisCreature);
  const vision = thisEye.see(w);
  expect(vision.closestThing).toBeUndefined();
});

test('Closest1', () => {
  const w = new World();
  const f1 = {x:15, y:10, value: 100};
  const f2 = {x:20, y:10, value: 100}
  w.addFood(f1);
  w.addFood(f2);
  const thisCreature = new Creature(10, 10, 0, 0, 1000, null);
  const thisEye = new Eye(thisCreature, 0, {viewAngle: Math.PI/2, viewDistance: 20})
  w.addCreature(thisCreature);

  let vision = thisEye.see(w);
  expect(vision.closestThing).toStrictEqual<Food>(f1);
  expect(vision.distance).toBeCloseTo(5);
  expect(vision.heading).toBeCloseTo(0);
  
  thisCreature.x = -4;
  vision = thisEye.see(w);
  expect(vision.closestThing).toStrictEqual<Food>(f1);
  expect(vision.distance).toBeCloseTo(19);
  expect(vision.heading).toBeCloseTo(0);

  thisCreature.x = -5;
  vision = thisEye.see(w);
  expect(vision.closestThing).toBeUndefined();
});
