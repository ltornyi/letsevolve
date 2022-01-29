export class Brain {
  private _numInputs: number;
  private _hiddenBias: number[];
  private _outputBias: number[];
  private _axons1: number[][];
  private _axons2: number[][];

  private _inputs: number[];
  private _hidden: number[];
  private _outputs: number[];

  static sigmoid(inputs: number[], weights: number[], bias: number) {
    const weightedSum = inputs.reduce((acc, curr, ind) => acc + curr * weights[ind], 0);
    return 1.0/(1.0 + Math.exp(-weightedSum - bias))
  }

  mutate() {
    const copyBrain = new Brain(this);
    if (Math.random() < 0.1) {
      const hiddenPoint = Math.floor(Math.random() * copyBrain._hiddenBias.length);
      copyBrain._hiddenBias[hiddenPoint] += Math.random() * 2 - 1;
    }
    if (Math.random() < 0.1) {
      const outputPoint = Math.floor(Math.random() * copyBrain._outputBias.length);
      copyBrain._outputBias[outputPoint] += Math.random() * 2 - 1;
    }
    for (let i=0; i<copyBrain._numInputs; i++) {
      for (let j = 0; j<copyBrain.numHidden; j++) {
        if (Math.random() < 0.1) {
          copyBrain._axons1[i][j] += Math.random() * 2 - 1;
        }
      }
    }
    for (let i=0; i<copyBrain.numHidden; i++) {
      for (let j = 0; j<copyBrain.numOutputs; j++) {
        if (Math.random() < 0.1) {
          copyBrain._axons2[i][j] += Math.random() * 2 - 1;
        }
      }
    }
    return copyBrain;
  }

  constructor(brain?: Brain, numInputs?: number, hiddenBias?: number[], outputBias?: number[]) {
    if (brain) {
      this._numInputs = brain.numInputs;
      this._hiddenBias = brain.hiddenBias.slice();
      this._outputBias = brain.outputBias.slice();
      this._axons1 = [];
      for (let i=0; i<this._numInputs; i++)
        this._axons1.push(brain.axons1(i).slice());
      this._axons2 = [];
      for (let i=0; i<this.numHidden; i++)
        this._axons2.push(brain.axons2(i).slice());
    } else {
      this._numInputs = numInputs;
      this._hiddenBias = hiddenBias.slice();
      this._outputBias = outputBias.slice();
      this._axons1 = [];
      for (let i=0; i<this._numInputs; i++) {
        const xx: number[] = []
        for (let j = 0; j<this.numHidden; j++) {
          xx.push(Math.random() * 2 - 1);
        }
        this._axons1.push(xx);
      }
      this._axons2 = [];
      for (let i=0; i<this.numHidden; i++) {
        const xx: number[] = []
        for (let j = 0; j<this.numOutputs; j++) {
          xx.push(Math.random() * 2 - 1);
        }
        this._axons2.push(xx);
      }
    }
    this._inputs = [];
    this._inputs.length = this._numInputs;
    this._inputs.fill(0);
    this._hidden = [];
    this._hidden.length = this.numHidden;
    this._hidden.fill(0);
    this._outputs = [];
    this._outputs.length = this.numOutputs;
    this._outputs.fill(0);
  }

  get numInputs() {
    return this._numInputs;
  }

  get numHidden() {
    return this._hiddenBias.length;
  }

  get hiddenBias() {
    return this._hiddenBias;
  }

  get numOutputs() {
    return this._outputBias.length;
  }

  get outputBias() {
    return this._outputBias;
  }

  axons1(i: number) {
    return this._axons1[i];
  }

  axons2(h: number) {
    return this._axons2[h];
  }

  calcHidden() {
    for (let h=0; h < this.numHidden; h++) {
      const weights = [];
      for (let i=0; i<this._numInputs; i++) {
        weights.push(this._axons1[i][h])
      }
      const val = Brain.sigmoid(this._inputs, weights, this._hiddenBias[h])
      this._hidden[h] = val;
    }
  }

  calcOutputs() {
    for (let o = 0; o < this.numOutputs; o++) {
      const weights = [];
      for (let h=0; h<this.numHidden; h++) {
        weights.push(this._axons2[h][o])
      }
      const val = Brain.sigmoid(this._hidden, weights, this._outputBias[o])
      this._outputs[o] = val;
    }
  }

  applyInputs(inputs: number[]) {
    this._inputs = inputs.slice();
    this.calcHidden()
    this.calcOutputs()
  }

  get outputs() {
    return this._outputs;
  }

  get hidden() {
    return this._hidden;
  }
}