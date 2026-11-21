/**
 * AUTOCORE — BMW Motorrad Complete Motorcycle Catalog
 * Researched from BMW AG / BMW Motorrad official engineering technical specifications.
 *
 * ShiftCam Boxer engines, S 1000 RR superbikes, R 1300 GS adventure tourers, and 100 years of heritage.
 *
 * Sources:
 *   - BMW Group PressClub Technical Archives (press.bmwgroup.com)
 *   - BMW Motorrad Official Portals (bmw-motorrad.com & bmw-motorrad.in)
 *   - BMW Factory Workshop Manuals (R 1300 GS, S 1000 RR, R 18, G 310 GS)
 *
 * Last verified: October 2026
 */

'use strict';

(function () {

  // ===== ENGINE FAMILIES =====
  const BMW_ENGINES = {

    'bmw-boxer-1300': {
      id: 'bmw-boxer-1300',
      name: '1300cc ShiftCam Boxer-Twin (R 1300 GS)',
      manufacturer: 'BMW Motorrad',
      type: 'Air/liquid-cooled 4-stroke boxer twin-cylinder with BMW ShiftCam variable intake camshaft',
      displacement: 1300,
      cylinders: 2,
      cylinderConfig: 'Horizontally opposed Boxer-twin',
      bore: 106.5,
      stroke: 73.0,
      compressionRatio: '13.3:1',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with BMW ShiftCam (shifts between partial-load and full-load intake cam lobes)',
      cooling: 'Precision Air/Liquid Cooling (water cools thermally stressed cylinder heads and barrels)',
      fuelSystem: 'BMS-MP electronic intake pipe injection with twin 52mm throttle bodies',
      throttle: 'Ride-by-Wire with electronic throttle control',
      maxPower: { value: 145.0, unit: 'bhp', rpm: 7750 },
      maxTorque: { value: 149.0, unit: 'Nm', rpm: 6500 },
      redline: 9000,
      gearboxPosition: 'Gearbox relocated beneath the engine for compact packaging and lower center of gravity',
      oilCapacity: 4.0,
      oilGrade: 'BMW Motorrad Advantec Ultimate 5W-40',
      emissionStandard: 'Euro 5+',
      source: 'BMW Group PressClub R 1300 GS Technical Dossier',
    },

    'bmw-inline4-999': {
      id: 'bmw-inline4-999',
      name: '999cc ShiftCam Inline-Four (S 1000 RR)',
      manufacturer: 'BMW Motorrad',
      type: 'Water/oil-cooled 4-cylinder 4-stroke inline engine with BMW ShiftCam variable valve timing',
      displacement: 999,
      cylinders: 4,
      bore: 80.0,
      stroke: 49.7,
      compressionRatio: '13.3:1',
      valvesPerCylinder: 4,
      valvesMaterial: 'Hollow-stem titanium intake valves, titanium exhaust valves',
      camshaft: 'DOHC with ShiftCam system (switches intake valve lift and timing at 9,000 RPM)',
      cooling: 'Liquid Cooled with curved high-flow radiator',
      fuelSystem: 'Electronic intake pipe injection with variable intake funnels',
      maxPower: { value: 210.0, unit: 'bhp', rpm: 13750 },
      maxTorque: { value: 113.0, unit: 'Nm', rpm: 11000 },
      redline: 14600,
      oilCapacity: 4.5,
      oilGrade: 'BMW Motorrad Advantec Pro 5W-40',
      emissionStandard: 'Euro 5+',
      source: 'BMW S 1000 RR Factory Workshop Manual',
    },

    'bmw-boxer-1802': {
      id: 'bmw-boxer-1802',
      name: '1802cc "Big Boxer" OHV Twin (R 18)',
      manufacturer: 'BMW Motorrad',
      type: 'Air/oil-cooled twin-cylinder four-stroke boxer engine with pushrod OHV architecture',
      displacement: 1802,
      cylinders: 2,
      bore: 107.1,
      stroke: 100.0,
      compressionRatio: '9.6:1',
      valvesPerCylinder: 4,
      camshaft: 'Double camshaft pushrod overhead valve (OHV) with classic forked rocker arms',
      cooling: 'Air & Oil Cooled with front-mounted oil cooler',
      fuelSystem: 'BMS-O electronic intake pipe injection with twin 48mm throttle bodies',
      maxPower: { value: 91.0, unit: 'bhp', rpm: 4750 },
      maxTorque: { value: 158.0, unit: 'Nm', rpm: 3000 },
      flatTorqueBand: 'Over 150 Nm of torque available continuously from 2,000 to 4,000 RPM',
      idleRpm: 950,
      redline: 5750,
      driveshaft: 'Exposed nickel-plated rotating drive shaft (homage to 1936 BMW R 5)',
      engineWeight: 110.8,
      source: 'BMW R 18 Big Boxer Technical Presentation, Munich',
    },

    'bmw-single-313': {
      id: 'bmw-single-313',
      name: '313cc Reverse-Inclined Liquid-Cooled Single',
      manufacturer: 'BMW Motorrad',
      type: 'Single-cylinder 4-stroke, 4-valve DOHC with reverse cylinder head orientation',
      displacement: 313,
      cylinders: 1,
      bore: 80.0,
      stroke: 62.1,
      compressionRatio: '10.9:1',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with finger followers',
      reverseHeadArchitecture: 'Intake at front facing forward, exhaust tract exiting directly rearward',
      cooling: 'Liquid Cooled',
      fuelSystem: 'BMS-E2 electronic fuel injection with 42mm throttle body',
      throttle: 'Ride-by-Wire with electromotive throttle controller',
      maxPower: { value: 34.0, unit: 'bhp', rpm: 9250 },
      maxTorque: { value: 28.0, unit: 'Nm', rpm: 7500 },
      redline: 10500,
      oilCapacity: 1.65,
      oilGrade: 'BMW Motorrad 15W-50 / 10W-40',
      emissionStandard: 'BS-VI Phase 2, Euro 5',
      source: 'BMW G 310 GS Factory Technical Specification (TVS Hosur joint production)',
    },

    'bmw-twin-895': {
      id: 'bmw-twin-895',
      name: '895cc 270° Parallel-Twin (F 900 GS)',
      manufacturer: 'BMW Motorrad',
      type: 'Water-cooled 2-cylinder 4-stroke engine with four valves per cylinder and 270° firing interval',
      displacement: 895,
      cylinders: 2,
      bore: 86.0,
      stroke: 77.0,
      compressionRatio: '13.1:1',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with dual counter-rotating balance shafts',
      cooling: 'Liquid Cooled',
      fuelSystem: 'Electronic intake pipe injection with Ride-by-Wire',
      maxPower: { value: 105.0, unit: 'bhp', rpm: 8500 },
      maxTorque: { value: 93.0, unit: 'Nm', rpm: 6750 },
      redline: 9250,
      emissionStandard: 'Euro 5+',
      source: 'BMW F 900 GS Technical Dossier, 2024',
    },

    'bmw-inline6-1649': {
      id: 'bmw-inline6-1649',
      name: '1649cc 24V DOHC Inline-Six (K 1600)',
      manufacturer: 'BMW Motorrad',
      type: 'Liquid-cooled 6-cylinder 4-stroke in-line engine, 55° forward cylinder tilt, 24 valves',
      displacement: 1649,
      cylinders: 6,
      bore: 72.0,
      stroke: 67.5,
      compressionRatio: '12.2:1',
      valvesPerCylinder: 4,
      engineWidth: 'Ultra-narrow 555mm width (narrowest production six-cylinder motorcycle engine)',
      cooling: 'Liquid Cooled',
      fuelSystem: 'BMS-O with dual knock sensors and 52mm throttle valve',
      maxPower: { value: 160.0, unit: 'bhp', rpm: 6750 },
      maxTorque: { value: 180.0, unit: 'Nm', rpm: 5250 },
      idleRpm: 900,
      redline: 8500,
      source: 'BMW K 1600 GTL Factory Service Manual',
    },
  };

  // Enhance BMW Motorrad in manufacturers directory
  const mfrIdx = AUTOCORE_DB.manufacturers.findIndex(m => m.id === 'bmw-motorrad');
  if (mfrIdx >= 0) {
    Object.assign(AUTOCORE_DB.manufacturers[mfrIdx], {
      fullName: 'BMW Motorrad (Bayerische Motoren Werke AG)',
      country: 'Germany',
      flag: '🇩🇪',
      founded: 1923,
      hq: 'Munich, Bavaria, Germany',
      tagline: 'Make Life a Ride',
      website: 'https://www.bmw-motorrad.com',
      description: 'The premier luxury European motorcycle manufacturer. Invented the modern adventure category with the R 80 G/S in 1980, pioneer of the Telelever and Duolever front suspension systems, first manufacturer to make ABS standard across all models, and creator of the ShiftCam boxer and S 1000 RR superbikes.',
      history: 'BMW built its first motorcycle, the R 32, in 1923 — designed by Chief Engineer Max Friz with a longitudinal flat-twin boxer engine and shaft drive. In 1980, the R 80 G/S conquered the grueling Paris-Dakar Rally, inventing the global adventure touring motorcycle market. In 2009, the S 1000 RR reset all superbike horsepower and electronics benchmarks. Today, BMW produces over 200,000 motorcycles annually across facilities in Berlin, Spandau, Munich, and partner manufacturing with TVS in India.',
      engineFamilies: BMW_ENGINES,
      platforms: ['EVO Telelever & Paralever Boxer Platform', 'Flex Frame Superbike Chassis', 'Bridge-type Steel Trellis Adventure Chassis', 'Double-loop Steel Cradle Heritage Cruiser Chassis'],
    });
  }

  // Remove old bmw-motorrad vehicles
  AUTOCORE_DB.vehicles = AUTOCORE_DB.vehicles.filter(v => v.manufacturer !== 'bmw-motorrad');

  function bm(data) {
    const base = {
      manufacturer: 'bmw-motorrad',
      type: 'motorcycle',
      source: 'BMW Motorrad Official Technical Specifications',
      sourceVerifiedDate: '2026-10',
    };
    const eng = data.engineId ? BMW_ENGINES[data.engineId] : null;
    if (eng && !data.engine) {
      data.engine = {
        configuration: eng.type,
        displacement: eng.displacement,
        cylinders: eng.cylinders,
        bore: eng.bore,
        stroke: eng.stroke,
        compressionRatio: eng.compressionRatio,
        cooling: eng.cooling,
        fuelSystem: eng.fuelSystem,
        valves: eng.valvesPerCylinder,
        camshaft: eng.camshaft,
        maxPower: eng.maxPower,
        maxTorque: eng.maxTorque,
        redline: eng.redline,
        oilCapacity: eng.oilCapacity,
        oilGrade: eng.oilGrade,
      };
    }
    return Object.assign(base, data);
  }

  const BMW_VEHICLES = [

    // ——— R 1300 GS ———
    bm({
      id: 'bmw-r-1300-gs',
      name: 'R 1300 GS',
      engineId: 'bmw-boxer-1300',
      modelFamily: 'GS',
      generation: 'Next-Gen Lightweight Platform (2024–present)',
      category: ['adventure', 'adventure-touring'],
      slug: 'bmw/r-1300-gs',
      year: [2024, 2025, 2026],
      productionStart: 2023,
      status: 'current',
      market: ['Global', 'Europe', 'North America', 'India', 'Japan', 'Australia'],
      tagline: 'The New Benchmark — 12 kg lighter, 145 bhp ShiftCam Boxer, EVO Telelever, radar-assisted cruise control, and adaptive vehicle height.',
      featured: true,
      colours: ['Lightwhite Solid', 'Triple Black', 'GS Trophy (Racing Blue Metallic)', 'Option 719 Tramuntana (Aurelius Green Metallic)'],
      transmission: { type: 'Manual with available Shift Assistant Pro (bi-directional quickshifter)', gears: 6, clutchType: 'Wet slipper clutch with anti-hopping, hydraulic operation', assistClutch: true, slipperClutch: true, quickShifter: true, finalDrive: 'Shaft drive (enclosed cardan shaft with Paralever swingarm)' },
      performance: { topSpeed: 225, zeroTo100: 3.4, mileage: { overall: 20.8, unit: 'km/l' }, fuelRange: 395, source: 'BMW factory certification & independent testing' },
      dimensions: { length: 2212, width: 1000, height: 1406, wheelbase: 1518, groundClearance: 215, seatHeight: 850, seatHeightAdjustable: 'Adaptive vehicle height control lowers automatically to 820mm at slow speeds/stops', fuelTankCapacity: 19.0, kerbWeight: 237, dryWeight: 215, payload: 228 },
      chassis: { frameType: 'Two-part frame design: Sheet metal main frame with die-cast aluminium subframe', frameMaterial: 'Formed steel sheet & die-cast aluminium', swingarmType: 'Cast aluminium single-sided swingarm with EVO Paralever', rake: 26.2, trail: 112 },
      suspension: { front: 'EVO Telelever with central shock absorber and decoupled handlebar flex-element', frontManufacturer: 'BMW Motorrad / Showa / Sachs', frontTravel: 190, rear: 'EVO Paralever single-sided swingarm with Dynamic Suspension Adjustment (DSA) electronic spring rate and damping', rearTravel: 200, electronicSuspension: true, dsaTechnology: 'Dynamic Suspension Adjustment (DSA) dynamically adjusts front/rear damping AND spring stiffness simultaneously' },
      brakes: { front: 'Dual 310mm floating discs with BMW radial-mount 4-piston calipers', frontDiscDiameter: 310, frontDiscCount: 2, frontCaliperType: 'Radial 4-piston monobloc', rear: 'Single 285mm disc with 2-piston floating caliper', rearDiscDiameter: 285, abs: true, absType: 'BMW Full Integral ABS Pro with Cornering ABS (hand lever applies front and rear brakes simultaneously)', corneringAbs: true, switchableAbs: true },
      wheels: { frontTyre: '120/70 R19 (Tubeless)', rearTyre: '170/60 R17 (Tubeless)', frontWheelDiameter: 19, rearWheelDiameter: 17, wheelType: 'Cast aluminium wheels or Cross-spoke tubeless off-road forged wheels', tyreBrand: 'Metzeler Tourance Next 2 / Karoo 4' },
      electronics: { rideByWire: true, rideModes: ['Eco', 'Rain', 'Road', 'Enduro', 'Dynamic Pro', 'Enduro Pro'], tractionControl: true, tcType: 'Dynamic Traction Control (DTC) lean-angle sensitive', cruiseControl: true, radarCruise: 'Active Cruise Control (ACC) with Front Collision Warning (FCW) and Lane Change Warning (SWW)', hillStartAssist: true, tirePressureMonitoring: true, heatedGrips: true, display: '6.5-inch full-colour TFT with BMW Connectivity smartphone app navigation', keylessIgnition: true, matrixLedHeadlight: 'Matrix LED headlight with signature X-shaped daytime running light' },
      price: { europe: { min: 19140, max: 23900, currency: 'EUR' }, usa: { min: 18895, max: 24500, currency: 'USD' }, india: { min: 2095000, max: 2450000, currency: 'INR', verified: '2024' } },
      strengths: ['12 kg weight loss makes the R 1300 GS remarkably more nimble on dirt and tarmac', 'EVO Telelever decouples steering forces from road shocks, eliminating dive under hard braking', 'Adaptive vehicle height control lowers to 820mm automatically so flat-footing is easy at red lights', 'Massive low-end torque of 149 Nm makes overtaking instantaneous without downshifting'],
      limitations: ['Smaller 19L fuel tank compared to the older Adventure variant', 'Radar electronics and electronic suspension options significantly inflate final price'],
      competitors: ['Ducati Multistrada V4 S', 'KTM 1290 Super Adventure S', 'Triumph Tiger 1200 GT Explorer', 'Harley-Davidson Pan America 1250 Special'],
      source: 'BMW Motorrad AG Factory Press Dossier, Munich, 2024',
    }),

    // ——— S 1000 RR ———
    bm({
      id: 'bmw-s-1000-rr',
      name: 'S 1000 RR',
      engineId: 'bmw-inline4-999',
      modelFamily: 'S 1000 RR',
      generation: 'Gen 4 (Aero Winglet Update, 2023–present)',
      category: ['superbike'],
      slug: 'bmw/s-1000-rr',
      year: [2023, 2024, 2025, 2026],
      productionStart: 2009,
      status: 'current',
      market: ['Global', 'Europe', 'North America', 'Japan', 'India'],
      tagline: 'The Master of the Superbike Realm — 210 bhp ShiftCam inline-four, aerodynamic winglets generating 17.1 kg downforce, and Slide Control.',
      featured: true,
      colours: ['Blackstorm Metallic', 'Passion (Racing Red Solid)', 'Lightwhite Solid / M Motorsport Livery'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Multi-disc oil bath slipper clutch with self-reinforcement', assistClutch: true, slipperClutch: true, quickShifter: true, quickshifterType: 'Shift Assistant Pro (Bi-directional clutchless quickshifter)', finalDrive: 'M Endurance low-friction chain (diamond-like carbon coating)' },
      performance: { topSpeed: 303, zeroTo100: 2.9, zeroTo200: 6.9, quarterMile: 9.9, mileage: { overall: 15.6, unit: 'km/l' }, fuelRange: 257 },
      dimensions: { length: 2073, width: 848, height: 1205, wheelbase: 1457, groundClearance: 140, seatHeight: 824, fuelTankCapacity: 16.5, kerbWeight: 197, dryWeight: 175 },
      chassis: { frameType: 'Aluminium composite bridge frame with engine as stressed member (M Chassis kit with adjustable swingarm pivot)', frameMaterial: 'Die-cast & extruded aluminium', swingarmType: 'Gravity die-cast underslung aluminium swingarm with WSBK geometry', rake: 23.6, trail: 99.8 },
      suspension: { front: '45mm inverted telescopic forks with adjustable compression, rebound, and spring preload (DDC optional)', frontManufacturer: 'Marzocchi', frontForkDiameter: 45, frontTravel: 120, rear: 'Aluminium underslung swingarm with central monoshock, adjustable high/low-speed compression, rebound, and preload', rearTravel: 118, electronicSuspension: true, ddcTechnology: 'Dynamic Damping Control (DDC) semi-active electronic suspension' },
      brakes: { front: 'Dual 320mm floating discs with M radial 4-piston calipers developed from WorldSBK', frontDiscDiameter: 320, frontDiscCount: 2, frontCaliperType: 'M radial 4-piston monobloc', rear: 'Single 220mm disc with 1-piston floating caliper', rearDiscDiameter: 220, abs: true, absType: 'BMW Motorrad Race ABS Pro with Brake Slide Assist (allows controlled drift into corners)', corneringAbs: true, switchableAbs: true, brakeManufacturer: 'Nissin / M Performance' },
      wheels: { frontTyre: '120/70 ZR17', rearTyre: '190/55 ZR17 (or 200/55 ZR17 with M wheels)', wheelType: 'Forged aluminium M wheels or ultra-light M Carbon Fibre wheels (1.7 kg weight savings)', tyreBrand: 'Bridgestone Battlax Racing Street RS11' },
      electronics: { rideByWire: true, rideModes: ['Rain', 'Road', 'Dynamic', 'Race', 'Race Pro 1-3'], tractionControl: true, tcType: 'DTC (Dynamic Traction Control) with Slide Control steering angle sensor', launchControl: true, wheelyControl: true, pitLaneLimiter: true, cruiseControl: true, display: '6.5-inch full-colour TFT with Pure Ride screen and Core Ride screens with lean-angle display' },
      price: { europe: { min: 20490, max: 24900, currency: 'EUR' }, usa: { min: 18295, max: 24000, currency: 'USD' }, india: { min: 2075000, max: 2525000, currency: 'INR', verified: '2024' } },
      strengths: ['ShiftCam variable valve timing yields massive torque below 9,000 RPM and screaming 210 bhp above', 'New aerodynamic composite winglets suppress wheelies at high speeds, improving lap times', 'Slide Control and Brake Slide Assist allow controlled rear slip using steering angle sensor', 'M Endurance chain requires no lubrication or routine re-tensioning'],
      limitations: ['Extremely low clip-on handlebars cause rider fatigue in city traffic', 'Heats up quickly during slow-speed urban riding'],
      competitors: ['Ducati Panigale V4', 'Yamaha YZF-R1M', 'Kawasaki Ninja ZX-10R', 'Honda CBR1000RR-R Fireblade SP'],
      source: 'BMW Motorrad S 1000 RR Factory Workshop Manual, 2024',
    }),

    // ——— G 310 GS ———
    bm({
      id: 'bmw-g-310-gs',
      name: 'G 310 GS',
      engineId: 'bmw-single-313',
      modelFamily: 'GS',
      generation: 'BS6 Phase 2 Ride-by-Wire Update',
      category: ['adventure', 'dual-sport'],
      slug: 'bmw/g-310-gs',
      year: [2021, 2022, 2023, 2024, 2025, 2026],
      productionStart: 2017,
      status: 'current',
      market: ['Global', 'India', 'Europe', 'North America', 'Latin America'],
      tagline: 'Everyday Adventure — 313cc reverse-inclined engine, 19-inch front wheel, 180mm suspension travel, and accessible GS ergonomics.',
      featured: true,
      colours: ['Cosmic Black 3', 'Style Rallye (Kalamata Dark Gold Metallic)', 'Sport (Polar White / Racing Blue Metallic)'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Self-boosting anti-hopping slipper clutch', assistClutch: true, slipperClutch: true, finalDrive: 'Chain' },
      performance: { topSpeed: 143, zeroTo100: 7.6, mileage: { city: 29, highway: 34, overall: 31.5, unit: 'km/l' }, fuelRange: 346 },
      dimensions: { length: 2075, width: 880, height: 1230, wheelbase: 1420, groundClearance: 220, seatHeight: 835, fuelTankCapacity: 11.5, kerbWeight: 175 },
      chassis: { frameType: 'Tubular steel spaceframe with bolt-on rear frame', swingarmType: 'Die-cast aluminium swingarm' },
      suspension: { front: '41mm inverted telescopic forks with gold anodized outer tubes', frontForkDiameter: 41, frontTravel: 180, rear: 'Central spring strut monoshock with directly mounted spring, adjustable preload', rearTravel: 180, rearPreload: 'Adjustable' },
      brakes: { front: 'Single 300mm disc with ByBre radial 4-piston caliper', frontDiscDiameter: 300, rear: 'Single 240mm disc with ByBre single-piston floating caliper', rearDiscDiameter: 240, abs: true, absType: 'BMW Motorrad Dual-Channel ABS' },
      wheels: { frontTyre: '110/80 R19 (Tubeless)', rearTyre: '150/70 R17 (Tubeless)', frontWheelDiameter: 19, rearWheelDiameter: 17, wheelType: '5-spoke cast aluminium alloy wheels', tyreBrand: 'Metzeler Tourance' },
      electronics: { rideByWire: true, display: 'LCD digital multi-function display', headlightType: 'Full LED headlamp and LED indicators', adjustableLevers: '4-stage adjustable brake and clutch levers' },
      price: { india: { min: 330000, max: 335000, currency: 'INR', verified: '2025-04' }, europe: { min: 6790, max: 7100, currency: 'EUR' } },
      strengths: ['Plush 180mm suspension travel absorbs broken pavement and speed humps easily', 'Reverse-inclined engine shifts weight forward and allows long swingarm for high-speed stability', 'Premium BMW badge, build quality, and paint finish', 'Very light assist & slipper clutch lever action'],
      limitations: ['Alloy wheels limit serious rock-crawling off-road adventures compared to spoke rims', 'Modest 11.5-litre fuel tank limits range on remote routes'],
      competitors: ['KTM 390 Adventure', 'Royal Enfield Himalayan 450', 'Honda NX500', 'Triumph Scrambler 400 X'],
      source: 'BMW Motorrad India Technical Specifications, Hosur / Munich, 2024',
    }),

    // ——— R 18 (The Big Boxer Heritage Cruiser) ———
    bm({
      id: 'bmw-r-18',
      name: 'R 18 / R 18 Roctane',
      engineId: 'bmw-boxer-1802',
      modelFamily: 'R 18',
      generation: 'First Generation (2020–present)',
      category: ['cruiser', 'bobber', 'heritage', 'classic'],
      slug: 'bmw/r-18',
      year: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
      productionStart: 2020,
      status: 'current',
      market: ['Global', 'North America', 'Europe', 'India'],
      tagline: 'Soul is all that matters — colossal 1802cc Big Boxer, exposed nickel driveshaft, double-cradle steel frame, and 158 Nm of torque.',
      featured: true,
      colours: ['Blackstorm Metallic with White Double Pinstripe', 'Mineral Grey Metallic Matte', 'Manhattan Metallic Matte'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Single-disc dry slipper clutch', slipperClutch: true, finalDrive: 'Exposed nickel-plated rotating cardan shaft', reverseGear: 'Optional electric reverse gear driven by starter motor' },
      performance: { topSpeed: 180, zeroTo100: 4.8, mileage: { overall: 17.8, unit: 'km/l' }, fuelRange: 285 },
      dimensions: { length: 2440, width: 964, height: 1230, wheelbase: 1731, groundClearance: 155, seatHeight: 690, fuelTankCapacity: 16.0, kerbWeight: 345 },
      chassis: { frameType: 'Double-cradle steel frame with screwed-on down tubes (rigid-tail look concealing central shock)', frameMaterial: 'Tubular steel' },
      suspension: { front: '49mm Telescopic fork with classic fork sleeves', frontForkDiameter: 49, frontTravel: 120, rear: 'Cantilever central shock absorber with travel-dependent damping, concealed inside frame', rearTravel: 90 },
      brakes: { front: 'Dual 300mm discs with 4-piston fixed calipers', frontDiscDiameter: 300, frontDiscCount: 2, rear: 'Single 300mm disc with 4-piston fixed caliper', rearDiscDiameter: 300, abs: true, absType: 'BMW Motorrad Integral ABS' },
      wheels: { frontTyre: '120/70 R21 (Roctane) or 120/70 R19 (Base)', rearTyre: '180/55 B18 (Roctane) or 180/65 B16 (Base)', wheelType: 'Wire-spoke wheels with black rims or contrast-cut forged alloy wheels' },
      electronics: { rideByWire: true, rideModes: ['Rain', 'Roll', 'Rock (aggressive idle and instant throttle response)'], tractionControl: true, tcType: 'ASC (Automatic Stability Control)', engineDragTorqueControl: true, keylessIgnition: true },
      price: { europe: { min: 21990, max: 26500, currency: 'EUR' }, usa: { min: 18695, max: 24000, currency: 'USD' }, india: { min: 1990000, max: 2400000, currency: 'INR', verified: '2024' } },
      source: 'BMW Motorrad Technical Information, Munich, 2024',
    }),

    // ——— R 80 G/S (1980 Paris-Dakar Pioneer) ———
    bm({
      id: 'bmw-r-80-gs-historical',
      name: 'R 80 G/S (1980 "Father of Adventure Bikes")',
      modelFamily: 'GS',
      generation: 'Original Type 247E (1980–1987)',
      category: ['adventure', 'classic', 'heritage', 'dual-sport'],
      slug: 'bmw/r-80-gs-1980',
      year: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987],
      productionStart: 1980,
      productionEnd: 1987,
      status: 'historical',
      market: ['Global', 'Europe', 'North America'],
      tagline: 'The Machine that Invented Adventure — G/S stands for Gelände/Straße (Off-road/Road). Four-time Paris-Dakar Rally winner.',
      colours: ['Alpine White with Blue/Red Paris-Dakar Livery', 'Tuareg Blue'],
      engine: { configuration: 'Air-cooled 2-cylinder 4-stroke boxer engine with pushrod OHV and 2 valves per cylinder', displacement: 797.5, cylinders: 2, bore: 84.8, stroke: 70.6, compressionRatio: '8.2:1', cooling: 'Air Cooled', fuelSystem: 'Two Bing constant-velocity 32mm carburetors', valves: 4, camshaft: 'Single central camshaft driven by duplex chain under the crankshaft', maxPower: { value: 50.0, unit: 'bhp', rpm: 6500 }, maxTorque: { value: 56.0, unit: 'Nm', rpm: 5000 }, redline: 7200 },
      transmission: { type: 'Manual', gears: 5, clutchType: 'Dry single-plate diaphragm spring clutch', finalDrive: 'Shaft drive inside single-sided Monolever swingarm' },
      performance: { topSpeed: 168, zeroTo100: 5.6, mileage: { overall: 19.5, unit: 'km/l' }, fuelRange: 380 },
      dimensions: { length: 2230, wheelbase: 1465, groundClearance: 218, seatHeight: 860, fuelTankCapacity: 19.5, kerbWeight: 186 },
      chassis: { frameType: 'Continuous tubular steel double cradle frame with bolt-on rear frame' },
      suspension: { front: 'BMW telescopic fork with hydraulic damping', frontTravel: 200, rear: 'BMW Monolever single-sided swingarm with central spring strut (world\'s first mass-production single-sided swingarm)', rearTravel: 170 },
      brakes: { front: 'Single 260mm Brembo hydraulic disc brake', rear: '200mm internal expanding drum brake', abs: false },
      wheels: { frontTyre: '3.00-21', rearTyre: '4.00-18', wheelType: 'Wire-spoke steel wheels' },
      source: 'BMW Group Classic Archives, Munich, Germany, 1980',
    }),

  ];

  AUTOCORE_DB.vehicles.push(...BMW_VEHICLES);
  if (!AUTOCORE_DB.engineFamilies) AUTOCORE_DB.engineFamilies = {};
  Object.assign(AUTOCORE_DB.engineFamilies, BMW_ENGINES);

})();
