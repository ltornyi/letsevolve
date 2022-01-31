import { Simulation } from "./simulation/Simulation";
import { SimulationState } from "./simulation/SimulationState";
import { Observer } from "./observable/BehaviourSubject";
import { DOM } from "./utils/Dom";
import { World } from "./world/World";
import { Geom } from "./utils/Geom";

const simStateObserver: Observer<SimulationState> = (simState) => {
  DOM.getStartButton().disabled = simState.running;
  DOM.getStopButton().disabled = !simState.running;
  DOM.getUpdGraphicsChk().checked = simState.updateGraphics;
}

const worldObserver: Observer<World> = (world) => {
  DOM.getFoodStatElem().innerHTML = world.food.length.toString();
  DOM.getCreaturesStatElem().innerHTML = world.creatures.length.toString();
}

const canvasClick = (ev: MouseEvent, sim: Simulation) => {
  const cursorXY = sim.graphics.getCursorPosition(ev);
  const clickedCreature = sim.world$.value.creatures.find(cr => {
    const creatureScreenXY = sim.graphics.calcXY(cr.x, cr.y);
    const creatureScreenRadius = sim.creatureSizeToRadius(cr.size);
    return Geom.distance2(cursorXY, creatureScreenXY) <= creatureScreenRadius*creatureScreenRadius
  });
  if (clickedCreature) {
    sim.selectCreature(clickedCreature);
  } else {
    sim.unSelectCreature();
  }
}

const init = async () => {
  const sim = new Simulation(DOM.getGameCanvas());
  sim.state$.subscribe(simStateObserver);
  sim.world$.subscribe(worldObserver);
  sim.draw();

  window['mysim'] = sim;

  DOM.getStartButton().onclick = () => sim.start();
  DOM.getStopButton().onclick = () => sim.stop();
  DOM.getUpdGraphicsChk().onchange = () => sim.toggleUpdateGraphics();
  DOM.getDumpSimuButton().onclick = () => sim.dump();

  DOM.getGameCanvas().onclick = (ev) => canvasClick(ev, sim)
}

document.addEventListener('DOMContentLoaded', init);
