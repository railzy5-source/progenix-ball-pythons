
import { CollectionData, WeightLogEntry, FeedingLogEntry, SheddingLogEntry, Snake, Pairing, Clutch, InventoryItem } from './types';
import { calculateShoppingList } from './services/shoppingListService';

// --- DATA HELPERS ---
// Helper to create feeding log
const f = (date: string, item: string, result: 'Eaten' | 'Refused' = 'Eaten', notes?: string): FeedingLogEntry => ({
  id: `F-${Math.random().toString(36).substr(2, 9)}`,
  type: 'Feeding',
  date,
  item,
  result,
  notes
});

// Helper to create weight log
const w = (date: string, weight: number): WeightLogEntry => ({
  id: `W-${Math.random().toString(36).substr(2, 9)}`,
  type: 'Weight',
  date,
  weight
});

// Helper to create shedding log
const s = (date: string, quality: 'Perfect' | 'Good' | 'Bad' | 'Incomplete' = 'Perfect', notes?: string): SheddingLogEntry => ({
  id: `S-${Math.random().toString(36).substr(2, 9)}`,
  type: 'Shedding',
  date,
  quality,
  notes
});

// --- PDS001 DATA ---
const logsPDS001 = [
  w("2025-04-09", 125), w("2025-04-24", 170), w("2025-05-01", 202), w("2025-05-06", 224), w("2025-05-18", 264), 
  w("2025-05-30", 285), w("2025-06-09", 298), w("2025-06-22", 354), w("2025-07-12", 409), w("2025-08-04", 488), 
  w("2025-08-23", 513), w("2025-09-15", 579), w("2025-10-22", 643), w("2025-11-30", 745), w("2025-12-15", 762), 
  w("2026-01-06", 844), w("2026-02-13", 914),
  f("2025-04-09", "🐀Medium ASF (20–29g)", "Eaten", "test"), f("2025-04-17", "🐀Medium ASF (20–29g)"), 
  f("2025-04-21", "🐀Medium ASF (20–29g)"), f("2025-04-25", "🐀Medium ASF (20–29g)"), f("2025-04-29", "🐀Medium ASF (20–29g)"), 
  f("2025-05-03", "🐀Medium ASF (20–29g)"), f("2025-05-08", "🐀Medium ASF (20–29g)"), f("2025-05-12", "🐀Medium ASF (20–29g)"), 
  f("2025-05-16", "🐀Medium ASF (20–29g)"), f("2025-05-21", "🐀Medium ASF (20–29g)"), f("2025-05-25", "🐀Medium ASF (20–29g)"), 
  f("2025-05-30", "🐀Medium ASF (20–29g)"), f("2025-06-03", "🐀Medium ASF (20–29g)"), f("2025-06-08", "🐀Medium ASF (20–29g)"), 
  f("2025-06-13", "🐀Medium ASF (20–29g)"), f("2025-06-17", "🐀Medium ASF (20–29g)"), f("2025-06-22", "🐀Medium ASF (20–29g)"), 
  f("2025-06-27", "🐀Large ASF (30–39g)"), f("2025-07-01", "🐀Large ASF (30–39g)"), f("2025-07-06", "🐀Large ASF (30–39g)"), 
  f("2025-07-10", "🐀Large ASF (30–39g)"), f("2025-07-16", "🐀Large ASF (30–39g)"), f("2025-07-20", "🐀Large ASF (30–39g)"), 
  f("2025-07-26", "🐀Large ASF (30–39g)"), f("2025-07-31", "🐀Large ASF (30–39g)"), f("2025-08-06", "🐀Large ASF (30–39g)"), 
  f("2025-08-12", "🐀Large ASF (30–39g)"), f("2025-08-19", "🐀Large ASF (30–39g)"), f("2025-08-24", "🐀Large ASF (30–39g)"), 
  f("2025-08-30", "🐀Large ASF (30–39g)"), f("2025-09-06", "🐀Large ASF (30–39g)"), f("2025-09-13", "🐀Large ASF (30–39g)"), 
  f("2025-09-21", "🐀Large ASF (30–39g)"), f("2025-09-28", "🐀Large ASF (30–39g)"), f("2025-10-07", "🐀Large ASF (30–39g)"), 
  f("2025-10-14", "🐀Large ASF (30–39g)"), f("2025-10-20", "🐀XL ASF (40–49g)"), f("2025-10-27", "🐀XL ASF (40–49g)"), 
  f("2025-11-03", "🐀XL ASF (40–49g)"), f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"), 
  f("2025-12-04", "🐀XL ASF (40–49g)"), f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"), 
  f("2025-12-24", "🐀XL ASF (40–49g)"), f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"), 
  f("2026-01-15", "🐀XL ASF (40–49g)"), f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"), 
  f("2026-02-08", "🐀XL ASF (40–49g)"), f("2026-02-15", "🐀XL ASF (40–49g)"),
  // Shedding PDS001
  s("2025-05-12"), s("2025-06-26"), s("2025-08-11"), s("2025-09-29"), s("2025-11-23")
];

// --- PDS002 DATA ---
const logsPDS002 = [
  w("2025-04-09", 110), w("2025-04-24", 156), w("2025-05-01", 190), w("2025-05-06", 212), w("2025-05-18", 248),
  w("2025-05-30", 275), w("2025-06-09", 283), w("2025-06-22", 300), w("2025-07-12", 392), w("2025-08-04", 502),
  w("2025-08-23", 560), w("2025-09-15", 588), w("2025-10-22", 723), w("2025-11-30", 749), w("2025-12-15", 752),
  w("2026-01-06", 828), w("2026-02-13", 987),
  f("2025-04-09", "🐀Medium ASF (20–29g)", "Eaten", "page test ignore feeding"), f("2025-04-17", "🐀Medium ASF (20–29g)"),
  f("2025-04-21", "🐀Medium ASF (20–29g)"), f("2025-04-25", "🐀Medium ASF (20–29g)"), f("2025-04-29", "🐀Medium ASF (20–29g)"),
  f("2025-05-03", "🐀Medium ASF (20–29g)"), f("2025-05-08", "🐀Medium ASF (20–29g)"), f("2025-05-12", "🐀Medium ASF (20–29g)"),
  f("2025-05-16", "🐀Medium ASF (20–29g)"), f("2025-05-21", "🐀Medium ASF (20–29g)"), f("2025-05-25", "🐀Medium ASF (20–29g)"),
  f("2025-05-30", "🐀Medium ASF (20–29g)"), f("2025-06-03", "🐀Medium ASF (20–29g)"), f("2025-06-08", "🐀Medium ASF (20–29g)"),
  f("2025-06-13", "🐀Medium ASF (20–29g)"), f("2025-06-17", "🐀Medium ASF (20–29g)"), f("2025-06-22", "🐀Medium ASF (20–29g)"),
  f("2025-06-27", "🐀Large ASF (30–39g)"), f("2025-07-01", "🐀Large ASF (30–39g)"), f("2025-07-06", "🐀Large ASF (30–39g)"),
  f("2025-07-10", "🐀Large ASF (30–39g)"), f("2025-07-16", "🐀Large ASF (30–39g)"), f("2025-07-20", "🐀Large ASF (30–39g)"),
  f("2025-07-26", "🐀Large ASF (30–39g)"), f("2025-07-31", "🐀Large ASF (30–39g)"), f("2025-08-06", "🐀Large ASF (30–39g)"),
  f("2025-08-12", "🐀Large ASF (30–39g)"), f("2025-08-19", "🐀Large ASF (30–39g)"), f("2025-08-24", "🐀Large ASF (30–39g)"),
  f("2025-08-30", "🐀Large ASF (30–39g)"), f("2025-09-06", "🐀Large ASF (30–39g)"), f("2025-09-13", "🐀Large ASF (30–39g)"),
  f("2025-09-21", "🐀Large ASF (30–39g)"), f("2025-09-28", "🐀Large ASF (30–39g)"), f("2025-10-07", "🐀Large ASF (30–39g)"),
  f("2025-10-14", "🐀Large ASF (30–39g)"), f("2025-10-20", "🐀Large ASF (30–39g)"), f("2025-10-27", "🐀XL ASF (40–49g)"),
  f("2025-11-03", "🐀XL ASF (40–49g)"), f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"),
  f("2025-12-04", "🐀XL ASF (40–49g)"), f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"),
  f("2025-12-24", "🐀XL ASF (40–49g)"), f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"),
  f("2026-01-15", "🐀XL ASF (40–49g)"), f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"),
  f("2026-02-08", "🐀XL ASF (40–49g)"), f("2026-02-15", "🐀XL ASF (40–49g)"),
  // Shedding PDS002
  s("2025-04-28"), s("2025-06-01"), s("2025-07-25"), s("2025-09-03")
];

// --- PDS003 DATA ---
const logsPDS003 = [
  w("2025-04-09", 150), w("2025-04-15", 173), w("2025-04-24", 223), w("2025-05-01", 242), w("2025-05-06", 258),
  w("2025-05-18", 308), w("2025-05-30", 344), w("2025-06-09", 365), w("2025-08-04", 600), w("2025-08-23", 673),
  w("2025-10-22", 823), w("2025-11-30", 899), w("2025-12-15", 965), w("2026-01-06", 1025), w("2026-02-13", 1103),
  f("2025-04-09", "🐀Medium ASF (20–29g)", "Eaten", "test"), f("2025-04-17", "🐀Medium ASF (20–29g)"), f("2025-04-21", "🐀Medium ASF (20–29g)"),
  f("2025-04-25", "🐀Medium ASF (20–29g)"), f("2025-04-29", "🐀Medium ASF (20–29g)"), f("2025-05-03", "🐀Medium ASF (20–29g)"),
  f("2025-05-08", "🐀Medium ASF (20–29g)"), f("2025-05-12", "🐀Medium ASF (20–29g)"), f("2025-05-16", "🐀Medium ASF (20–29g)"),
  f("2025-05-21", "🐀Large ASF (30–39g)"), f("2025-05-25", "🐀Large ASF (30–39g)"), f("2025-05-30", "🐀Large ASF (30–39g)"),
  f("2025-06-03", "🐀Large ASF (30–39g)"), f("2025-06-08", "🐀Large ASF (30–39g)"), f("2025-06-13", "🐀Large ASF (30–39g)"),
  f("2025-06-17", "🐀Large ASF (30–39g)"), f("2025-06-22", "🐀Large ASF (30–39g)"), f("2025-06-27", "🐀Large ASF (30–39g)"),
  f("2025-07-01", "🐀Large ASF (30–39g)"), f("2025-07-06", "🐀Large ASF (30–39g)"), f("2025-07-10", "🐀Large ASF (30–39g)"),
  f("2025-07-16", "🐀Large ASF (30–39g)"), f("2025-07-22", "🐀Large ASF (30–39g)"), f("2025-07-26", "🐀Large ASF (30–39g)"),
  f("2025-07-31", "🐀Large ASF (30–39g)"), f("2025-08-06", "🐀XL ASF (40–49g)"), f("2025-08-13", "🐀XL ASF (40–49g)"),
  f("2025-08-18", "🐀XL ASF (40–49g)"), f("2025-08-24", "🐀XL ASF (40–49g)"), f("2025-08-30", "🐀Large ASF (30–39g)"),
  f("2025-09-06", "🐀XL ASF (40–49g)"), f("2025-09-13", "🐀XL ASF (40–49g)"), f("2025-09-21", "🐀XL ASF (40–49g)"),
  f("2025-09-28", "🐀XL ASF (40–49g)"), f("2025-10-07", "🐀XL ASF (40–49g)"), f("2025-10-14", "🐀XL ASF (40–49g)"),
  f("2025-10-20", "🐀XL ASF (40–49g)"), f("2025-10-27", "🐀XL ASF (40–49g)"), f("2025-11-03", "🐀XL ASF (40–49g)"),
  f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"), f("2025-12-04", "🐀XL ASF (40–49g)"),
  f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"), f("2025-12-24", "🐀XL ASF (40–49g)"),
  f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"), f("2026-01-15", "🐀XL ASF (40–49g)"),
  f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"), f("2026-02-08", "🐀XL ASF (40–49g)"), f("2026-02-15", "🐀XL ASF (40–49g)"),
  // Shedding PDS003
  s("2025-04-30"), s("2025-06-06"), s("2025-08-25"), s("2025-11-23")
];

// --- PDS004 DATA ---
const logsPDS004 = [
  w("2025-04-09", 760), w("2025-04-18", 889), w("2025-05-01", 885), w("2025-05-18", 940), w("2025-05-30", 1077),
  w("2025-07-13", 1160), w("2025-08-22", 1212), w("2025-10-22", 1315), w("2025-11-30", 1340), w("2025-12-15", 1395),
  w("2026-01-06", 1620), w("2026-02-13", 1608), // Note: Intentional small weight loss to trigger alert
  f("2025-04-09", "🐀XL ASF (40–49g)", "Eaten", "page test ignore feeding"), f("2025-04-17", "🐀XL ASF (40–49g)"),
  f("2025-04-23", "🐀XL ASF (40–49g)"), f("2025-04-29", "🐀XL ASF (40–49g)"), f("2025-05-05", "🐀XL ASF (40–49g)"),
  f("2025-05-11", "🐀XL ASF (40–49g)"), f("2025-05-16", "🐀XL ASF (40–49g)"), f("2025-05-22", "🐀XL ASF (40–49g)"),
  f("2025-05-28", "🐀XL ASF (40–49g)"), f("2025-06-03", "🐀XL ASF (40–49g)"), f("2025-06-10", "🐀XL ASF (40–49g)"),
  f("2025-06-17", "🐀XL ASF (40–49g)"), f("2025-06-24", "🐀XL ASF (40–49g)"), f("2025-06-30", "🐀XL ASF (40–49g)"),
  f("2025-07-06", "🐀XL ASF (40–49g)"), f("2025-07-13", "🐀XL ASF (40–49g)"), f("2025-07-19", "🐀XL ASF (40–49g)"),
  f("2025-07-26", "🐀XL ASF (40–49g)"), f("2025-08-02", "🐀XL ASF (40–49g)"), f("2025-08-10", "🐀XL ASF (40–49g)"),
  f("2025-08-18", "🐀XL ASF (40–49g)"), f("2025-08-24", "🐀XL ASF (40–49g)"), f("2025-08-30", "🐀XL ASF (40–49g)"),
  f("2025-09-06", "🐀XL ASF (40–49g)"), f("2025-09-13", "🐀XL ASF (40–49g)"), f("2025-09-21", "🐀XL ASF (40–49g)"),
  f("2025-09-28", "🐀XL ASF (40–49g)"), f("2025-10-07", "🐀XL ASF (40–49g)"), f("2025-10-14", "🐀XL ASF (40–49g)"),
  f("2025-10-20", "🐀XL ASF (40–49g)"), f("2025-10-27", "🐀XL ASF (40–49g)"), f("2025-11-03", "🐀XL ASF (40–49g)"),
  f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"), f("2025-12-04", "🐀XL ASF (40–49g)"),
  f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"), f("2025-12-24", "🐀XL ASF (40–49g)"),
  f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"), f("2026-01-15", "🐀XL ASF (40–49g)"),
  f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"), f("2026-02-08", "🐀2XL ASF (50–59g)"),
  f("2026-02-15", "🐀2XL ASF (50–59g)"),
  // Shedding PDS004
  s("2025-04-28"), s("2025-06-26"), s("2025-08-15"), s("2025-09-25"), s("2026-02-18")
];

// --- PDS005 DATA ---
const logsPDS005 = [
  w("2025-04-09", 893), w("2025-05-01", 973), w("2025-05-08", 1006), w("2025-05-18", 1068), w("2025-05-30", 1125),
  w("2025-06-26", 1158), w("2025-07-13", 1142), w("2025-08-22", 1294), w("2025-10-22", 1473), w("2025-11-30", 1443),
  w("2025-12-15", 1504), w("2026-01-06", 1508), w("2026-02-13", 1665),
  f("2025-04-09", "🐀XL ASF (40–49g)", "Eaten", "test"), f("2025-04-23", "🐀XL ASF (40–49g)"), f("2025-04-29", "🐀XL ASF (40–49g)"),
  f("2025-05-05", "🐀XL ASF (40–49g)"), f("2025-05-11", "🐀XL ASF (40–49g)"), f("2025-05-16", "🐀XL ASF (40–49g)"),
  f("2025-05-22", "🐀XL ASF (40–49g)"), f("2025-05-28", "🐀XL ASF (40–49g)"), f("2025-06-03", "🐀XL ASF (40–49g)"),
  f("2025-06-10", "🐀XL ASF (40–49g)"), f("2025-06-17", "🐀XL ASF (40–49g)"), f("2025-06-24", "🐀XL ASF (40–49g)"),
  f("2025-06-30", "🐀XL ASF (40–49g)"), f("2025-07-06", "🐀XL ASF (40–49g)"), f("2025-07-13", "🐀XL ASF (40–49g)"),
  f("2025-07-19", "🐀XL ASF (40–49g)"), f("2025-07-26", "🐀XL ASF (40–49g)"), f("2025-08-02", "🐀XL ASF (40–49g)"),
  f("2025-08-06", "🐀Large ASF (30–39g)", "Eaten", "PDS007 Refusal so fed to PDS005"), f("2025-08-10", "🐀XL ASF (40–49g)"),
  f("2025-08-18", "🐀XL ASF (40–49g)"), f("2025-08-24", "🐀XL ASF (40–49g)"), f("2025-08-30", "🐀XL ASF (40–49g)"),
  f("2025-09-06", "🐀XL ASF (40–49g)"), f("2025-09-13", "🐀XL ASF (40–49g)"), f("2025-09-21", "🐀XL ASF (40–49g)"),
  f("2025-09-28", "🐀XL ASF (40–49g)"), f("2025-10-07", "🐀XL ASF (40–49g)"), f("2025-10-15", "🐀XL ASF (40–49g)"),
  f("2025-10-20", "🐀XL ASF (40–49g)"), f("2025-10-27", "🐀XL ASF (40–49g)"), f("2025-11-03", "🐀XL ASF (40–49g)"),
  f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"), f("2025-12-04", "🐀XL ASF (40–49g)"),
  f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"), f("2025-12-24", "🐀XL ASF (40–49g)"),
  f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"), f("2026-01-15", "🐀XL ASF (40–49g)"),
  f("2026-01-26", "🐀2XL ASF (50–59g)"), f("2026-02-01", "🐀2XL ASF (50–59g)"), f("2026-02-08", "🐀2XL ASF (50–59g)"),
  f("2026-02-15", "🐀2XL ASF (50–59g)"),
  // Shedding PDS005
  s("2025-06-06"), s("2025-08-17")
];

// --- PDS006 DATA ---
const logsPDS006 = [
  w("2025-04-09", 303), w("2025-04-22", 365), w("2025-05-01", 424), w("2025-05-14", 477), w("2025-05-30", 518),
  w("2025-06-09", 532), w("2025-07-13", 640), w("2025-08-22", 740), w("2025-09-15", 848), w("2025-10-22", 930),
  w("2025-11-30", 996), w("2025-12-15", 1024), w("2026-01-06", 1119), w("2026-02-13", 1201),
  f("2025-04-09", "🐀Medium ASF (20–29g)", "Eaten", "test"), f("2025-04-23", "🐀Medium ASF (20–29g)"),
  f("2025-04-25", "🐀Medium ASF (20–29g)"), f("2025-04-29", "🐀Medium ASF (20–29g)"), f("2025-05-03", "🐀Medium ASF (20–29g)"),
  f("2025-05-08", "🐀Large ASF (30–39g)"), f("2025-05-12", "🐀Large ASF (30–39g)"), f("2025-05-16", "🐀Large ASF (30–39g)"),
  f("2025-05-21", "🐀Large ASF (30–39g)"), f("2025-05-25", "🐀Large ASF (30–39g)"), f("2025-05-30", "🐀Large ASF (30–39g)"),
  f("2025-06-03", "🐀Large ASF (30–39g)"), f("2025-06-08", "🐀Large ASF (30–39g)"), f("2025-06-13", "🐀Large ASF (30–39g)"),
  f("2025-06-17", "🐀Large ASF (30–39g)"), f("2025-06-22", "🐀Large ASF (30–39g)"), f("2025-06-27", "🐀Large ASF (30–39g)"),
  f("2025-07-02", "🐀Large ASF (30–39g)"), f("2025-07-08", "🐀Large ASF (30–39g)"), f("2025-07-15", "🐀Large ASF (30–39g)"),
  f("2025-07-22", "🐀XL ASF (40–49g)"), f("2025-07-26", "🐀XL ASF (40–49g)"), f("2025-08-02", "🐀XL ASF (40–49g)"),
  f("2025-08-10", "🐀XL ASF (40–49g)"), f("2025-08-18", "🐀XL ASF (40–49g)"), f("2025-08-24", "🐀XL ASF (40–49g)"),
  f("2025-08-30", "🐀XL ASF (40–49g)"), f("2025-09-06", "🐀XL ASF (40–49g)"), f("2025-09-13", "🐀XL ASF (40–49g)"),
  f("2025-09-21", "🐀XL ASF (40–49g)"), f("2025-09-28", "🐀XL ASF (40–49g)"), f("2025-10-07", "🐀XL ASF (40–49g)"),
  f("2025-10-14", "🐀XL ASF (40–49g)"), f("2025-10-20", "🐀XL ASF (40–49g)"), f("2025-10-27", "🐀XL ASF (40–49g)"),
  f("2025-11-03", "🐀XL ASF (40–49g)"), f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"),
  f("2025-12-04", "🐀XL ASF (40–49g)"), f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"),
  f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"), f("2026-01-15", "🐀XL ASF (40–49g)"),
  f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"), f("2026-02-08", "🐀XL ASF (40–49g)"),
  f("2026-02-15", "🐀XL ASF (40–49g)"),
  // Shedding PDS006
  s("2025-05-02"), s("2025-05-11"), s("2025-07-01"), s("2025-09-03"), s("2025-11-25")
];

// --- PDS007 DATA ---
const logsPDS007 = [
  w("2025-04-09", 150), w("2025-04-15", 186), w("2025-04-24", 200), w("2025-05-01", 228), w("2025-05-06", 250),
  w("2025-05-18", 278), w("2025-05-30", 288), w("2025-06-09", 332), w("2025-06-22", 354), w("2025-07-13", 416),
  w("2025-08-04", 508), w("2025-08-23", 537), w("2025-09-15", 630), w("2025-10-22", 695), w("2025-11-30", 786),
  w("2025-12-15", 831), w("2026-01-06", 871), w("2026-02-13", 1012),
  f("2025-04-09", "🐀Medium ASF (20–29g)", "Eaten", "test"), f("2025-04-21", "🐀Medium ASF (20–29g)"), f("2025-04-25", "🐀Medium ASF (20–29g)"),
  f("2025-04-29", "🐀Medium ASF (20–29g)"), f("2025-05-03", "🐀Medium ASF (20–29g)"), f("2025-05-08", "🐀Medium ASF (20–29g)"),
  f("2025-05-12", "🐀Medium ASF (20–29g)"), f("2025-05-16", "🐀Medium ASF (20–29g)"), f("2025-05-21", "🐀Medium ASF (20–29g)"),
  f("2025-05-25", "🐀Medium ASF (20–29g)"), f("2025-05-30", "🐀Medium ASF (20–29g)"), f("2025-06-03", "🐀Medium ASF (20–29g)"),
  f("2025-06-08", "🐀Medium ASF (20–29g)"), f("2025-06-13", "🐀Medium ASF (20–29g)"), f("2025-06-17", "🐀Medium ASF (20–29g)"),
  f("2025-06-22", "🐀Medium ASF (20–29g)"), f("2025-06-27", "🐀Large ASF (30–39g)"), f("2025-07-02", "🐀Large ASF (30–39g)"),
  f("2025-07-08", "🐀Large ASF (30–39g)"), f("2025-07-15", "🐀Large ASF (30–39g)"), f("2025-07-20", "🐀Large ASF (30–39g)"),
  f("2025-07-26", "🐀Large ASF (30–39g)"), f("2025-07-31", "🐀Large ASF (30–39g)"), f("2025-08-06", "🐀Large ASF (30–39g)", "Refused"),
  f("2025-08-10", "🐀Large ASF (30–39g)"), f("2025-08-19", "🐀Large ASF (30–39g)"), f("2025-08-24", "🐀Large ASF (30–39g)"),
  f("2025-08-30", "🐀XL ASF (40–49g)"), f("2025-09-06", "🐀Large ASF (30–39g)"), f("2025-09-13", "🐀Large ASF (30–39g)"),
  f("2025-09-21", "🐀Large ASF (30–39g)"), f("2025-09-28", "🐀Large ASF (30–39g)"), f("2025-10-07", "🐀Large ASF (30–39g)"),
  f("2025-10-14", "🐀Large ASF (30–39g)"), f("2025-10-20", "🐀Large ASF (30–39g)"), f("2025-10-27", "🐀XL ASF (40–49g)"),
  f("2025-11-03", "🐀XL ASF (40–49g)"), f("2025-11-17", "🐀XL ASF (40–49g)"), f("2025-11-26", "🐀XL ASF (40–49g)"),
  f("2025-12-04", "🐀XL ASF (40–49g)"), f("2025-12-11", "🐀XL ASF (40–49g)"), f("2025-12-17", "🐀XL ASF (40–49g)"),
  f("2025-12-24", "🐀XL ASF (40–49g)"), f("2025-12-31", "🐀XL ASF (40–49g)"), f("2026-01-07", "🐀XL ASF (40–49g)"),
  f("2026-01-15", "🐀XL ASF (40–49g)"), f("2026-01-26", "🐀XL ASF (40–49g)"), f("2026-02-01", "🐀XL ASF (40–49g)"),
  f("2026-02-08", "🐀XL ASF (40–49g)"), f("2026-02-15", "🐀XL ASF (40–49g)"),
  // Shedding PDS007
  s("2025-05-12"), s("2025-06-22"), s("2025-08-02")
];


const snakes: Snake[] = [
  {
    id: "PDS001",
    genetics: ["Spotnose", "Clown"],
    sex: "Female",
    currentWeight: 914,
    targetWeight: 1500,
    health: "No issues",
    breedingReadiness: false,
    feeding: { dueFeed: false, preySize: "🐀2XL ASF (50–59g)", frequency: 10, isASF: true },
    logs: logsPDS001,
    image: "https://placehold.co/400x400/222/FFF?text=PDS001",
    price: 0,
    status: 'Collection',
    dob: "2024-06-15"
  },
  {
    id: "PDS002",
    genetics: ["Spotnose", "Clown"],
    sex: "Female",
    currentWeight: 987,
    targetWeight: 1500,
    health: "No issues",
    breedingReadiness: false,
    feeding: { dueFeed: false, preySize: "🐀2XL ASF (50–59g)", frequency: 10, isASF: true },
    logs: logsPDS002,
    image: "https://placehold.co/400x400/333/FFF?text=PDS002",
    price: 0,
    status: 'Collection',
    dob: "2024-06-20"
  },
  {
    id: "PDS003",
    genetics: ["Black Pastel", "Yellow Belly", "Het Clown"],
    sex: "Female",
    currentWeight: 1103,
    targetWeight: 1500,
    health: "No issues",
    breedingReadiness: false,
    feeding: { dueFeed: false, preySize: "🐀2XL ASF (50–59g)", frequency: 10, isASF: true },
    logs: logsPDS003,
    image: "https://placehold.co/400x400/444/FFF?text=PDS003",
    price: 0,
    status: 'Collection',
    dob: "2023-09-10"
  },
  {
    id: "PDS004",
    genetics: ["Banana", "Enchi", "Het Clown"],
    sex: "Female",
    currentWeight: 1608,
    targetWeight: 1500,
    health: "No issues",
    breedingReadiness: true,
    feeding: { dueFeed: false, preySize: "🐀2XL ASF (50–59g)", frequency: 14, isASF: true },
    logs: logsPDS004,
    image: "https://placehold.co/400x400/555/FFF?text=PDS004",
    price: 0,
    status: 'For Sale',
    dob: "2022-06-25"
  },
  {
    id: "PDS005",
    genetics: ["Orange Dream", "Het Lavender Albino", "Het Piebald"],
    sex: "Female",
    currentWeight: 1665,
    targetWeight: 1500,
    health: "No issues",
    breedingReadiness: true,
    feeding: { dueFeed: false, preySize: "🐀2XL ASF (50–59g)", frequency: 14, isASF: true },
    logs: logsPDS005,
    image: "https://placehold.co/400x400/666/FFF?text=PDS005",
    price: 0,
    status: 'Collection',
    dob: "2022-06-01"
  },
  {
    id: "PDS006",
    genetics: ["Black Head", "GHI", "Yellow Belly", "Het Lavender Albino", "Het Piebald"],
    sex: "Male",
    currentWeight: 1201,
    targetWeight: 800,
    health: "No issues",
    breedingReadiness: true,
    feeding: { dueFeed: false, preySize: "🐀XL ASF (40–49g)", frequency: 14, isASF: true },
    logs: logsPDS006,
    image: "https://placehold.co/400x400/777/FFF?text=PDS006",
    price: 0,
    status: 'Collection',
    dob: "2023-01-15"
  },
  {
    id: "PDS007",
    genetics: ["Leopard", "Red Stripe", "Fire", "Het Clown"],
    sex: "Male",
    currentWeight: 1012,
    targetWeight: 800,
    health: "No issues",
    breedingReadiness: true,
    feeding: { dueFeed: false, preySize: "🐀XL ASF (40–49g)", frequency: 14, isASF: true },
    logs: logsPDS007,
    image: "https://placehold.co/400x400/888/FFF?text=PDS007",
    price: 0,
    status: 'Collection',
    dob: "2024-08-01",
    sireId: "PDS006", // Linked Parent
    damId: "PDS004",  // Linked Parent
    clutchId: "2502"  // Linked to Clutch
  }
];

const preyShoppingList = calculateShoppingList(snakes);

const pairings: Pairing[] = [
  {
    id: "PR-2502",
    maleId: "PDS006",
    femaleId: "PDS004",
    startDate: "2025-11-01",
    lastLockDate: "2025-12-15",
    status: "Paired",
    events: [
        { id: "E1", date: "2025-11-01", type: "Pairing", details: "Initial introduction" },
        { id: "E2", date: "2025-11-03", type: "Lock", details: "Observed solid lock" },
        { id: "E4", date: "2025-12-15", type: "Lock", details: "Second lock observed" }
    ]
  }
];

const clutches: Clutch[] = [
  {
    id: "2502",
    pairingId: "PR-2502",
    damId: "PDS004",
    sireId: "PDS006",
    layDate: "2025-10-15",
    eggCount: 4,
    infertiles: 1,
    slugs: 1,
    hatchDateEst: "2025-12-15",
    status: "Incubating"
  }
];

export const INITIAL_DATA: CollectionData = {
  collectionName: "Progenix Ball Pythons",
  tagline: "The Art of Genetics, Perfected",
  lastUpdated: new Date().toISOString().split('T')[0], // Dynamically set to today
  keyMetrics: {
    totalSnakes: 7,
    averageWeight: 1212.85,
    breedableCount: 4
  },
  snakes: snakes,
  preyShoppingList: preyShoppingList,
  inventory: [],
  pairings: pairings,
  clutches: clutches,
  subscribers: []
};
