export type Point = {
  x: number,
  y: number
}

export class Geom {
  static distance2 = (p1: Point, p2: Point) => 
    (p2.x - p1.x)*(p2.x - p1.x) + (p2.y - p1.y)*(p2.y - p1.y);
  
  static endPoint = (start: Point, heading: number, radius: number) => {
    return {
      x: start.x + radius * Math.cos(heading),
      y: start.y + radius * Math.sin(heading),
    } as Point
  }

  //transform it to [-PI,PI]
  static normalizedAngle = (angle: number) => {
    let norm = angle % (2*Math.PI);
    if (norm > Math.PI) {
      norm -= 2 * Math.PI
    } else if (norm < -Math.PI) {
      norm += 2 * Math.PI
    }
    return norm
  }

  static heading(start: Point, end: Point) {
    let result = 0;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    //horizontal
    if (Math.abs(deltaX) < 0.00001) {
      result = deltaY > 0 ? Math.PI/2 : -Math.PI/2
    //vertical
    } else if (Math.abs(deltaY) < 0.00001) {
      result = deltaX > 0 ? 0 : Math.PI
    } else {
      result = Math.atan(deltaY/deltaX)
      if (deltaX < 0 ) {
        if (deltaY > 0) {
          result += Math.PI
        } else {
          result -= Math.PI
        }
      }
    }
    return result;
  }

  static isBetweenAngles(angle: number, startAngle: number, endAngle: number) {
    const a = Geom.normalizedAngle(angle);
    const s = Geom.normalizedAngle(startAngle);
    const e = Geom.normalizedAngle(endAngle);
    return (s <= a && a <= e)
  }

  static isInSector(p: Point, center: Point, startAngle: number, endAngle: number, radius: number) {
    const result = {inside: false, distance: 0, heading: 0};
    result.distance = Math.sqrt(Geom.distance2(p, center));
    if (result.distance <= radius) {
      result.heading = Geom.heading(center, p);
      result.inside = Geom.isBetweenAngles(result.heading, startAngle, endAngle);
    }
    return result;
  }
}