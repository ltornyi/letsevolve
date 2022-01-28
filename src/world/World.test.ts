import { Creature } from "./bio/Creature";
import { Food } from "./Food";
import { World } from "./World"

test('getThingAt', () => {
  const w = new World();
  const f1 = new Food(10, 10, 100);
  const f2 = new Food(20, 20, 100);
  const c1 = new Creature(10, 10, 0, 0, 1000, null);
  const c2 = new Creature(15, 15, 0, 0, 1000, null);
  w.addFood(f1);
  w.addFood(f2);
  w.addCreature(c1);
  w.addCreature(c2);
  expect(w.getThingAt(0,0)).toBeUndefined();
  expect(w.getThingAt(10,10)).toStrictEqual(c1);
  expect(w.getThingAt(10,11)).toBeUndefined();
  expect(w.getThingAt(15,15)).toStrictEqual(c2);
  expect(w.getThingAt(20,20)).toStrictEqual(f2);
})