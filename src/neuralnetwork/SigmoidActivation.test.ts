import { sigmoidActivation } from "./SigmoidActivation";

test('SigmoidActivation 0 input, 1 weight, 0 bias', () => {
  const result = sigmoidActivation(new Float32Array(1), new Float32Array(1).fill(1), 0)
  expect(result).toBeCloseTo(1/(1+Math.exp(0)));
});

test('SigmoidActivation 1 input, 1 weight, 0 bias', () => {
  const result = sigmoidActivation(new Float32Array(1).fill(1), new Float32Array(1).fill(1), 0)
  expect(result).toBeCloseTo(1/(1+Math.exp(-1)));
});

test('SigmoidActivation, more complex', () => {
  //0, 0.25, 0.5, 0.75
  const inputs = new Float32Array(4).map((_, index) => index * 0.25);
  //-0.4, -0.2, 0, 0.2
  const weights = new Float32Array(4).map((_, index) => (index - 2) * 0.2 );
  const result = sigmoidActivation(inputs, weights, -2)
  const sum = 0 + 0.25 * (-0.2) + 0 + 0.75 * 0.2 - 2;
  expect(result).toBeCloseTo(1/(1+Math.exp(-sum)));
});