import { Geom, Point } from "../../utils/Geom";
import { Creature } from "./Creature";
import { Food } from "../Food";
import { EyeGenes } from "./Genetics";
import { World } from "../World";

export type Vision = {
  closestThing?: Food|Creature,
  distance: number,
  heading: number
}

export class Eye {
  private owner: Creature;
  relativeDirection: number;
  private _genes: EyeGenes;
  private viewArea: number;

  constructor(owner: Creature, relativeDirection: number, genes: EyeGenes) {
    this.owner = owner;
    this.relativeDirection = relativeDirection;
    this._genes = genes;
    this.viewArea = Math.PI * genes.viewDistance * genes.viewDistance * (genes.viewAngle / (2 * Math.PI));
    this.owner.addEye(this);
  }

  get genes() {
    return this._genes;
  }

  energyUsed(ticks: number) {
    return this.viewArea * ticks;
  }

  angleOfVision() {
    return {
      startAngle: this.owner.heading + this.relativeDirection - this.genes.viewAngle / 2,
      endAngle: this.owner.heading + this.relativeDirection + this.genes.viewAngle / 2
    }
  }

  private getThingIfSeenAndCloser(point: Point, startAngle: number, endAngle: number, radius: number, distanceSofar: number, w: World) {
    const check = Geom.isInSector(point, this.owner, startAngle, endAngle, radius);
    const result: Vision = {distance: 10e10, heading: 0}
    if (check.inside && check.distance <= distanceSofar) {
      const thing = w.getThingAt(point.x, point.y);
      if (thing) {
        result.closestThing = thing;
        result.distance = check.distance;
        result.heading = check.heading;
      }
    }
    return result;
  }

  see(w: World): Vision {
    const {startAngle, endAngle} = this.angleOfVision();
    const viewDistance = this.owner.reach() + this.genes.viewDistance;
    const minX = this.owner.x - viewDistance;
    const maxX = this.owner.x + viewDistance;
    const minY = this.owner.y - viewDistance;
    const maxY = this.owner.y + viewDistance;
    let result: Vision = {distance: 10e10, heading: 0}
    for (let x = minX; x < maxX; x++) {
      for (let y = minY ; y < maxY; y++) {
        if ((x !== this.owner.x) || (y !== this.owner.y)) {
          const point = {x:x, y:y};
          const check = this.getThingIfSeenAndCloser(point, startAngle, endAngle, viewDistance, result.distance, w);
          if (check.closestThing) {
            result = check
          }
        }
      }
    }
    return result;
  }
}