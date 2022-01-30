import { ActivationFunction } from "./NeuralNetwork";

export const sigmoidActivation: ActivationFunction = (inputs, inputWeights, bias) => {
  const weightedInputsPlusBias = inputWeights.reduce((sum, weight, ind) => sum + weight * inputs[ind], bias);
  return 1/(1 + Math.exp(-weightedInputsPlusBias));
}