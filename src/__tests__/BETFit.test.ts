import BETFit from '../BETFit';
import { BETFunction, langmuirSingleFunction } from '../modelFunctions';

import { writeFileSync } from 'fs';
import { join } from 'path';

describe('test BET fit', () => {
  it('first dataSet', () => {
    let data = {
      x: [
        0.0171192,
        0.0586318,
        0.102329,
        0.211573,
        0.303338,
        0.412581,
        0.499976,
        0.60485,
        0.705355,
        0.801489,
        0.901993,
        0.998128,
      ],
      y: [
        20.6782,
        69.2916,
        102.611,
        143.577,
        168.157,
        188.367,
        199.838,
        212.947,
        223.325,
        230.972,
        237.527,
        242.443,
      ],
    };
    const R = 8.31446261815324; //m^3⋅Pa⋅K^−1⋅mol^−1

    let [V, s] = [(R * 273.15) / 1, 0.162 * Math.pow(10, -18)]; //s:[m^2]
    let results = BETFit(data, V, s);

    writeFileSync(
      join(__dirname, '../../examples/BETFit.json'),
      JSON.stringify({ x: data.x, y: results }),
    );
    //console.log(results);

    //debugging:
    //plotting p vs
    //let p0 = Math.max(...data.x);
    //let firstCriteria = (p: number, N: number) => N * p0 * (1 - p / p0); //p=data.x, N=data.y
    //let yFit = [];
    //for (let i = 0; i < data.x.length; i++) {
    //  yFit.push(firstCriteria(data.x[i], data.y[i]));
    //}
    //end of debugging

    //let yFit = data.x.map((item) => BETFunction(results.parameterValues)(item));
    //for (let i = 0; i < yFit.length; i++) {expect(Math.abs(yFit[i] - data.y[i])).toBeLessThan(0.9 * data.y[i]);}

    //writing results to plot
    //writeFileSync(join(__dirname, '../../examples/data.json'),JSON.stringify(data));

    //writeFileSync(join(__dirname, '../../examples/BETFit.json'),JSON.stringify({ x: data.x, y: yFit }));
  });
  it.only('simulated dataSet, test linear fit and deduced BET area', () => {
    let x = [
      0.0,
      0.5,
      1.0,
      1.5,
      2.0,
      2.5,
      3.0,
      3.5,
      4.0,
      4.5,
      5.0,
      5.5,
      6.0,
      6.5,
      7.0,
      7.5,
      8.0,
      8.5,
      9.0,
      9.5,
      10.0,
      10.5,
      11.0,
      11.5,
      12.0,
    ];
    let data: { x: number[]; y: number[] } = {
      x: x,
      y: x.map((item) => langmuirSingleFunction([2, 5])(item)),
    };
    data.y = data.y.map((item) => (randomGaussian() / 10 + 1) * item);
    const R = 8.31446261815324; //m^3⋅Pa⋅K^−1⋅mol^−1

    let [V, s] = [(R * 273.15) / 1, 0.162 * Math.pow(10, -18)]; //s:[m^2]
    let results = BETFit(data, V, s);
    console.log(results.SBET);

    //writeFileSync(join(__dirname, '../../examples/BETFit.json'),JSON.stringify(dataSet));

    //writing results to plot
    writeFileSync(
      join(__dirname, '../../examples/data.json'),
      JSON.stringify(data),
    );
    let simulated = data.x.map(
      (item) => item * results.regression.slope + results.regression.intercept,
    );
    writeFileSync(
      join(__dirname, '../../examples/BETFit.json'),
      JSON.stringify({ x: data.x, y: simulated }),
    );
  });
});
/**
 * Generates a random number following a normal distribution
 * @returns {number}  random number
 */
function randomGaussian() {
  return (
    Math.sqrt(-2 * Math.log(Math.random())) *
    Math.cos(2 * Math.PI * Math.random())
  );
}
