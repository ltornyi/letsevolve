export type ActivationFunction = (inputs: Float32Array, inputWeights: Float32Array, bias: number) => number

export type NeuralNetworkLayer = {
  biases: Float32Array,
  inputWeights: Float32Array[]
}

export type NeuralNetworkStructure = {
  inputSize: number,
  hiddenLayers: NeuralNetworkLayer[],
  outputLayer: NeuralNetworkLayer
}

export class NeuralNetwork {
  structure: NeuralNetworkStructure;
  activationFunction: ActivationFunction;

  //convenience
  inputSize: number;
  hiddenLayerCount: number;
  hiddenLayerSizes: number[];
  outputSize: number;

  //output arrays for each layer
  layerOutputs: Float32Array[];

  constructor(structure: NeuralNetworkStructure, activationFunction: ActivationFunction) {
    this.structure = structure;
    this.activationFunction = activationFunction;

    this.inputSize = structure.inputSize;
    this.hiddenLayerCount = structure.hiddenLayers.length;
    this.hiddenLayerSizes = structure.hiddenLayers.map(layer => layer.biases.length);
    this.outputSize = structure.outputLayer.biases.length;

    this.resetLayerOutputs();
  }

  static randomWeight = () => Math.random() * 0.4 - 0.2;

  static createRandomLayer = (prevLayerSize: number, layerSize: number): NeuralNetworkLayer => {
    const biases = new Float32Array(layerSize).map(_ => NeuralNetwork.randomWeight());
    const inputWeights = Array.from(Array(layerSize))
      .map(_ => new Float32Array(prevLayerSize).map(_ => NeuralNetwork.randomWeight())
    );
    return {
      biases,
      inputWeights
    }
  }

  static createRandomStructure = (inputSize: number, hiddenSizes: number[], outputSize: number): NeuralNetworkStructure => {
    const hiddenLayers: NeuralNetworkLayer[] = [];
    let prevLayerSize = inputSize;
    for (let i = 0; i < hiddenSizes.length; i++) {
      hiddenLayers.push(NeuralNetwork.createRandomLayer(prevLayerSize, hiddenSizes[i]));
      prevLayerSize = hiddenSizes[i];
    }
    const outputLayer = NeuralNetwork.createRandomLayer(prevLayerSize, outputSize);
    return {
      inputSize,
      hiddenLayers,
      outputLayer
    }
  }

  resetLayerOutputs() {
    this.layerOutputs = [];
    this.layerOutputs[0] = new Float32Array(this.inputSize);
    for (let h = 0; h < this.hiddenLayerCount; h++) {
      this.layerOutputs[h + 1] = new Float32Array(this.hiddenLayerSizes[h]);
    }
    this.layerOutputs[this.hiddenLayerCount + 1] = new Float32Array(this.outputSize);
  }

  feedPrevInputsIntoLayer(layerNum: number, layer: NeuralNetworkLayer) {
    const prevOutputs = this.layerOutputs[layerNum - 1];
    const currentOutputs = this.layerOutputs[layerNum];
    layer.biases.forEach((bias, index) => {
      currentOutputs[index] = this.activationFunction(prevOutputs, layer.inputWeights[index], bias)
    })
  }

  activate(inputValues: Float32Array) {
    this.resetLayerOutputs();
    //inputs output what was given:
    this.layerOutputs[0] = inputValues.slice();
    //feed the outputs of the previous layer into the current layer
    for(let h = 0; h < this.hiddenLayerCount; h++) {
      this.feedPrevInputsIntoLayer(h + 1, this.structure.hiddenLayers[h])
    }
    //feed the outputs of the last hidden layer into the output layer
    this.feedPrevInputsIntoLayer(this.hiddenLayerCount + 1, this.structure.outputLayer)
    return this.layerOutputs[this.hiddenLayerCount + 1];
  }
}