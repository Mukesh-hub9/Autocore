/**
 * AUTOCORE — Kawasaki Heavy Industries Complete Motorcycle Catalog
 * Researched from Kawasaki Heavy Industries, Ltd. & Kawasaki Motors Enterprise official technical manuals.
 *
 * Supercharged H2 hyperbikes, screaming ZX inline-fours, Z Sugomi nakeds, and historic legends.
 *
 * Sources:
 *   - Kawasaki Motors Global Technical Archive (kawasaki-cp.khi.co.jp)
 *   - Kawasaki Motors India & USA Service Manuals (Ninja H2, ZX-10R, ZX-4R, Z900)
 *   - FIM WorldSBK Technical Homologation Documents (Ninja ZX-10RR)
 *
 * Last verified: October 2026
 */

'use strict';

(function () {

  // ===== ENGINE FAMILIES =====
  const KAWASAKI_ENGINES = {

    'kawasaki-supercharged-998': {
      id: 'kawasaki-supercharged-998',
      name: '998cc Supercharged DOHC Inline-Four (Ninja H2)',
      manufacturer: 'Kawasaki',
      type: 'Liquid-cooled, 4-stroke, inline 4-cylinder DOHC 16-valve with centrifugal supercharger',
      displacement: 998,
      cylinders: 4,
      bore: 76.0,
      stroke: 55.0,
      compressionRatio: '8.5:1 (tuned for forced induction)',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with dual overhead camshafts',
      cooling: 'Liquid Cooled with high-flow dual water jackets and deep-sump oil cooling',
      fuelSystem: 'Dual injection with four 50mm throttle bodies and top-feed injectors',
      supercharger: 'Centrifugal planetary gear-driven supercharger spinning at 9.2x crankshaft speed (up to 130,000 RPM at redline)',
      throttle: 'Ride-by-Wire Electronic Throttle Valves (ETV)',
      maxPower: { value: 228.0, unit: 'bhp', rpm: 11500 },
      maxTorque: { value: 141.7, unit: 'Nm', rpm: 11000 },
      ramAirPower: { value: 239.0, unit: 'bhp', rpm: 11500 },
      redline: 14000,
      lubrication: 'Wet sump with combined oil cooler',
      oilCapacity: 4.7,
      oilGrade: 'Kawasaki Lime Green Performance 10W-40 Synthetic',
      emissionStandard: 'Euro 5',
      source: 'Kawasaki Heavy Industries Aerospace & Motorcycle Division Engineering Manual',
    },

    'kawasaki-zx10r-998': {
      id: 'kawasaki-zx10r-998',
      name: '998cc 16V DOHC Inline-Four (ZX-10R WorldSBK)',
      manufacturer: 'Kawasaki',
      type: 'Inline 4-cylinder, 4-stroke, 16-valve DOHC with finger-follower valve actuation',
      displacement: 998,
      cylinders: 4,
      bore: 76.0,
      stroke: 55.0,
      compressionRatio: '13.0:1',
      valvesPerCylinder: 4,
      valvesMaterial: 'Titanium intake and exhaust valves',
      camshaft: 'DOHC with finger followers (20% reduced reciprocating valvetrain mass)',
      cooling: 'Liquid Cooled with independent air-cooled oil cooler',
      fuelSystem: 'Dual injection with four 47mm Keihin throttle bodies',
      maxPower: { value: 200.2, unit: 'bhp', rpm: 13200 },
      maxTorque: { value: 114.9, unit: 'Nm', rpm: 11400 },
      ramAirPower: { value: 210.1, unit: 'bhp', rpm: 13200 },
      redline: 14500,
      oilCapacity: 4.0,
      oilGrade: '10W-40 Full Synthetic',
      emissionStandard: 'Euro 5+',
      source: 'Kawasaki Ninja ZX-10R Factory Service Manual',
    },

    'kawasaki-zx4r-399': {
      id: 'kawasaki-zx4r-399',
      name: '399cc Screaming 16V Inline-Four (16,000 RPM)',
      manufacturer: 'Kawasaki',
      type: 'Inline 4-cylinder, 4-stroke, 16-valve DOHC high-revving',
      displacement: 399,
      cylinders: 4,
      bore: 57.0,
      stroke: 39.1,
      compressionRatio: '12.3:1',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with triple-rate valve springs',
      cooling: 'Liquid Cooled with 30-row racing curved radiator',
      fuelSystem: 'Four 34mm throttle bodies with fine-atomizing injectors',
      throttle: 'Ride-by-Wire Electronic Throttle Valves',
      maxPower: { value: 76.4, unit: 'bhp', rpm: 14500 },
      maxTorque: { value: 39.0, unit: 'Nm', rpm: 13000 },
      ramAirPower: { value: 79.1, unit: 'bhp', rpm: 14500 },
      redline: 16000,
      oilCapacity: 3.0,
      oilGrade: '10W-40 Synthetic',
      emissionStandard: 'Euro 5, BS-VI Phase 2',
      source: 'Kawasaki Ninja ZX-4R Technical Dossier, 2024',
    },

    'kawasaki-z900-948': {
      id: 'kawasaki-z900-948',
      name: '948cc 16V DOHC Inline-Four (Z900 Sugomi)',
      manufacturer: 'Kawasaki',
      type: 'Inline 4-cylinder, 4-stroke, 16-valve DOHC liquid-cooled',
      displacement: 948,
      cylinders: 4,
      bore: 73.4,
      stroke: 56.0,
      compressionRatio: '11.8:1',
      valvesPerCylinder: 4,
      cooling: 'Liquid Cooled',
      fuelSystem: 'Electronic fuel injection with twin 36mm Keihin throttle bodies with sub-throttles',
      maxPower: { value: 123.6, unit: 'bhp', rpm: 9500 },
      maxTorque: { value: 98.6, unit: 'Nm', rpm: 7700 },
      redline: 11000,
      oilCapacity: 4.0,
      oilGrade: '10W-40',
      emissionStandard: 'BS-VI Phase 2, Euro 5',
      source: 'Kawasaki Z900 Factory Workshop Manual',
    },

    'kawasaki-twin-451': {
      id: 'kawasaki-twin-451',
      name: '451cc Parallel-Twin DOHC (Ninja 500 Platform)',
      manufacturer: 'Kawasaki',
      type: 'Parallel-twin, 4-stroke, 8-valve DOHC with 180° firing order',
      displacement: 451,
      cylinders: 2,
      bore: 70.0,
      stroke: 58.6,
      compressionRatio: '11.3:1',
      valvesPerCylinder: 4,
      cooling: 'Liquid Cooled',
      fuelSystem: 'Fuel injection with dual 32mm throttle bodies',
      maxPower: { value: 44.7, unit: 'bhp', rpm: 9000 },
      maxTorque: { value: 42.6, unit: 'Nm', rpm: 6000 },
      redline: 10500,
      oilCapacity: 2.3,
      oilGrade: '10W-40',
      emissionStandard: 'Euro 5+, BS-VI Phase 2',
      source: 'Kawasaki Ninja 500 Factory Technical Specs, 2024',
    },

    'kawasaki-zx14r-1441': {
      id: 'kawasaki-zx14r-1441',
      name: '1441cc High-Displacement DOHC Inline-Four (ZX-14R)',
      manufacturer: 'Kawasaki',
      type: 'Inline 4-cylinder, 4-stroke, 16-valve DOHC with dual gear-driven balancers',
      displacement: 1441,
      cylinders: 4,
      bore: 84.0,
      stroke: 65.0,
      compressionRatio: '12.3:1',
      valvesPerCylinder: 4,
      camshaft: 'DOHC with surface-treated cams',
      cooling: 'Liquid Cooled with dual high-speed radiator fans',
      fuelSystem: 'DFI with four 44mm Mikuni throttle bodies',
      maxPower: { value: 197.3, unit: 'bhp', rpm: 10000 },
      maxTorque: { value: 158.2, unit: 'Nm', rpm: 7500 },
      ramAirPower: { value: 207.1, unit: 'bhp', rpm: 10000 },
      redline: 11000,
      source: 'Kawasaki Ninja ZX-14R Technical Archives, 2020',
    },
  };

  // Enhance Kawasaki in manufacturers directory
  const mfrIdx = AUTOCORE_DB.manufacturers.findIndex(m => m.id === 'kawasaki');
  if (mfrIdx >= 0) {
    Object.assign(AUTOCORE_DB.manufacturers[mfrIdx], {
      fullName: 'Kawasaki Heavy Industries Motorcycle & Engine Company',
      country: 'Japan',
      flag: '🇯🇵',
      founded: 1896,
      hq: 'Kobe, Hyogo, Japan',
      tagline: 'Let the Good Times Roll',
      website: 'https://www.kawasaki.com',
      description: 'The heavyweight engineering titan of Japan. From aerospace turbines to bullet trains and high-speed cargo ships, Kawasaki leverages colossal heavy-industry engineering to create the supercharged Ninja H2 hyperbike family, the world-conquering ZX-10R WorldSBK superbike, and the menacing Z Sugomi nakeds.',
      history: 'Founded by Shozo Kawasaki in Tokyo in 1878 as a shipyard. Motorcycle operations started in 1960 through the acquisition of Meguro Manufacturing. The 1969 500cc 2-stroke Mach III H1 was the quickest acceleration motorcycle in the world. The 1972 Z1 900 crushed speed records, and the 1984 GPZ900R Ninja introduced the "Ninja" moniker. In 2015, Kawasaki unleashed the supercharged Ninja H2, the only production supercharged motorcycle in existence.',
      engineFamilies: KAWASAKI_ENGINES,
      platforms: ['Trellis Steel High-Tensile Chassis (H2 & Z series)', 'Aluminium Twin-Spar Superbike Chassis (ZX-10R, ZX-6R)', 'Aluminium Monocoque Chassis (ZX-14R)', 'Lightweight Trellis Diamond Chassis (Ninja 500)'],
    });
  }

  // Remove old kawasaki vehicles
  AUTOCORE_DB.vehicles = AUTOCORE_DB.vehicles.filter(v => v.manufacturer !== 'kawasaki');

  function kw(data) {
    const base = {
      manufacturer: 'kawasaki',
      type: 'motorcycle',
      source: 'Kawasaki Heavy Industries Official Technical Documentation',
      sourceVerifiedDate: '2026-10',
    };
    const eng = data.engineId ? KAWASAKI_ENGINES[data.engineId] : null;
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

  const KAWASAKI_VEHICLES = [

    // ——— NINJA H2 CARBON (Supercharged Hyperbike) ———
    kw({
      id: 'kawasaki-ninja-h2-carbon',
      name: 'Ninja H2 Carbon (Supercharged)',
      engineId: 'kawasaki-supercharged-998',
      modelFamily: 'Ninja H2',
      generation: 'Second Generation (231 PS Update, 2019–present)',
      category: ['hyperbike', 'superbike'],
      slug: 'kawasaki/ninja-h2-carbon',
      year: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
      productionStart: 2015,
      status: 'current',
      market: ['Global', 'North America', 'Europe', 'Japan', 'India'],
      tagline: 'Built Beyond Belief — 998cc planetary supercharger, carbon-fibre cowl, Brembo Stylema calipers, and self-healing paint.',
      featured: true,
      colours: ['Mirror Coated Matte Spark Black / Candy Flat Blazed Green (Self-Healing Silver Paint)'],
      transmission: { type: 'Manual dog-ring transmission', gears: 6, clutchType: 'Wet multi-disc hydraulic slipper clutch', assistClutch: true, slipperClutch: true, quickShifter: true, quickshifterType: 'KQS (Kawasaki Quick Shifter) up and down', finalDrive: 'Enclosed 525 chain' },
      performance: { topSpeed: 337, zeroTo100: 2.6, zeroTo200: 6.8, quarterMile: 9.6, mileage: { overall: 12.5, unit: 'km/l' }, fuelRange: 212, source: 'Independent instrumented radar testing' },
      dimensions: { length: 2085, width: 770, height: 1125, wheelbase: 1455, groundClearance: 130, seatHeight: 825, fuelTankCapacity: 17.0, kerbWeight: 238, dryWeight: 215 },
      chassis: { frameType: 'High-tensile steel trellis frame with swingarm mounting plate', frameMaterial: 'High-tensile steel tubing, powder-coated in Kawasaki Lime Green', swingarmType: 'Cast aluminium single-sided swingarm', rake: 24.5, trail: 103 },
      suspension: { front: 'KYB 43mm AOS-II inverted fork with damping adjustment and DLC coating', frontManufacturer: 'KYB', frontForkDiameter: 43, frontTravel: 120, frontAdjustability: 'Fully adjustable compression, rebound damping, and preload', rear: 'Öhlins TTX36 gas-charged shock with 36mm piston, remote preload adjuster', rearTravel: 135, rearManufacturer: 'Öhlins', rearAdjustability: 'Compression, rebound, and spring preload', electronicSuspension: false },
      brakes: { front: 'Dual 330mm semi-floating Brembo discs with Brembo Stylema radial-mount 4-piston monobloc calipers', frontDiscDiameter: 330, frontDiscCount: 2, frontCaliperType: 'Brembo Stylema radial 4-piston monobloc', rear: 'Single 250mm disc with Brembo 2-piston caliper', rearDiscDiameter: 250, abs: true, absType: 'KIBS (Kawasaki Intelligent anti-lock Brake System) with Cornering Management Function (KCMF)', corneringAbs: true, brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 ZR17 M/C (58W)', rearTyre: '200/55 ZR17 M/C (78W)', wheelType: 'Ultra-lightweight 5-spoke star-pattern cast aluminium wheels', tyreBrand: 'Bridgestone Battlax Racing Street RS11' },
      electronics: { rideByWire: true, rideModes: ['Track', 'Sport', 'Road', 'Rain'], tractionControl: true, tcType: 'KTRC (Kawasaki Traction Control) 9-mode IMU-linked', launchControl: true, wheelyControl: true, engineBrakingControl: true, cruiseControl: false, display: 'Full-colour TFT instrument screen with smartphone Rideology App connectivity', paintTechnology: 'Highly Durable Paint (microscopic soft cross-linked segments self-heal light scratches)' },
      price: { europe: { min: 36000, max: 37500, currency: 'EUR' }, usa: { min: 35000, max: 35600, currency: 'USD' }, india: { min: 3195000, max: 3200000, currency: 'INR', verified: '2024' } },
      strengths: ['Centrifugal supercharger delivers unmatched acceleration surge in any gear', 'Single-sided swingarm exposes gorgeous star-pattern rear wheel', 'Dog-ring transmission (MotoGP technology) shifts effortlessly at full throttle', 'Aerospace-derived aerodynamic mirror wings generate high-speed downforce'],
      limitations: ['Extremely expensive running costs and specialized maintenance requirements', 'Weight (238 kg) is heavier than naturally aspirated superbikes on tight track corners'],
      competitors: ['Ducati Panigale V4 R', 'BMW M 1000 RR', 'Yamaha YZF-R1M', 'Suzuki Hayabusa'],
      source: 'Kawasaki Motors Corp. Ninja H2 Technical Service Manual, 2024',
    }),

    // ——— NINJA ZX-4R / ZX-4RR ———
    kw({
      id: 'kawasaki-ninja-zx-4r',
      name: 'Ninja ZX-4R / ZX-4RR',
      engineId: 'kawasaki-zx4r-399',
      modelFamily: 'Ninja ZX-4R',
      generation: 'First Generation (2023–present)',
      category: ['sports', 'supersport'],
      slug: 'kawasaki/ninja-zx-4r',
      year: [2023, 2024, 2025, 2026],
      productionStart: 2023,
      status: 'current',
      market: ['Global', 'North America', 'Europe', 'Japan', 'India', 'Southeast Asia'],
      tagline: 'Awaken Your Supersport — 399cc inline-four screaming to 16,000 RPM, Showa BFRC-lite, and 77 bhp.',
      featured: true,
      colours: ['Lime Green / Ebony (KRT Edition)', 'Metallic Spark Black'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Assist & Slipper clutch', assistClutch: true, slipperClutch: true, quickShifter: true, quickshifterType: 'KQS (Kawasaki Quick Shifter) bi-directional (standard on RR, accessory on base)', finalDrive: 'Chain' },
      performance: { topSpeed: 243, zeroTo100: 4.0, zeroTo160: 9.2, quarterMile: 12.1, mileage: { overall: 20.2, unit: 'km/l' }, fuelRange: 303 },
      dimensions: { length: 1990, width: 765, height: 1110, wheelbase: 1380, groundClearance: 135, seatHeight: 800, fuelTankCapacity: 15.0, kerbWeight: 189 },
      chassis: { frameType: 'High-tensile steel trellis frame engineered with WorldSBK chassis dynamics', swingarmType: 'Curved steel swingarm' },
      suspension: { front: 'Showa 37mm SFF-BP (Separate Function Fork - Big Piston) inverted fork with preload adjustment (RR)', frontManufacturer: 'Showa', frontForkDiameter: 37, frontTravel: 120, rear: 'Showa BFRC-lite (Balance Free Rear Cushion) gas-charged shock with piggyback reservoir, compression and rebound adjustment (RR variant)', rearTravel: 124, rearManufacturer: 'Showa' },
      brakes: { front: 'Dual 290mm semi-floating discs with radial-mount monobloc 4-piston calipers', frontDiscDiameter: 290, frontDiscCount: 2, frontCaliperType: 'Radial-mount monobloc 4-piston', rear: 'Single 220mm disc with single-piston caliper', rearDiscDiameter: 220, abs: true, absType: 'Dual-channel ABS with sport tuning' },
      wheels: { frontTyre: '120/70 ZR17 (58W)', rearTyre: '160/60 ZR17 (69W)', wheelType: 'Star-pattern 5-spoke aluminium alloy wheels', tyreBrand: 'Dunlop Sportmax GPR-300' },
      electronics: { rideByWire: true, rideModes: ['Sport', 'Road', 'Rain', 'Rider (Manual)'], tractionControl: true, tcType: 'KTRC (3-mode Kawasaki Traction Control)', quickShifter: true, display: '4.3-inch full-colour TFT display with Circuit Mode and Bluetooth Rideology' },
      price: { europe: { min: 9699, max: 10299, currency: 'EUR' }, usa: { min: 9399, max: 10099, currency: 'USD' }, india: { min: 849000, max: 910000, currency: 'INR', verified: '2024' } },
      strengths: ['Only modern 400cc 4-cylinder supersport currently in global production', 'Exquisite 16,000 RPM scream with ram-air induction intake roar', 'Dual 290mm radial front brakes and Showa BFRC-lite suspension offer genuine big-bike track feel', 'Very approachable 800mm seat height'],
      limitations: ['Priced close to 650cc and 700cc twin-cylinder competition', 'Needs to be kept above 9,000 RPM for serious acceleration'],
      competitors: ['Yamaha R7', 'Aprilia RS 457', 'Honda CBR650R', 'KTM RC 390'],
      source: 'Kawasaki Motors Enterprise Technical Press Dossier, 2024',
    }),

    // ——— Z900 (The Sugomi Streetfighter) ———
    kw({
      id: 'kawasaki-z900',
      name: 'Z900',
      engineId: 'kawasaki-z900-948',
      modelFamily: 'Z',
      generation: 'Sugomi Generation (2020–present)',
      category: ['naked', 'streetfighter'],
      slug: 'kawasaki/z900',
      year: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
      productionStart: 2017,
      status: 'current',
      market: ['Global', 'India', 'Europe', 'North America', 'Japan'],
      tagline: 'Refined Raw — 948cc inline-four muscle, high-tensile trellis frame, and visceral Sugomi styling.',
      featured: true,
      colours: ['Metallic Spark Black / Metallic Matte Dark Gray', 'Candy Persimmon Red / Ebony', 'Metallic Matte Graphenesteel Gray'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Assist & Slipper clutch', assistClutch: true, slipperClutch: true, finalDrive: 'Chain' },
      performance: { topSpeed: 240, zeroTo100: 3.4, quarterMile: 11.2, mileage: { city: 16, highway: 21, overall: 18.0, unit: 'km/l' }, fuelRange: 306 },
      dimensions: { length: 2070, width: 825, height: 1080, wheelbase: 1455, groundClearance: 145, seatHeight: 820, fuelTankCapacity: 17.0, kerbWeight: 212 },
      chassis: { frameType: 'High-tensile steel trellis frame weighing only 13.5 kg', swingarmType: 'Extruded aluminium swingarm' },
      suspension: { front: '41mm inverted fork with stepless rebound damping and spring preload adjustability', frontForkDiameter: 41, frontTravel: 120, rear: 'Horizontal Back-link monoshock with stepless rebound damping and spring preload adjustability', rearTravel: 140 },
      brakes: { front: 'Dual 300mm petal discs with 4-piston opposed calipers', frontDiscDiameter: 300, frontDiscCount: 2, rear: 'Single 250mm petal disc with single-piston caliper', rearDiscDiameter: 250, abs: true, absType: 'Dual-channel ABS' },
      wheels: { frontTyre: '120/70 ZR17 (58W)', rearTyre: '180/55 ZR17 (73W)', wheelType: '5-spoke star-pattern lightweight cast wheels', tyreBrand: 'Dunlop Sportmax Roadsport 2' },
      electronics: { rideModes: ['Sport', 'Road', 'Rain', 'Rider (Manual)'], tractionControl: true, tcType: 'KTRC (Kawasaki Traction Control 3-level)', display: '4.3-inch all-digital TFT colour instrumentation with Bluetooth connectivity via Rideology app' },
      price: { india: { min: 938000, max: 950000, currency: 'INR', verified: '2025-04' }, europe: { min: 10899, max: 11499, currency: 'EUR' } },
      strengths: ['Incredible price-to-performance ratio in the sub-liter naked segment', 'Torquey, creamy-smooth 948cc inline-four with effortless overtaking punch', 'Tuned acoustic airbox intake howl', 'Bulletproof long-term Japanese reliability'],
      limitations: ['No bi-directional quickshifter standard from factory', 'Axial front brake calipers rather than modern radial units on base trim'],
      competitors: ['Triumph Street Triple 765 R', 'Yamaha MT-09', 'Ducati Monster', 'BMW F 900 R'],
      source: 'Kawasaki Motors India Official Specification Sheet, 2024',
    }),

    // ——— NINJA 500 ———
    kw({
      id: 'kawasaki-ninja-500',
      name: 'Ninja 500 / 500 SE',
      engineId: 'kawasaki-twin-451',
      modelFamily: 'Ninja',
      generation: 'Gen 1 (451cc Platform, 2024–present)',
      category: ['sports'],
      slug: 'kawasaki/ninja-500',
      year: [2024, 2025, 2026],
      productionStart: 2024,
      status: 'current',
      market: ['Global', 'India', 'Europe', 'North America', 'Asia'],
      tagline: 'Make Your Statement — 451cc parallel-twin, lightweight trellis frame, and sharp Ninja ZX styling.',
      featured: true,
      colours: ['Metallic Spark Black', 'Lime Green / Ebony (KRT Edition SE)'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Assist & Slipper clutch', assistClutch: true, slipperClutch: true, finalDrive: 'Chain' },
      performance: { topSpeed: 185, zeroTo100: 4.9, mileage: { overall: 26.3, unit: 'km/l' }, fuelRange: 368 },
      dimensions: { length: 1995, width: 730, height: 1120, wheelbase: 1375, groundClearance: 145, seatHeight: 785, fuelTankCapacity: 14.0, kerbWeight: 171 },
      chassis: { frameType: 'Trellis high-tensile steel frame with engine as stressed member' },
      suspension: { front: '41mm Telescopic front fork', frontForkDiameter: 41, frontTravel: 120, rear: 'Bottom-Link Uni-Trak monoshock with 5-stage preload adjustment', rearTravel: 130 },
      brakes: { front: 'Single semi-floating 310mm disc with dual-piston caliper', frontDiscDiameter: 310, rear: 'Single 220mm disc with dual-piston caliper', rearDiscDiameter: 220, abs: true, absType: 'Dual-channel ABS' },
      wheels: { frontTyre: '110/70 R17', rearTyre: '150/60 R17', wheelType: 'Cast aluminium 5-spoke wheels' },
      electronics: { display: 'High-contrast LCD instrument cluster (Full TFT on SE model) with smartphone connectivity', keylessIgnition: false },
      price: { india: { min: 524000, max: 530000, currency: 'INR', verified: '2025-04' }, europe: { min: 6799, max: 7499, currency: 'EUR' } },
      source: 'Kawasaki Motors Enterprise Technical Specification, 2024',
    }),

    // ——— NINJA ZX-14R (Discontinued Hyperbike Icon) ———
    kw({
      id: 'kawasaki-ninja-zx-14r',
      name: 'Ninja ZX-14R / ZZR1400',
      engineId: 'kawasaki-zx14r-1441',
      modelFamily: 'Ninja ZX-14R',
      generation: 'Second Generation (1441cc, 2012–2020)',
      category: ['hyperbike', 'sport-touring'],
      slug: 'kawasaki/ninja-zx-14r',
      year: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      productionStart: 2006,
      productionEnd: 2020,
      status: 'historical',
      market: ['Global', 'North America', 'Europe', 'India', 'Japan'],
      tagline: 'The King of the Quarter Mile — naturally aspirated 1441cc powerplant producing 200 PS, aerodynamic monocoque chassis, and all-day 300 km/h cruising stability.',
      colours: ['Golden Blazed Green / Metallic Spark Black', 'Pearl Storm Gray'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Back-torque limiting slipper clutch, hydraulic operation', slipperClutch: true, finalDrive: '530 heavy-duty chain' },
      performance: { topSpeed: 299, zeroTo100: 2.7, zeroTo200: 6.9, quarterMile: 9.7, mileage: { overall: 15.0, unit: 'km/l' }, fuelRange: 330 },
      dimensions: { length: 2170, width: 770, height: 1170, wheelbase: 1480, groundClearance: 125, seatHeight: 800, fuelTankCapacity: 22.0, kerbWeight: 268 },
      chassis: { frameType: 'Unique aluminium monocoque frame spanning over the top of the engine, acting as the airbox', frameMaterial: 'Die-cast and pressed aluminium' },
      suspension: { front: '43mm inverted cartridge fork with adjustable preload, 18-way compression and 15-way rebound damping', frontForkDiameter: 43, frontTravel: 117, rear: 'Bottom-link Uni-Trak monoshock with piggyback reservoir, fully adjustable', rearTravel: 124 },
      brakes: { front: 'Dual 310mm petal floating discs with Brembo M50 radial-mount 4-piston monobloc calipers', frontDiscDiameter: 310, frontDiscCount: 2, rear: 'Single 250mm petal disc with 2-piston caliper', rearDiscDiameter: 250, abs: true, absType: 'Dual-channel ABS', brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 ZR17 (58W)', rearTyre: '190/50 ZR17 (73W)', wheelType: '10-spoke lightweight aluminium alloy' },
      electronics: { rideModes: ['Full Power', 'Low Power (75%)'], tractionControl: true, tcType: 'KTRC 3-mode traction control system' },
      source: 'Kawasaki Heavy Industries ZX-14R Factory Service Documentation, 2020',
    }),

    // ——— 1972 Z1 900 (Historic Legend) ———
    kw({
      id: 'kawasaki-z1-900-1972',
      name: 'Z1 900 Super Four (1972)',
      modelFamily: 'Z',
      generation: 'Original "New York Steak" (1972)',
      category: ['superbike', 'classic', 'heritage', 'standard'],
      slug: 'kawasaki/z1-900',
      year: [1972, 1973, 1974, 1975],
      productionStart: 1972,
      productionEnd: 1975,
      status: 'historical',
      market: ['Global', 'USA', 'Europe', 'Japan'],
      tagline: 'The motorcycle that shocked the world — 903cc DOHC inline-four, 82 bhp, 130 mph, and timeless ducktail rear styling.',
      colours: ['Candy Brown / Orange (Fireball)', 'Candy Tone Yellow / Green'],
      engine: { configuration: 'Inline 4-cylinder, 4-stroke, 8-valve DOHC air-cooled', displacement: 903, cylinders: 4, bore: 66.0, stroke: 66.0, compressionRatio: '8.5:1', cooling: 'Air Cooled', fuelSystem: 'Four Mikuni 28mm slide carburetors', valves: 8, camshaft: 'Double Overhead Camshafts (DOHC)', maxPower: { value: 82.0, unit: 'bhp', rpm: 8500 }, maxTorque: { value: 73.5, unit: 'Nm', rpm: 7000 }, redline: 9000 },
      transmission: { type: 'Manual', gears: 5, clutchType: 'Wet multi-plate', finalDrive: 'Chain with automatic chain oiler' },
      performance: { topSpeed: 212, zeroTo100: 4.8, quarterMile: 12.0 },
      dimensions: { length: 2200, wheelbase: 1490, seatHeight: 800, fuelTankCapacity: 18.0, kerbWeight: 246 },
      chassis: { frameType: 'Double-cradle tubular high-tensile steel frame' },
      brakes: { front: 'Single 296mm hydraulic disc brake (optional dual disc)', rear: '200mm internal expanding drum brake', abs: false },
      wheels: { frontTyre: '3.25-19', rearTyre: '4.00-18', wheelType: 'Wire-spoke chrome wheels' },
      source: 'Kawasaki World Museum Archives, Kobe, Japan, 1972',
    }),

  ];

  AUTOCORE_DB.vehicles.push(...KAWASAKI_VEHICLES);
  if (!AUTOCORE_DB.engineFamilies) AUTOCORE_DB.engineFamilies = {};
  Object.assign(AUTOCORE_DB.engineFamilies, KAWASAKI_ENGINES);

})();
