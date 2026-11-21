/**
 * AUTOCORE — Motorcycle Categories
 * Complete taxonomy of 45 motorcycle and scooter types
 */

'use strict';

AUTOCORE_DB.motorcycleCategories = [
  { id: 'commuter',            name: 'Commuter',                icon: '🛵', description: 'Affordable, fuel-efficient motorcycles designed for daily city commuting. Typically 100–125cc with upright ergonomics.', displacementRange: '75–160cc', relatedTypes: ['standard','underbone'] },
  { id: 'standard',            name: 'Standard',                icon: '🏍️', description: 'Versatile, upright-position motorcycles with neutral ergonomics. The baseline motorcycle category.', displacementRange: '100–800cc', relatedTypes: ['commuter','naked'] },
  { id: 'naked',               name: 'Naked',                   icon: '🏍️', description: 'Streetbikes without fairings, exposing the engine. Sporty yet comfortable riding position.', displacementRange: '150–1200cc', relatedTypes: ['streetfighter','standard'] },
  { id: 'streetfighter',       name: 'Streetfighter',           icon: '😤', description: 'Aggressive, high-performance naked bikes derived from superbike platforms with upright bars.', displacementRange: '600–1200cc', relatedTypes: ['naked','superbike'] },
  { id: 'sports',              name: 'Sports',                  icon: '🏎️', description: 'Performance-oriented motorcycles with fairings and clip-on handlebars for spirited road riding.', displacementRange: '150–600cc', relatedTypes: ['supersport','naked'] },
  { id: 'supersport',          name: 'Supersport',              icon: '🏁', description: 'Track-focused sport bikes with full fairings, aggressive ergonomics, and high-revving engines. 600–750cc class.', displacementRange: '600–750cc', relatedTypes: ['superbike','sports'] },
  { id: 'superbike',           name: 'Superbike',               icon: '🏆', description: 'Flagship 1000cc sport bikes with cutting-edge technology, electronics, and maximum performance.', displacementRange: '900–1200cc', relatedTypes: ['supersport','hyperbike'] },
  { id: 'hyperbike',           name: 'Hyperbike',               icon: '🚀', description: 'The fastest production motorcycles, exceeding 200 bhp. Extreme top speed machines.', displacementRange: '1000–1400cc', relatedTypes: ['superbike'] },
  { id: 'hyper-naked',         name: 'Hyper-naked',             icon: '💥', description: 'Superbike-level performance in a naked chassis. Maximum power with upright ergonomics.', displacementRange: '900–1300cc', relatedTypes: ['naked','streetfighter'] },
  { id: 'cruiser',             name: 'Cruiser',                 icon: '🤠', description: 'Low-slung, feet-forward motorcycles with relaxed ergonomics. Emphasis on style and torque.', displacementRange: '250–1900cc', relatedTypes: ['power-cruiser','bobber'] },
  { id: 'power-cruiser',       name: 'Power Cruiser',           icon: '⚡', description: 'High-performance cruisers with muscular engines and sport-cruiser handling.', displacementRange: '800–1900cc', relatedTypes: ['cruiser'] },
  { id: 'bobber',              name: 'Bobber',                  icon: '🔧', description: 'Stripped-down cruisers with minimalist bodywork, solo seats, and chopped fenders.', displacementRange: '250–1800cc', relatedTypes: ['cruiser','custom'] },
  { id: 'chopper',             name: 'Chopper',                 icon: '✂️', description: 'Extended-fork custom motorcycles with radical geometry and dramatic styling.', displacementRange: '500–1800cc', relatedTypes: ['custom','cruiser'] },
  { id: 'cafe-racer',          name: 'Café Racer',              icon: '☕', description: 'Minimalist sport bikes inspired by 1960s British racing culture. Clip-ons, rear-set pegs, solo seats.', displacementRange: '250–1200cc', relatedTypes: ['retro','classic'] },
  { id: 'scrambler',           name: 'Scrambler',               icon: '🌲', description: 'Road bikes with light off-road capability — raised exhaust, block tyres, upswept pipes.', displacementRange: '250–1200cc', relatedTypes: ['retro','dual-sport'] },
  { id: 'retro',               name: 'Retro / Modern Classic',  icon: '🕰️', description: 'Modern motorcycles with vintage-inspired styling, combining classic aesthetics with contemporary technology.', displacementRange: '250–1200cc', relatedTypes: ['classic','heritage','cafe-racer'] },
  { id: 'classic',             name: 'Classic',                 icon: '👑', description: 'Traditional motorcycle designs with timeless styling cues, chrome finishes, and round headlamps.', displacementRange: '250–1200cc', relatedTypes: ['retro','heritage'] },
  { id: 'heritage',            name: 'Heritage',                icon: '🏛️', description: 'Motorcycles celebrating a manufacturer\'s historical design language with modern underpinnings.', displacementRange: '350–1900cc', relatedTypes: ['classic','retro'] },
  { id: 'adventure',           name: 'Adventure',               icon: '🏔️', description: 'Versatile dual-purpose motorcycles built for long-distance travel on mixed road and off-road terrain.', displacementRange: '250–1300cc', relatedTypes: ['adventure-touring','dual-sport'] },
  { id: 'adventure-touring',   name: 'Adventure Touring',       icon: '🌍', description: 'Large-displacement adventure bikes optimized for long-distance touring with luggage and comfort.', displacementRange: '800–1300cc', relatedTypes: ['adventure','touring'] },
  { id: 'sport-touring',       name: 'Sport Touring',           icon: '🗺️', description: 'Motorcycles combining sport bike performance with touring comfort — fairings, luggage, and electronics.', displacementRange: '600–1400cc', relatedTypes: ['touring','sports'] },
  { id: 'touring',             name: 'Touring',                 icon: '🛣️', description: 'Full-dress touring motorcycles with wind protection, luggage, and passenger amenities for highway travel.', displacementRange: '1000–1900cc', relatedTypes: ['grand-touring','sport-touring'] },
  { id: 'grand-touring',       name: 'Grand Touring',           icon: '🏰', description: 'The most luxurious touring machines with every amenity — heated seats, audio, GPS, and maximum storage.', displacementRange: '1600–1900cc', relatedTypes: ['touring'] },
  { id: 'dual-sport',          name: 'Dual-Sport',              icon: '🔀', description: 'Street-legal motorcycles equally capable on-road and off-road. Licensed for highway use with off-road geometry.', displacementRange: '200–700cc', relatedTypes: ['enduro','adventure'] },
  { id: 'enduro',              name: 'Enduro',                  icon: '🌿', description: 'Off-road competition motorcycles with minimal road equipment. Long-travel suspension, lightweight.', displacementRange: '125–700cc', relatedTypes: ['dual-sport','motocross'] },
  { id: 'motocross',           name: 'Motocross',               icon: '🏁', description: 'Purpose-built racing motorcycles for closed-course dirt competition. Not road-legal.', displacementRange: '85–450cc', relatedTypes: ['enduro','dirt-bike'] },
  { id: 'trail',               name: 'Trail',                   icon: '🌲', description: 'Beginner-friendly off-road capable bikes with low seat heights and gentle power delivery.', displacementRange: '100–250cc', relatedTypes: ['dual-sport','dirt-bike'] },
  { id: 'dirt-bike',           name: 'Dirt Bike',               icon: '💨', description: 'Lightweight, long-travel suspension motorcycles designed primarily for off-road terrain.', displacementRange: '50–450cc', relatedTypes: ['motocross','enduro','trail'] },
  { id: 'supermoto',           name: 'Supermoto',               icon: '🔥', description: 'Dirt bikes converted for road use with 17-inch supermoto wheels, road tyres, and road brakes.', displacementRange: '250–700cc', relatedTypes: ['dual-sport','enduro'] },
  { id: 'trial',               name: 'Trial / Trials',          icon: '⛰️', description: 'Ultra-lightweight motorcycles designed for observed trials — navigating obstacles at very low speeds.', displacementRange: '125–300cc', relatedTypes: ['enduro'] },
  { id: 'track-only',          name: 'Track-Only',              icon: '🏟️', description: 'Production motorcycles sold without road registration, homologated only for track use.', displacementRange: '600–1200cc', relatedTypes: ['racing','superbike'] },
  { id: 'racing',              name: 'Racing',                  icon: '🏆', description: 'Competition motorcycles built to specific race class regulations. MotoGP, WSBK, BSB.', displacementRange: 'Varies', relatedTypes: ['track-only','superbike'] },
  { id: 'mini-moto',           name: 'Mini Motorcycle',         icon: '🏍️', description: 'Small-displacement motorcycles with reduced dimensions. Often used for training or urban commuting.', displacementRange: '50–125cc', relatedTypes: ['pocket-bike'] },
  { id: 'pocket-bike',         name: 'Pocket Bike',             icon: '🤏', description: 'Miniature racing motorcycles, typically 1/3 scale, used for recreational or entry-level racing.', displacementRange: '40–110cc', relatedTypes: ['mini-moto'] },
  { id: 'underbone',           name: 'Underbone',               icon: '🛵', description: 'Step-through frame motorcycles popular in Southeast Asia. Practical commuters with small engines.', displacementRange: '100–150cc', relatedTypes: ['commuter','moped'] },
  { id: 'moped',               name: 'Moped',                   icon: '🚲', description: 'Low-powered two-wheelers, often with pedals or step-through frames. Typically under 50cc.', displacementRange: '25–50cc', relatedTypes: ['scooter','underbone'] },
  { id: 'scooter',             name: 'Scooter',                 icon: '🛵', description: 'Step-through platform with CVT transmission, underseat storage, and smaller wheels. Urban-focused.', displacementRange: '50–200cc', relatedTypes: ['maxi-scooter','moped'] },
  { id: 'maxi-scooter',        name: 'Maxi-Scooter',            icon: '🛴', description: 'Large-displacement scooters with highway capability, storage, and touring amenities.', displacementRange: '250–850cc', relatedTypes: ['scooter','touring'] },
  { id: 'electric-motorcycle',  name: 'Electric Motorcycle',     icon: '⚡', description: 'Battery-electric motorcycles with electric motors. Zero emissions, instant torque delivery.', displacementRange: 'N/A (kW)', relatedTypes: ['electric-scooter'] },
  { id: 'electric-scooter',     name: 'Electric Scooter',        icon: '🔌', description: 'Battery-electric scooters for urban commuting. Quiet operation, low running costs.', displacementRange: 'N/A (kW)', relatedTypes: ['electric-motorcycle','scooter'] },
  { id: 'electric-dirt-bike',   name: 'Electric Dirt Bike',      icon: '⚡', description: 'Battery-electric off-road motorcycles. Silent operation ideal for trail riding and closed courses.', displacementRange: 'N/A (kW)', relatedTypes: ['electric-motorcycle','dirt-bike'] },
  { id: 'three-wheeler',       name: 'Three-Wheeled Motorcycle', icon: '🔺', description: 'Motorized three-wheeled vehicles that lean or tilt. Includes trikes and reverse-trikes.', displacementRange: '300–2500cc', relatedTypes: ['touring'] },
  { id: 'sidecar',             name: 'Sidecar Motorcycle',      icon: '🏍️', description: 'Motorcycles fitted with an attached sidecar for passenger or cargo carrying.', displacementRange: '600–1600cc', relatedTypes: ['touring','three-wheeler'] },
  { id: 'custom',              name: 'Custom Motorcycle',       icon: '🎨', description: 'One-off or heavily modified motorcycles built to individual specifications. Unique builds.', displacementRange: 'Varies', relatedTypes: ['bobber','chopper','cafe-racer'] },
  { id: 'limited-edition',     name: 'Limited Edition',         icon: '💎', description: 'Restricted production run motorcycles with exclusive paint, components, or engineering upgrades.', displacementRange: 'Varies', relatedTypes: [] },
];

// Add category lookup utility
AUTOCORE_DB.getMotorcycleCategory = function(id) {
  return this.motorcycleCategories.find(c => c.id === id);
};

AUTOCORE_DB.getMotorcycleCategoryName = function(id) {
  const cat = this.getMotorcycleCategory(id);
  return cat ? cat.name : id.replace(/-/g, ' ');
};
