import { nelderMead } from 'fmin';
import initialGuess from './loss/initialGuess';
import lossFunction from './loss/lossFunction';
import getnlnP from './getlnP';
import SimpleLinearRegression from 'ml-regression-simple-linear';
import getConstants from '../variousTools/getConstants';

/**
 * evaluates the isosteric heat of adsorption using the langmuir equation on the isotherm's real data. Takes pressures from 3 isotherms as an input
 * @param {Array} data array of all the data set objects
 * @param {string} functionName string containing the name of the desired function
 * @returns {Number} isosteric heat of adsorption
 */
export default function isostericHeatFromData(
  data: any[],
  functionName: string,
) {
  if (data.length < 2) {
    throw 'isostericHeat: there are not enough data sets to compute isosteric heat, at least 2 data sets needed';
  }

  let regression: any;
  let R = getConstants('R');

  let parameters = initialGuess(data, functionName);
  //params: [kh1, kh2, kh3,...,nm]
  let fittedParameters = nelderMead(
    lossFunction(data, functionName),
    parameters,
  );

  let loadings = getnlnP(data, functionName, fittedParameters.x);
  let inverseTemperatures = [];
  for (let dataSet of data) {
    inverseTemperatures.push(1 / dataSet.T);
  }
  let lnP: number[] = [];
  let deltaH = [];
  for (let i = 0; i < data[0].lnP.length; i++) {
    lnP = [];
    for (let dataSet of data) {
      lnP.push(dataSet.lnP[i]);
    }
    regression = new SimpleLinearRegression(inverseTemperatures, lnP);

    deltaH.push(regression.slope);
  }
  //console.log(loadings, data[0].lnP);
  deltaH = deltaH.map((x) => x * R);

  return [loadings, deltaH];
}
