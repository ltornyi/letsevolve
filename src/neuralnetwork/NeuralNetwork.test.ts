import { NeuralNetwork, NeuralNetworkLayer, NeuralNetworkStructure } from "./NeuralNetwork";
import { sigmoidActivation } from "./SigmoidActivation";

test('NeuralNetwork 1-1-1 sigmoid', () => {
  const inputSize = 1;
  const hiddenLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(1).fill(1)]
  }
  const outputLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(1).fill(1)]
  }
  const networkStucture: NeuralNetworkStructure = {
    inputSize: inputSize,
    hiddenLayers: [hiddenLayer],
    outputLayer: outputLayer
  }
  const network = new NeuralNetwork(networkStucture, sigmoidActivation)
  expect(network.activationFunction).toBe(sigmoidActivation);
  expect(network.structure).toStrictEqual<NeuralNetworkStructure>(networkStucture);

  expect(network.inputSize).toBe(inputSize);
  expect(network.hiddenLayerCount).toBe(1);
  expect(network.hiddenLayerSizes).toEqual([1]);
  expect(network.outputSize).toBe(1);

  expect(network.layerOutputs.length).toBe(3);

  const oneZeroOutput = new Float32Array(1);
  expect(network.layerOutputs[0]).toEqual(oneZeroOutput);
  expect(network.layerOutputs[1]).toEqual(oneZeroOutput);
  expect(network.layerOutputs[2]).toEqual(oneZeroOutput);
});

test('NeuralNetwork 3-2-1 sigmoid', () => {
  const inputSize = 3;
  const hiddenLayer: NeuralNetworkLayer = {
    biases: new Float32Array(2),
    inputWeights: [new Float32Array(3).fill(1), new Float32Array(3).fill(1)]
  }
  const outputLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(2).fill(1)]
  }
  const networkStucture: NeuralNetworkStructure = {
    inputSize: inputSize,
    hiddenLayers: [hiddenLayer],
    outputLayer: outputLayer
  }
  const network = new NeuralNetwork(networkStucture, sigmoidActivation)
  expect(network.activationFunction).toBe(sigmoidActivation);
  expect(network.structure).toStrictEqual<NeuralNetworkStructure>(networkStucture);

  expect(network.inputSize).toBe(inputSize);
  expect(network.hiddenLayerCount).toBe(1);
  expect(network.hiddenLayerSizes).toEqual([2]);
  expect(network.outputSize).toBe(1);

  expect(network.layerOutputs.length).toBe(3);

  const oneZeroOutput = new Float32Array(1);
  const twoZeroOutput = new Float32Array(2);
  const threeZeroOutput = new Float32Array(3);
  expect(network.layerOutputs[0]).toEqual(threeZeroOutput);
  expect(network.layerOutputs[1]).toEqual(twoZeroOutput);
  expect(network.layerOutputs[2]).toEqual(oneZeroOutput);
});

test('NeuralNetwork 1-1-1 sigmoid, all weights 1, all biases 0, activated with 1', () => {
  const inputSize = 1;
  const hiddenLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(1).fill(1)]
  }
  const outputLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(1).fill(1)]
  }
  const networkStucture: NeuralNetworkStructure = {
    inputSize: inputSize,
    hiddenLayers: [hiddenLayer],
    outputLayer: outputLayer
  }
  const network = new NeuralNetwork(networkStucture, sigmoidActivation);
  const output = network.activate(new Float32Array(1).fill(1.0));
  expect(network.layerOutputs[2]).toBe(output);
  
  const one1Output = new Float32Array(1).fill(1.0);
  expect(network.layerOutputs[0]).toEqual(one1Output);
  const sigmoidMinus1 = 1/(1+Math.exp(-1));
  expect(network.layerOutputs[1]).toEqual(new Float32Array(1).fill(sigmoidMinus1));
  const sigSig = 1/(1+Math.exp(-sigmoidMinus1));
  expect(network.layerOutputs[2]).toEqual(new Float32Array(1).fill(sigSig));
});

test('NeuralNetwork 3-2-1 sigmoid, all weights 1, all biases 0, activated with 1', () => {
  const inputSize = 3;
  const hiddenLayer: NeuralNetworkLayer = {
    biases: new Float32Array(2),
    inputWeights: [new Float32Array(3).fill(1), new Float32Array(3).fill(1)]
  }
  const outputLayer: NeuralNetworkLayer = {
    biases: new Float32Array(1),
    inputWeights: [new Float32Array(2).fill(1)]
  }
  const networkStucture: NeuralNetworkStructure = {
    inputSize: inputSize,
    hiddenLayers: [hiddenLayer],
    outputLayer: outputLayer
  }
  const network = new NeuralNetwork(networkStucture, sigmoidActivation);
  const output = network.activate(new Float32Array(3).fill(1.0));
  expect(network.layerOutputs[2]).toBe(output);
  
  const three1Output = new Float32Array(3).fill(1.0);
  expect(network.layerOutputs[0]).toEqual(three1Output);
  const sigmoidMinus3 = 1/(1+Math.exp(-3));
  expect(network.layerOutputs[1]).toEqual(new Float32Array(2).fill(sigmoidMinus3));
  const sigSig = 1/(1+Math.exp(-2*sigmoidMinus3));
  expect(network.layerOutputs[2]).toEqual(new Float32Array(1).fill(sigSig));
});