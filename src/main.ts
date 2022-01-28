import { Simulation } from "./simulation/Simulation";
import { SimulationState } from "./simulation/SimulationState";
import { Observer } from "./observable/BehaviourSubject";
import { DOM } from "./utils/Dom";

const simStateObserver: Observer<SimulationState> = {
  next: (simState) => {
    DOM.getStartButton().disabled = simState.running;
    DOM.getStopButton().disabled = !simState.running;
    DOM.getUpdGraphicsChk().checked = simState.updateGraphics;
  }
}

const init = async () => {
  const sim = new Simulation(DOM.getGameCanvas());
  sim.state$.subscribe(simStateObserver);
  sim.draw();

  window['mysim'] = sim;

  DOM.getStartButton().onclick = () => sim.start();
  DOM.getStopButton().onclick = () => sim.stop();
  DOM.getUpdGraphicsChk().onchange = () => sim.toggleUpdateGraphics();
  DOM.getDumpSimuButton().onclick = () => sim.dump();
}

document.addEventListener('DOMContentLoaded', init);
