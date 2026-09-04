import { ArgoFloat, ValidationMetricSet } from '../types/ocean';
import { predictSubsurfaceTemperature } from './predictionService';

export function calculateValidationForFloat(float: ArgoFloat): ValidationMetricSet {
  // Run prediction with float's coordinates and surface observed parameters
  const pred = predictSubsurfaceTemperature({
    latitude: float.lat,
    longitude: float.lon,
    date: float.date,
    sst: float.sst_observed,
    sss: float.sss_observed,
    ssh: float.sla_observed
  });

  const depths = [0, 50, 100, 200, 500, 1000, 1500, 2000];
  const depthBreakdown: ValidationMetricSet['depthBreakdown'] = [];

  let sumAbsErr = 0;
  let sumSqErr = 0;
  const obsList: number[] = [];
  const predList: number[] = [];

  depths.forEach((d) => {
    // find matching observed point
    const obsPoint = float.profile.find((p) => Math.abs(p.depth - d) < 25) || float.profile[0];
    const predPoint = pred.profile.find((p) => p.depth === d) || pred.profile[0];

    const obs = obsPoint.temperature;
    const prd = predPoint.temperature;
    const err = prd - obs;
    const absErr = Math.abs(err);

    sumAbsErr += absErr;
    sumSqErr += err * err;
    obsList.push(obs);
    predList.push(prd);

    depthBreakdown.push({
      depth: d,
      observed: obs,
      predicted: prd,
      error: Number(err.toFixed(2)),
      absError: Number(absErr.toFixed(2))
    });
  });

  const n = depths.length;
  const mae = sumAbsErr / n;
  const rmse = Math.sqrt(sumSqErr / n);

  // R2 Score
  const meanObs = obsList.reduce((a, b) => a + b, 0) / n;
  const ssTot = obsList.reduce((acc, o) => acc + Math.pow(o - meanObs, 2), 0);
  const ssRes = sumSqErr;
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0.98;

  // Pearson Correlation
  const meanPred = predList.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den1 = 0;
  let den2 = 0;
  for (let i = 0; i < n; i++) {
    const diffP = predList[i] - meanPred;
    const diffO = obsList[i] - meanObs;
    num += diffP * diffO;
    den1 += diffP * diffP;
    den2 += diffO * diffO;
  }
  const corr = den1 > 0 && den2 > 0 ? num / Math.sqrt(den1 * den2) : 0.99;

  return {
    status: 'PROTOTYPE / DEMONSTRATION METRICS',
    disclaimer: 'Metrics computed on prototype comparison set. Prediction service is modular and can be replaced with the trained ConvFormer model.',
    floatId: float.wmo_id,
    sampleCount: n,
    rmse: Number(rmse.toFixed(3)),
    mae: Number(mae.toFixed(3)),
    r2Score: Number(r2.toFixed(4)),
    correlation: Number(corr.toFixed(4)),
    depthBreakdown
  };
}
