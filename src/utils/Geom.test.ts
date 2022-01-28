import { Geom } from "../utils/Geom";

test('normalizedAngle', () => {
  expect(Geom.normalizedAngle(0)).toBe(0);
  expect(Geom.normalizedAngle(Math.PI/4)).toBeCloseTo(Math.PI/4);
  expect(Geom.normalizedAngle(Math.PI)).toBeCloseTo(Math.PI);
  expect(Geom.normalizedAngle(Math.PI+0.0001)).toBeCloseTo(-Math.PI);
  expect(Geom.normalizedAngle(3*Math.PI/2)).toBeCloseTo(-Math.PI/2);
  expect(Geom.normalizedAngle(-Math.PI/2)).toBeCloseTo(-Math.PI/2);
  expect(Geom.normalizedAngle(-Math.PI-0.0001)).toBeCloseTo(Math.PI);
  expect(Geom.normalizedAngle(-3*Math.PI/2)).toBeCloseTo(Math.PI/2);
});

test('heading', () => {
  expect(Geom.heading({x:0, y:0}, {x:1, y:0})).toBeCloseTo(0)
  expect(Geom.heading({x:0, y:0}, {x:1, y:1})).toBeCloseTo(Math.PI/4)
  expect(Geom.heading({x:0, y:0}, {x:0, y:1})).toBeCloseTo(Math.PI/2)
  expect(Geom.heading({x:0, y:0}, {x:-1, y:1})).toBeCloseTo(3*Math.PI/4)
  expect(Geom.heading({x:0, y:0}, {x:-1, y:0})).toBeCloseTo(Math.PI)
  expect(Geom.heading({x:0, y:0}, {x:-1, y:-1})).toBeCloseTo(-3*Math.PI/4)
  expect(Geom.heading({x:0, y:0}, {x:0, y:-1})).toBeCloseTo(-Math.PI/2)
  expect(Geom.heading({x:0, y:0}, {x:1, y:-1})).toBeCloseTo(-Math.PI/4)
});

test('isBetweenAngles', () => {
  expect(Geom.isBetweenAngles(0, -Math.PI, Math.PI)).toBe(true);
  expect(Geom.isBetweenAngles(0, -Math.PI/2, Math.PI/2)).toBe(true);
  expect(Geom.isBetweenAngles(Math.PI/2, -Math.PI/4, Math.PI/4)).toBe(false);
});

test('isInSector', () => {
  const p = {x:10, y:0};
  const center = {x:0, y:0};
  let check = Geom.isInSector(p, center, -Math.PI/4, Math.PI/4, 10);
  expect(check).toStrictEqual({inside: true, distance: 10, heading: 0});
  check = Geom.isInSector(p, center, -Math.PI/4, Math.PI/4, 9);
  expect(check).toStrictEqual({inside: false, distance: 10, heading: 0});
  check = Geom.isInSector(p, center, Math.PI/4, Math.PI/2, 10);
  expect(check).toStrictEqual({inside: false, distance: 10, heading: 0});
});