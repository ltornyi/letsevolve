export const DOM = {
  getGameCanvas: () => document.getElementById('gamecanvas') as HTMLCanvasElement,
  getStartButton: () => document.getElementById('start') as HTMLButtonElement,
  getStopButton: () => document.getElementById('stop') as HTMLButtonElement,
  getUpdGraphicsChk: () => document.getElementById('updategraphicschk') as HTMLInputElement,
  getDumpSimuButton: () => document.getElementById('dumpsimu') as HTMLButtonElement,
}