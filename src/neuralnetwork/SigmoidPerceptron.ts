import { NeuralNetwork, NeuralNetworkStructure } from "./NeuralNetwork";
import { sigmoidActivation } from "./SigmoidActivation";

export class SigmoidPerceptron extends NeuralNetwork {
  constructor(structure: NeuralNetworkStructure) {
    super(structure, sigmoidActivation)
  }

  static createRandom = (inputSize: number, hiddenSizes: number[], outputSize: number) =>
    new SigmoidPerceptron(super.createRandomStructure(inputSize, hiddenSizes, outputSize));

}