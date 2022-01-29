import { Brain } from "./Brain"

test('Sigmoid', () => {
  expect(Brain.sigmoid([0],[1],0)).toBeCloseTo(1/(1+Math.exp(0)));
  expect(Brain.sigmoid([1],[1],0)).toBeCloseTo(1/(1+Math.exp(-1)));
  expect(Brain.sigmoid([0.5, 1],[1, 1], 0)).toBeCloseTo(1/(1+Math.exp(-1.5)));
});

test('Brain, simplest', () => {
  const brain = new Brain(null, 1, [0], [0]);
  expect(brain.axons1(0).length).toBe(1);
  expect(brain.axons2(0).length).toBe(1);
  brain.applyInputs([0]);
  expect(brain.hidden.length).toBe(1);
  expect(brain.hidden[0]).toBeCloseTo(1/(1+Math.exp(0)));
})

test('Brain, counts', () => {
  const brain = new Brain(null, 2, [0,0,0], [0,0]);
  expect(brain.axons1(0).length).toBe(3);
  expect(brain.axons2(0).length).toBe(2);
})