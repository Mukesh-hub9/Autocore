/**
 * AUTOCORE — Ducati Motor Holding Complete Motorcycle Catalog
 * Researched from Ducati Motor Holding S.p.A. (Borgo Panigale) official engineering dossiers.
 *
 * Desmodromic valve systems, Desmosedici Stradale V4s, Superquadro Mono, Multistrada, and historic legends.
 *
 * Sources:
 *   - Ducati Media House & Official Technical Archives (ducati.com)
 *   - Ducati Factory Workshop Manuals (Panigale V4, DesertX, Hypermotard 698 Mono, Multistrada V4)
 *   - FIM MotoGP & WorldSBK Championship Homologation Dossiers
 *
 * Last verified: October 2026
 */

'use strict';

(function () {

  // ===== ENGINE FAMILIES =====
  const DUCATI_ENGINES = {

    'ducati-stradale-1103': {
      id: 'ducati-stradale-1103',
      name: 'Desmosedici Stradale 1103cc 90° V4',
      manufacturer: 'Ducati',
      type: '90° V4, 4-stroke, liquid-cooled, Desmodromic 4 valves per cylinder with counter-rotating crankshaft',
      displacement: 1103,
      cylinders: 4,
      cylinderConfig: '90° V4 banked rearward 42°',
      bore: 81.0,
      stroke: 53.5,
      compressionRatio: '14.0:1',
      valvesPerCylinder: 4,
      valvetrain: 'Desmodromic system (mechanical closing cam without return springs)',
      crankshaft: 'Counter-rotating crankshaft with 70° crank pin offset (Twin Pulse firing order: 0°-90°-290°-380°)',
      cooling: 'Liquid Cooled with dual curved radiators and dedicated water/oil heat exchangers',
      fuelSystem: 'Electronic fuel injection with twin injectors per cylinder and full Ride-by-Wire elliptical throttle bodies with variable-height intake trumpets',
      throttle: 'Ride-by-Wire with variable-length intake funnels',
      maxPower: { value: 216.0, unit: 'bhp', rpm: 13500 },
      maxTorque: { value: 120.9, unit: 'Nm', rpm: 11250 },
      redline: 14500,
      oilCapacity: 4.2,
      oilGrade: 'Shell Advance Ducati 15W-50 Fully Synthetic',
      valveCheckInterval: '24,000 km (Desmo Service)',
      emissionStandard: 'Euro 5+',
      source: 'Ducati Panigale V4 Factory Technical Manual, Borgo Panigale',
    },

    'ducati-superquadro-mono-659': {
      id: 'ducati-superquadro-mono-659',
      name: 'Superquadro Mono 659cc Desmodromic Single',
      manufacturer: 'Ducati',
      type: 'Single-cylinder 4-stroke, 4-valve Desmodromic, liquid-cooled with dual balance shafts',
      displacement: 659,
      cylinders: 1,
      bore: 116.0,
      stroke: 62.4,
      compressionRatio: '13.1:1',
      valvesPerCylinder: 4,
      valvetrain: 'Desmodromic system with DLC-coated rocker arms, titanium intake valves (46.8mm), steel exhaust valves (38.2mm)',
      worldRecord: 'World\'s highest-revving and most powerful single-cylinder road production engine (10,250 RPM redline)',
      cooling: 'Liquid Cooled with high-flow water pump',
      fuelSystem: 'Oval-section 62mm Ride-by-Wire throttle body with under-butterfly injector',
      throttle: 'Full Ride-by-Wire',
      maxPower: { value: 77.5, unit: 'bhp', rpm: 9750 },
      racingExhaustPower: { value: 84.5, unit: 'bhp', rpm: 9500 },
      maxTorque: { value: 63.0, unit: 'Nm', rpm: 8000 },
      redline: 10250,
      balanceShafts: 'Dual balance shafts driven by gear cascade to cancel first-order inertia forces completely',
      oilCapacity: 1.8,
      oilGrade: 'Shell Advance 15W-50',
      valveCheckInterval: '30,000 km (Desmo Service)',
      emissionStandard: 'Euro 5+',
      source: 'Ducati Hypermotard 698 Mono Factory Press Dossier, 2024',
    },

    'ducati-granturismo-1158': {
      id: 'ducati-granturismo-1158',
      name: 'V4 Granturismo 1158cc 90° V4 (Spring Valves)',
      manufacturer: 'Ducati',
      type: '90° V4, 4-stroke, liquid-cooled, 4 valves per cylinder with conventional spring return valve gear',
      displacement: 1158,
      cylinders: 4,
      bore: 83.0,
      stroke: 53.5,
      compressionRatio: '14.0:1',
      valvesPerCylinder: 4,
      valvetrain: 'DOHC with chain and gear drive, finger followers, and valve springs (engineered specifically for record service intervals)',
      crankshaft: 'Counter-rotating crankshaft with Twin Pulse firing order',
      cylinderDeactivation: 'Rear cylinder bank deactivation at idle and low vehicle speeds to reduce heat radiation and fuel consumption',
      cooling: 'Liquid Cooled',
      fuelSystem: 'Ride-by-Wire with 46mm elliptical throttle bodies',
      maxPower: { value: 170.0, unit: 'bhp', rpm: 10750 },
      maxTorque: { value: 125.0, unit: 'Nm', rpm: 8750 },
      oilChangeInterval: '15,000 km / 2 years',
      valveCheckInterval: '60,000 km (Unprecedented in high-performance motorcycling)',
      emissionStandard: 'Euro 5+',
      source: 'Ducati Multistrada V4 Factory Service Manual',
    },

    'ducati-testastretta-937': {
      id: 'ducati-testastretta-937',
      name: 'Testastretta 11° 937cc L-Twin Desmo',
      manufacturer: 'Ducati',
      type: '90° L-twin, 4-stroke, 4-valve Desmodromic per cylinder, liquid-cooled',
      displacement: 937,
      cylinders: 2,
      bore: 94.0,
      stroke: 67.5,
      compressionRatio: '13.3:1',
      valvesPerCylinder: 4,
      valvetrain: 'Desmodromic system with 11° valve overlap angle for smooth low-rpm torque delivery',
      cooling: 'Liquid Cooled',
      fuelSystem: 'Electronic fuel injection with 53mm Ride-by-Wire cylindrical throttle bodies',
      maxPower: { value: 111.0, unit: 'bhp', rpm: 9250 },
      maxTorque: { value: 93.0, unit: 'Nm', rpm: 6500 },
      redline: 10500,
      valveCheckInterval: '30,000 km (Desmo Service)',
      emissionStandard: 'Euro 5+',
      source: 'Ducati Monster SP & DesertX Technical Manual',
    },

    'ducati-superquadro-955': {
      id: 'ducati-superquadro-955',
      name: 'Superquadro 955cc 90° L-Twin Desmo',
      manufacturer: 'Ducati',
      type: '90° L-twin, 4-stroke, 4-valve Desmodromic per cylinder, liquid-cooled with chain/gear hybrid cam drive',
      displacement: 955,
      cylinders: 2,
      bore: 100.0,
      stroke: 60.8,
      compressionRatio: '12.5:1',
      valvesPerCylinder: 4,
      valvetrain: 'Desmodromic system with DLC-coated finger followers',
      cooling: 'Liquid Cooled',
      fuelSystem: 'Twin injectors per cylinder with oval throttle bodies (62mm equivalent)',
      maxPower: { value: 155.0, unit: 'bhp', rpm: 10750 },
      maxTorque: { value: 104.0, unit: 'Nm', rpm: 9000 },
      redline: 11500,
      valveCheckInterval: '24,000 km (Desmo Service)',
      emissionStandard: 'Euro 5',
      source: 'Ducati Panigale V2 Technical Dossier',
    },

    'ducati-desmodue-803': {
      id: 'ducati-desmodue-803',
      name: 'Desmodue 803cc Air-Cooled 2V L-Twin',
      manufacturer: 'Ducati',
      type: '90° L-twin, 4-stroke, 2-valve Desmodromic per cylinder, air-cooled',
      displacement: 803,
      cylinders: 2,
      bore: 88.0,
      stroke: 66.0,
      compressionRatio: '11.0:1',
      valvesPerCylinder: 2,
      camshaft: 'SOHC per cylinder with belt drive',
      cooling: 'Air Cooled with front-mounted oil cooler',
      fuelSystem: 'Electronic fuel injection with 50mm Ride-by-Wire throttle body',
      maxPower: { value: 73.0, unit: 'bhp', rpm: 8250 },
      maxTorque: { value: 65.2, unit: 'Nm', rpm: 7000 },
      valveCheckInterval: '12,000 km (Desmo Service)',
      emissionStandard: 'Euro 5+',
      source: 'Ducati Scrambler Factory Workshop Manual',
    },
  };

  // Enhance Ducati in manufacturers directory
  const mfrIdx = AUTOCORE_DB.manufacturers.findIndex(m => m.id === 'ducati');
  if (mfrIdx >= 0) {
    Object.assign(AUTOCORE_DB.manufacturers[mfrIdx], {
      fullName: 'Ducati Motor Holding S.p.A.',
      parentCompany: 'Audi Group (Audi AG via Automobili Lamborghini S.p.A. / Volkswagen Group)',
      country: 'Italy',
      flag: '🇮🇹',
      founded: 1926,
      hq: 'Borgo Panigale, Bologna, Italy (Motor Valley)',
      ceo: 'Claudio Domenicali',
      tagline: 'Style, Sophistication, Performance',
      website: 'https://www.ducati.com',
      description: 'The world\'s most successful superbike racing marque and reigning MotoGP & WorldSBK world champions. Renowned for Italian design, Desmodromic mechanical valve actuation, single-sided swingarms, counter-rotating crankshafts, and blistering V4 and L-twin performance.',
      history: 'Founded in 1926 in Bologna by the Ducati brothers initially producing radio components. After WWII, Ducati developed the Cucciolo clip-on engine in 1946. Legendary engineer Fabio Taglioni introduced the trademark Desmodromic valvetrain in 1956 and the 90° L-twin in 1970. Paul Smart\'s famous 1972 Imola 200 win established Ducati\'s racing mythos. The 1993 Monster created the modern naked segment, and Massimo Tamburini\'s 1994 Ducati 916 remains one of the most celebrated industrial designs in human history.',
      engineFamilies: DUCATI_ENGINES,
      platforms: ['Front Frame Aluminium Monocoque (Panigale / Streetfighter / Monster)', 'Steel Tubular Trellis Chassis (DesertX / Scrambler)', 'Aluminium Monocoque Adventure Chassis (Multistrada V4)', 'Lightweight Steel Trellis Supermoto (Hypermotard 698)'],
    });
  }

  // Remove old ducati vehicles
  AUTOCORE_DB.vehicles = AUTOCORE_DB.vehicles.filter(v => v.manufacturer !== 'ducati');

  function dc(data) {
    const base = {
      manufacturer: 'ducati',
      type: 'motorcycle',
      source: 'Ducati Motor Holding Official Technical Specifications',
      sourceVerifiedDate: '2026-10',
    };
    const eng = data.engineId ? DUCATI_ENGINES[data.engineId] : null;
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
        camshaft: eng.valvetrain || eng.camshaft,
        maxPower: eng.maxPower,
        maxTorque: eng.maxTorque,
        redline: eng.redline,
        oilCapacity: eng.oilCapacity,
        oilGrade: eng.oilGrade,
      };
    }
    return Object.assign(base, data);
  }

  const DUCATI_VEHICLES = [

    // ——— PANIGALE V4 S (2025 Next-Gen) ———
    dc({
      id: 'ducati-panigale-v4-s',
      name: 'Panigale V4 S',
      engineId: 'ducati-stradale-1103',
      modelFamily: 'Panigale',
      generation: 'Gen 7 (Seventh Generation Redesign, 2025–present)',
      category: ['superbike'],
      slug: 'ducati/panigale-v4-s',
      year: [2025, 2026],
      productionStart: 2024,
      status: 'current',
      market: ['Global', 'Europe', 'North America', 'Japan', 'India'],
      tagline: 'The Wonder of Speed — 216 bhp Desmosedici Stradale V4, Öhlins Smart EC 3.0, Brembo Hypure calipers, and double-sided hollow symmetrical swingarm.',
      featured: true,
      colours: ['Ducati Red with Dark Grey Frame and Black Rims'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Hydraulically controlled slipper and self-servo wet multiplate clutch', assistClutch: true, slipperClutch: true, quickShifter: true, quickshifterType: 'Ducati Quick Shift (DQS) 2.0 up/down without microswitch', finalDrive: '525 chain' },
      performance: { topSpeed: 305, zeroTo100: 2.8, zeroTo200: 6.7, quarterMile: 9.7, mileage: { overall: 15.4, unit: 'km/l' }, fuelRange: 261, source: 'Ducati factory instrumented testing' },
      dimensions: { wheelbase: 1485, groundClearance: 135, seatHeight: 850, fuelTankCapacity: 17.0, kerbWeight: 187, dryWeight: 182 },
      chassis: { frameType: 'Front Frame in aluminium alloy with optimized lateral stiffness (-40% lateral stiffness for superior mid-corner feel)', frameMaterial: 'Aluminium alloy casting', swingarmType: 'Ducati Hollow Symmetrical double-sided swingarm in die-cast aluminium (-37% lateral stiffness)', swingarmMaterial: 'Die-cast aluminium', rake: 24.0, trail: 98 },
      suspension: { front: 'Öhlins NPX 30 43mm pressurized inverted fork with Öhlins Smart EC 3.0 event-based electronic control', frontManufacturer: 'Öhlins', frontForkDiameter: 43, frontTravel: 125, rear: 'Öhlins TTX36 monoshock with Smart EC 3.0 event-based electronic control', rearTravel: 130, rearManufacturer: 'Öhlins', electronicSuspension: true },
      brakes: { front: 'Dual 330mm semi-floating discs with new Brembo Hypure radial-mount 4-piston monobloc calipers (world premiere)', frontDiscDiameter: 330, frontDiscCount: 2, frontCaliperType: 'Brembo Hypure Monobloc 4-piston (lighter and better heat dissipation than Stylema)', rear: 'Single 245mm disc with Brembo 2-piston caliper', rearDiscDiameter: 245, abs: true, absType: 'Bosch eCBS Race combined braking system (automatically applies rear brake during trail-braking up to corner apex)', corneringAbs: true, switchableAbs: true, brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 ZR17', rearTyre: '200/60 ZR17', wheelType: 'Forged aluminium 5-tangent-spoke lightweight wheels', tyreBrand: 'Pirelli Diablo Supercorsa SP V4' },
      electronics: { rideByWire: true, rideModes: ['Race:A', 'Race:B', 'Sport', 'Road', 'Wet'], tractionControl: true, tcType: 'Ducati Traction Control (DTC) DVO (Ducati Vehicle Observer algorithms)', slideControl: true, wheelieControl: true, launchControl: true, engineBrakingControl: true, display: '6.9-inch 8:3 ratio full-colour high-resolution TFT display with Track and Info Mode', aerodynamicWinglets: 'Double-profile integrated fairing winglets generating 30 kg downforce at 270 km/h' },
      price: { europe: { min: 33990, max: 35000, currency: 'EUR' }, usa: { min: 31995, max: 32500, currency: 'USD' }, india: { min: 3250000, max: 3400000, currency: 'INR', verified: '2025' } },
      strengths: ['World premiere Brembo Hypure calipers provide benchmark initial bite and thermal resistance', '6.9-inch ultra-wide 8:3 display offers richest telemetry feedback in superbike segment', 'Counter-rotating crankshaft significantly reduces front-wheel lift during hard acceleration', 'Ducati Vehicle Observer (DVO) algorithm simulates 70 physical sensors using advanced math models'],
      limitations: ['Exhaust heat radiates heavily near rider inner thighs during traffic riding', 'Desmo valve service requires specialized Ducati factory certified technician'],
      competitors: ['BMW M 1000 RR', 'Honda CBR1000RR-R Fireblade SP', 'Yamaha YZF-R1M', 'Aprilia RSV4 Factory 1100'],
      source: 'Ducati Motor Holding Press Dossier, World Premiere 2025, Borgo Panigale',
    }),

    // ——— HYPERMOTARD 698 MONO (World's Most Powerful Single) ———
    dc({
      id: 'ducati-hypermotard-698-mono',
      name: 'Hypermotard 698 Mono / RVE',
      engineId: 'ducati-superquadro-mono-659',
      modelFamily: 'Hypermotard',
      generation: 'First Generation Superquadro Mono (2024–present)',
      category: ['supermoto', 'naked'],
      slug: 'ducati/hypermotard-698-mono',
      year: [2024, 2025, 2026],
      productionStart: 2024,
      status: 'current',
      market: ['Global', 'Europe', 'North America', 'Japan', 'India'],
      tagline: 'Live. Play. Ride. — 77.5 bhp Desmodromic single, 151 kg wet weight without fuel, and Wheelie Assist.',
      featured: true,
      colours: ['Ducati Red', 'RVE Livery (Graffiti-Style Matte Graphics with Red Frame)'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Wet multiplate slipper clutch, hydraulically operated', slipperClutch: true, quickShifter: true, quickshifterType: 'DQS (Ducati Quick Shift) up/down (standard on RVE, optional on standard)', finalDrive: '520 chain' },
      performance: { topSpeed: 205, zeroTo100: 3.5, mileage: { overall: 20.8, unit: 'km/l' }, fuelRange: 250 },
      dimensions: { wheelbase: 1443, groundClearance: 261, seatHeight: 904, fuelTankCapacity: 12.0, kerbWeight: 160, dryWeight: 151 },
      chassis: { frameType: 'Steel tube trellis frame with variable section tubing weighing only 7.2 kg', frameMaterial: 'High-tensile tubular steel', swingarmType: 'Aluminium double-sided gravity die-cast swingarm weighing 3.9 kg', rake: 26.1, trail: 108 },
      suspension: { front: 'Marzocchi 45mm fully adjustable inverted forks with aluminium stanchions (only 8.1 kg weight)', frontManufacturer: 'Marzocchi', frontForkDiameter: 45, frontTravel: 215, frontAdjustability: 'Fully adjustable compression, rebound damping, and spring preload', rear: 'Fully adjustable Sachs monoshock with progressive linkage', rearTravel: 240, rearManufacturer: 'Sachs', rearAdjustability: 'Fully adjustable compression, rebound, and spring preload' },
      brakes: { front: 'Single 330mm aluminium flange disc with Brembo M4.32 radial-mount 4-piston caliper and radial pump with 5-click adjustable lever', frontDiscDiameter: 330, frontCaliperType: 'Brembo M4.32 radial 4-piston', rear: 'Single 245mm disc with Brembo 1-piston floating caliper', rearDiscDiameter: 245, abs: true, absType: 'Bosch 4-level Cornering ABS with "Slide-by-Brake" supermoto drift function', corneringAbs: true, switchableAbs: true, brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 ZR17', rearTyre: '160/60 ZR17', wheelType: '5-Y-spoke cast alloy lightweight wheels (save 0.5 kg)', tyreBrand: 'Pirelli Diablo Rosso IV' },
      electronics: { rideByWire: true, rideModes: ['Sport', 'Road', 'Urban', 'Wet'], tractionControl: true, tcType: 'DTC (Ducati Traction Control 4-level)', engineBrakingControl: true, wheelieControl: true, wheelieAssist: 'Ducati Wheelie Control with available Ducati Performance Wheelie Assist software (sustains continuous balanced wheelies)', display: '3.8-inch IBN (Improved Black Nematic) LCD display' },
      price: { europe: { min: 12890, max: 14390, currency: 'EUR' }, usa: { min: 12995, max: 14495, currency: 'USD' }, india: { min: 1350000, max: 1500000, currency: 'INR', verified: '2025' } },
      strengths: ['World record 77.5 bhp from a 659cc single-cylinder motor revving past 10,000 RPM', 'Featherweight 151 kg dry weight makes directional changes instantaneous', 'Slide-by-Brake ABS mode enables controlled entry drifts using rear brake pedal', 'Tremendous 215mm front / 240mm rear suspension travel'],
      limitations: ['Tall 904mm seat height requires tall inseam or supermoto sliding technique', 'Firm suspension setup uncompromising on poor broken tarmac'],
      competitors: ['KTM 690 SMC R', 'Husqvarna 701 Supermoto', 'GASGAS SM 700'],
      source: 'Ducati Motor Holding Technical Press Kit, Borgo Panigale, 2024',
    }),

    // ——— MULTISTRADA V4 RALLY ———
    dc({
      id: 'ducati-multistrada-v4-rally',
      name: 'Multistrada V4 Rally',
      engineId: 'ducati-granturismo-1158',
      modelFamily: 'Multistrada',
      generation: 'V4 Generation (2023–present)',
      category: ['adventure', 'adventure-touring', 'touring'],
      slug: 'ducati/multistrada-v4-rally',
      year: [2023, 2024, 2025, 2026],
      productionStart: 2023,
      status: 'current',
      market: ['Global', 'Europe', 'North America', 'Japan', 'India'],
      tagline: 'Unlock Earth — 30-litre aluminium tank, 200mm Skyhook suspension travel, front/rear radar cruise, and 60,000 km valve check intervals.',
      featured: true,
      colours: ['Ducati Red with Brushed Aluminium Tank', 'Iceberg White with Brushed Aluminium Tank'],
      transmission: { type: 'Manual', gears: 6, clutchType: 'Slipper and self-servo wet multiplate clutch', assistClutch: true, slipperClutch: true, quickShifter: true, quickshifterType: 'DQS (Ducati Quick Shift) up/down', finalDrive: 'Regina HPE maintenance-free chain' },
      performance: { topSpeed: 250, zeroTo100: 3.4, mileage: { overall: 15.2, unit: 'km/l' }, fuelRange: 456 },
      dimensions: { wheelbase: 1572, groundClearance: 235, seatHeight: 870, seatHeightAdjustable: '870mm to 890mm (820mm to 910mm with seat accessories)', fuelTankCapacity: 30.0, kerbWeight: 260, dryWeight: 227 },
      chassis: { frameType: 'Aluminium monocoque front frame with steel trellis subframe', subframe: 'Steel tube trellis' },
      suspension: { front: 'Marzocchi 50mm fully adjustable inverted fork with Ducati Skyhook Suspension (DSS) EVO semi-active electronic damping', frontManufacturer: 'Marzocchi / DSS', frontForkDiameter: 50, frontTravel: 200, rear: 'Fully adjustable monoshock with DSS EVO semi-active control and Autoleveling function', rearTravel: 200, electronicSuspension: true, easyLift: 'Minimum Preload function (drops ride height at stops) & Easy Lift (softens damping when turning on bike to lift effortlessly off side stand)' },
      brakes: { front: 'Dual 330mm semi-floating discs with Brembo Stylema radial-mount 4-piston monobloc calipers', frontDiscDiameter: 330, frontDiscCount: 2, frontCaliperType: 'Brembo Stylema radial monobloc 4-piston', rear: 'Single 265mm disc with Brembo 2-piston floating caliper', rearDiscDiameter: 265, abs: true, absType: 'Bosch-Brembo 10.3ME Cornering ABS with Off-road mode', corneringAbs: true, switchableAbs: true, brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 R19 (Tubeless)', rearTyre: '170/60 R17 (Tubeless)', frontWheelDiameter: 19, rearWheelDiameter: 17, wheelType: 'Tubeless spoked wheels with black aluminium rims', tyreBrand: 'Pirelli Scorpion Trail II / Scorpion Rally STR' },
      electronics: { rideByWire: true, rideModes: ['Sport', 'Touring', 'Urban', 'Enduro (77 bhp dedicated off-road map)'], tractionControl: true, radarTechnology: 'Front and Rear Radar with Adaptive Cruise Control (ACC) and Blind Spot Detection (BSD)', display: '6.5-inch full-colour TFT with Ducati Connect optical bonding and full GPS map navigation', heatedGrips: true, heatedSeats: true },
      price: { europe: { min: 27490, max: 31000, currency: 'EUR' }, usa: { min: 29995, max: 33000, currency: 'USD' }, india: { min: 2972000, max: 3200000, currency: 'INR', verified: '2024' } },
      strengths: ['Unrivaled 60,000 km valve check interval virtually eliminates major maintenance downtime', 'Front and rear radar provides effortless highway touring with adaptive cruise and blind spot warnings', 'Massive 30-litre sculpted aluminium fuel tank grants true cross-continent range', '170 bhp V4 Granturismo offers superbike-level overtaking power loaded with luggage and passenger'],
      limitations: ['Heavy at 260 kg when fully fueled with 30 litres of gasoline', 'High fuel consumption when cruising at high speeds above 150 km/h'],
      competitors: ['BMW R 1300 GS / Adventure', 'KTM 1290 Super Adventure R', 'Triumph Tiger 1200 Rally Explorer'],
      source: 'Ducati Multistrada V4 Rally Factory Dossier, 2024',
    }),

    // ——— DUCATI 916 (Massimo Tamburini Masterpiece 1994) ———
    dc({
      id: 'ducati-916-historical',
      name: 'Ducati 916 (1994 Design Icon)',
      modelFamily: '916',
      generation: 'First Generation (1994–1998)',
      category: ['superbike', 'classic', 'heritage'],
      slug: 'ducati/916-1994',
      year: [1994, 1995, 1996, 1997, 1998],
      productionStart: 1994,
      productionEnd: 1998,
      status: 'historical',
      market: ['Global', 'Europe', 'North America', 'Japan'],
      tagline: 'Art on Two Wheels — Massimo Tamburini\'s masterpiece with underseat exhausts, twin slit headlamps, and single-sided swingarm. 4 WorldSBK titles with Carl Fogarty.',
      colours: ['Ducati Red with Gold Trellis Frame', 'Yellow Monoposto'],
      engine: { configuration: '90° L-twin, 4-stroke, 8-valve Desmodromic, liquid-cooled', displacement: 916, cylinders: 2, bore: 94.0, stroke: 66.0, compressionRatio: '11.0:1', cooling: 'Liquid Cooled', fuelSystem: 'Weber-Marelli electronic fuel injection with one injector per cylinder', valves: 8, valvetrain: 'Desmodromic DOHC driven by toothed timing belts', maxPower: { value: 114.0, unit: 'bhp', rpm: 9000 }, maxTorque: { value: 90.0, unit: 'Nm', rpm: 6900 }, redline: 10000 },
      transmission: { type: 'Manual', gears: 6, clutchType: 'Dry multiplate clutch with hydraulic actuation (signature Ducati dry clutch rattle)', finalDrive: '525 chain' },
      performance: { topSpeed: 260, zeroTo100: 3.2, quarterMile: 10.7 },
      dimensions: { length: 2050, wheelbase: 1410, seatHeight: 790, fuelTankCapacity: 17.0, kerbWeight: 204, dryWeight: 195 },
      chassis: { frameType: 'Chrome-moly steel tubular trellis frame', frameMaterial: 'ALS 450 steel tubing', swingarmType: 'Single-sided cast aluminium swingarm' },
      suspension: { front: 'Showa 43mm fully adjustable inverted forks with steering damper', frontTravel: 127, rear: 'Showa fully adjustable monoshock (Öhlins on SP versions)', rearTravel: 130 },
      brakes: { front: 'Dual 320mm Brembo semi-floating cast iron discs with 4-piston calipers', frontDiscDiameter: 320, frontDiscCount: 2, rear: 'Single 220mm disc with Brembo 2-piston caliper', rearDiscDiameter: 220, abs: false, brakeManufacturer: 'Brembo' },
      wheels: { frontTyre: '120/70 ZR17', rearTyre: '190/50 ZR17', wheelType: 'Brembo 3-spoke cast lightweight alloy wheels' },
      source: 'Ducati Museum Archives, Borgo Panigale, Bologna, Italy, 1994',
    }),

  ];

  AUTOCORE_DB.vehicles.push(...DUCATI_VEHICLES);
  if (!AUTOCORE_DB.engineFamilies) AUTOCORE_DB.engineFamilies = {};
  Object.assign(AUTOCORE_DB.engineFamilies, DUCATI_ENGINES);

})();
