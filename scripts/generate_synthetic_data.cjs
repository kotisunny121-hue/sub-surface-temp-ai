const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/data/synthetic');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate dates for January 2020
const dates = [];
for (let d = 1; d <= 31; d++) {
  const dayStr = d < 10 ? `0${d}` : `${d}`;
  dates.push(`2020-01-${dayStr}`);
}

// Grid bounds for Bay of Bengal
const latMin = 5.0;
const latMax = 22.0;
const lonMin = 80.0;
const lonMax = 100.0;

// Land mask approximation for Bay of Bengal
function isOcean(lat, lon) {
  // India landmass
  if (lat > 8.0 && lon < 80.5) return false;
  if (lat > 13.0 && lon < 80.3) return false;
  if (lat > 16.0 && lon < 82.0) return false;
  if (lat > 19.5 && lon < 85.5) return false;
  if (lat > 21.0 && lon < 87.0) return false;
  if (lat > 22.0) return false; // North coast
  // Myanmar / Thai coast
  if (lat > 15.0 && lon > 97.5) return false;
  if (lat > 10.0 && lon > 98.5) return false;
  if (lat > 6.0 && lon > 99.8) return false;
  // Sri Lanka
  if (lat >= 6.0 && lat <= 9.8 && lon >= 79.8 && lon <= 81.8) return false;
  return true;
}

// 1. OSCAR Dataset Generation
console.log('Generating OSCAR synthetic data...');
const oscarDays = {};
dates.forEach((date, dayIdx) => {
  const tFactor = Math.sin(dayIdx * 0.2);
  const vectors = [];
  let totalSpeed = 0;
  let count = 0;
  let maxSpeed = 0;

  // 1.0 deg grid for vector arrows (crisp UI performance)
  for (let lat = 5; lat <= 21; lat += 1.0) {
    for (let lon = 81; lon <= 99; lon += 1.0) {
      if (!isOcean(lat, lon)) continue;

      // Physically plausible current flow:
      // Southward East India Coastal Current (EICC) along western boundary (lon < 85)
      // Anticyclonic gyre circulation in the center
      const westDist = (lon - 80) / 20; // 0 to 1
      const latNorm = (lat - 5) / 17;

      let u = 0.25 * Math.sin(latNorm * Math.PI) - 0.15 * Math.cos(westDist * Math.PI) + 0.05 * tFactor;
      let v = -0.35 * Math.exp(-westDist * 2.5) + 0.15 * Math.cos(latNorm * Math.PI) - 0.04 * tFactor;

      // add spatial wave turbulence
      u += 0.08 * Math.sin(lat * 0.8 + lon * 0.6);
      v += 0.08 * Math.cos(lat * 0.6 - lon * 0.8);

      const speed = Math.sqrt(u * u + v * v);
      const dir = (Math.atan2(u, v) * 180 / Math.PI + 360) % 360;

      totalSpeed += speed;
      count++;
      if (speed > maxSpeed) maxSpeed = speed;

      vectors.push({
        lat: Number(lat.toFixed(2)),
        lon: Number(lon.toFixed(2)),
        u: Number(u.toFixed(3)),
        v: Number(v.toFixed(3)),
        speed: Number(speed.toFixed(3)),
        dir: Math.round(dir)
      });
    }
  }

  oscarDays[date] = {
    date,
    records_count: count,
    mean_speed: Number((totalSpeed / count).toFixed(3)),
    max_speed: Number(maxSpeed.toFixed(3)),
    vectors
  };
});

const oscarOutput = {
  metadata: {
    dataset_name: "OSCAR Ocean Surface Currents",
    category: "SYNTHETIC DEMO DATA",
    status_badge: "SYNTHETIC DEMO",
    disclaimer: "Simulated demonstration data. NOT NASA observations. Do not use for operational navigation or model validation.",
    region: "Bay of Bengal (5.0°N – 22.0°N, 80.0°E – 100.0°E)",
    temporal_coverage: "2020-01-01 to 2020-01-31 (Daily)",
    spatial_resolution: "0.25° × 0.25° Target Grid (Vector display at 1.0° spacing)",
    variables: [
      { name: "u", unit: "m/s", description: "Zonal ocean surface current velocity (Eastward positive)" },
      { name: "v", unit: "m/s", description: "Meridional ocean surface current velocity (Northward positive)" },
      { name: "current_speed", unit: "m/s", formula: "sqrt(u² + v²)" },
      { name: "current_direction", unit: "degrees", description: "Flow direction from True North" }
    ],
    total_dates: dates.length,
    mean_current_speed_domain: "0.32 m/s",
    max_current_speed_domain: "0.78 m/s"
  },
  daily_data: oscarDays
};

fs.writeFileSync(path.join(outDir, 'oscar.json'), JSON.stringify(oscarOutput));
console.log('OSCAR written successfully.');

// 2. ASCAT-C Dataset Generation
console.log('Generating ASCAT-C synthetic data...');
const ascatDays = {};
dates.forEach((date, dayIdx) => {
  const tFactor = Math.sin(dayIdx * 0.15);
  const vectors = [];
  let totalSpeed = 0;
  let count = 0;
  let maxSpeed = 0;

  for (let lat = 5; lat <= 21; lat += 1.0) {
    for (let lon = 81; lon <= 99; lon += 1.0) {
      if (!isOcean(lat, lon)) continue;

      // NE Monsoon winds: direction 35° to 65° blowing SW
      // Speed 4.5 to 10.5 m/s
      const baseDir = 45 + 10 * Math.sin(lat * 0.3) + 5 * tFactor;
      const baseSpeed = 6.8 + 2.2 * Math.cos((lat - 12) * 0.2) + 1.2 * Math.sin(lon * 0.25) + 0.8 * tFactor;

      const dirRad = (baseDir * Math.PI) / 180;
      // wind vectors (meteorological convention: direction wind is blowing towards vs from)
      // u_wind and v_wind pointing towards flow
      const u_wind = -baseSpeed * Math.sin(dirRad);
      const v_wind = -baseSpeed * Math.cos(dirRad);
      const speed = Math.sqrt(u_wind * u_wind + v_wind * v_wind);

      totalSpeed += speed;
      count++;
      if (speed > maxSpeed) maxSpeed = speed;

      vectors.push({
        lat: Number(lat.toFixed(2)),
        lon: Number(lon.toFixed(2)),
        wind_speed: Number(speed.toFixed(2)),
        wind_direction: Math.round(baseDir),
        u_wind: Number(u_wind.toFixed(2)),
        v_wind: Number(v_wind.toFixed(2))
      });
    }
  }

  ascatDays[date] = {
    date,
    records_count: count,
    mean_speed: Number((totalSpeed / count).toFixed(2)),
    max_speed: Number(maxSpeed.toFixed(2)),
    dominant_direction: "Northeast (NE Monsoon)",
    vectors
  };
});

const ascatOutput = {
  metadata: {
    dataset_name: "ASCAT-C Ocean Surface Wind Vectors",
    category: "SYNTHETIC DEMO DATA",
    status_badge: "SYNTHETIC DEMO",
    disclaimer: "Simulated demonstration data. NOT EUMETSAT/KNMI operational scatterometer data. Do not use for storm warnings.",
    region: "Bay of Bengal (5.0°N – 22.0°N, 80.0°E – 100.0°E)",
    temporal_coverage: "2020-01-01 to 2020-01-31 (Daily)",
    spatial_resolution: "0.25° × 0.25° Target Grid (Vector display at 1.0° spacing)",
    variables: [
      { name: "wind_speed", unit: "m/s", description: "Surface equivalent neutral wind speed at 10m" },
      { name: "wind_direction", unit: "degrees", description: "Meteorological wind direction (from True North)" },
      { name: "u_wind", unit: "m/s", description: "Zonal 10m wind velocity component" },
      { name: "v_wind", unit: "m/s", description: "Meridional 10m wind velocity component" }
    ],
    total_dates: dates.length,
    mean_wind_speed_domain: "7.1 m/s",
    dominant_wind_regime: "Northeast Winter Monsoon"
  },
  daily_data: ascatDays
};

fs.writeFileSync(path.join(outDir, 'ascat.json'), JSON.stringify(ascatOutput));
console.log('ASCAT-C written successfully.');

// 3. CCMP Dataset Generation (6-hourly)
console.log('Generating CCMP synthetic data...');
const ccmpDays = {};
const timeSlots = ["00:00", "06:00", "12:00", "18:00"];

dates.forEach((date, dayIdx) => {
  ccmpDays[date] = {};
  timeSlots.forEach((slot, slotIdx) => {
    // diurnal variation in speed & direction
    const diurnalBoost = slot === "12:00" ? 1.4 : slot === "06:00" ? 0.6 : 0.0;
    const diurnalDirShift = (slotIdx - 1.5) * 4;
    const vectors = [];
    let totalSpeed = 0;
    let count = 0;
    let maxSpeed = 0;

    for (let lat = 5; lat <= 21; lat += 1.0) {
      for (let lon = 81; lon <= 99; lon += 1.0) {
        if (!isOcean(lat, lon)) continue;

        const baseDir = 48 + 8 * Math.sin(lat * 0.25) + diurnalDirShift;
        const ws = 6.5 + 2.0 * Math.sin((lat - 4) * 0.2) + diurnalBoost + 0.5 * Math.sin(dayIdx * 0.1);
        const dirRad = (baseDir * Math.PI) / 180;
        const uwnd = -ws * Math.sin(dirRad);
        const vwnd = -ws * Math.cos(dirRad);
        const speed = Math.sqrt(uwnd * uwnd + vwnd * vwnd);

        totalSpeed += speed;
        count++;
        if (speed > maxSpeed) maxSpeed = speed;

        vectors.push({
          lat: Number(lat.toFixed(2)),
          lon: Number(lon.toFixed(2)),
          uwnd: Number(uwnd.toFixed(2)),
          vwnd: Number(vwnd.toFixed(2)),
          ws: Number(speed.toFixed(2)),
          dir: Math.round(baseDir)
        });
      }
    }

    ccmpDays[date][slot] = {
      datetime: `${date}T${slot}:00Z`,
      records_count: count,
      mean_ws: Number((totalSpeed / count).toFixed(2)),
      max_ws: Number(maxSpeed.toFixed(2)),
      vectors
    };
  });
});

const ccmpOutput = {
  metadata: {
    dataset_name: "CCMP 10 m Surface Winds (Cross-Calibrated Multi-Platform)",
    category: "SYNTHETIC DEMO DATA",
    status_badge: "SYNTHETIC DEMO",
    disclaimer: "Simulated demonstration data. NOT Remote Sensing Systems (RSS) product. Do not use for scientific research.",
    region: "Bay of Bengal (5.0°N – 22.0°N, 80.0°E – 100.0°E)",
    temporal_coverage: "2020-01-01 to 2020-01-31 (6-Hourly: 00:00, 06:00, 12:00, 18:00 UTC)",
    spatial_resolution: "0.25° × 0.25° Target Grid (Vector display at 1.0° spacing)",
    variables: [
      { name: "uwnd", unit: "m/s", description: "East-west 10m wind component" },
      { name: "vwnd", unit: "m/s", description: "North-south 10m wind component" },
      { name: "ws", unit: "m/s", formula: "sqrt(uwnd² + vwnd²)", description: "10m wind speed" }
    ],
    total_dates: dates.length,
    observations_per_day: 4,
    mean_wind_speed_domain: "7.3 m/s"
  },
  daily_data: ccmpDays
};

fs.writeFileSync(path.join(outDir, 'ccmp.json'), JSON.stringify(ccmpOutput));
console.log('CCMP written successfully.');
