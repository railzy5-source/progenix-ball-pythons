
import { Snake, PreyShoppingList, PreyItem, InventoryItem } from '../types';

// --- CONFIGURATION ---
const DELIVERY_CHARGE = 12.49;
const SUPPLY_CYCLE_DAYS = 35;

// Prices based on user's supplier, calculated per item from pack prices.
export const PREY_PRICE_MAP: { [key: string]: number } = {
  // ASFs
  "🐀Pinkies ASF (1-2g)": 0.20,
  "🐀Fluffs ASF (3-5g)": 0.35,
  "🐀Hoppers ASF (6-9g)": 0.35,
  "🐀Small ASF (10–19g)": 0.50,
  "🐀Medium ASF (20–29g)": 0.70,
  "🐀Large ASF (30–39g)": 0.90,
  "🐀XL ASF (40–49g)": 1.30,
  "🐀2XL ASF (50–59g)": 1.75,
  "🐀3XL ASF (60-69g)": 1.80,
  "🐀4XL ASF (70-79g)": 2.20,
  "🐀5XL ASF (80-89g)": 2.40,
  "🐀6XL ASF (90-99g)": 2.50,
  "🐀Monster ASF (100g+)": 3.00,

  // Standard Rats
  "🐀Rat Pups (4–9g)": 0.45,
  "🐀Small Fluffs (10–12g)": 0.60,
  "🐀Rat Fluffs (13–17g)": 0.65,
  "🐀Large Rat Fluffs (18–24g)": 0.70,
  "🐀Rat Chubbs (25–34g)": 0.75,
  "🐀Small Weaner Rats (34–49g)": 0.83,
  "🐀Medium Weaner Rats (50–59g)": 1.00,
  "🐀Large Weaner Rats (60–89g)": 1.10,
  "🐀Small Rats (90–129g)": 1.45,
  "🐀Small Medium Rats (130–149g)": 1.55,
  "🐀Medium Rats (150–199g)": 1.70,
  "🐀Small Large Rats (200-249g)": 1.80,
  "🐀Large Rats (250–299g)": 2.00,
  "🐀Small XL Rats (300–349g)": 2.40,
  "🐀XL Rats (350–399g)": 2.80,
  "🐀Jumbo Rats (400–449g)": 3.30,
  "🐀Giant Rats (450g+)": 3.50,
};


export const calculateShoppingList = (snakes: Snake[], inventory: InventoryItem[] = []): PreyShoppingList => {
  const preyNeeded: { [key: string]: number } = {};
  const inventoryMap = new Map(inventory.map(item => [item.preySize, item.quantity]));

  // Aggregate prey needed for all non-sold snakes
  snakes
    .filter(s => s.status !== 'Sold')
    .forEach(snake => {
      if (snake.feeding && snake.feeding.preySize && snake.feeding.frequency > 0) {
        const mealsPerCycle = Math.ceil(SUPPLY_CYCLE_DAYS / snake.feeding.frequency);
        if (!preyNeeded[snake.feeding.preySize]) {
          preyNeeded[snake.feeding.preySize] = 0;
        }
        preyNeeded[snake.feeding.preySize] += mealsPerCycle;
      }
    });

  // Convert aggregated data into list items with cost calculation, accounting for inventory
  const items: PreyItem[] = Object.entries(preyNeeded)
    .map(([size, amount]) => {
      const inStock = inventoryMap.get(size) || 0;
      let amountToOrder = Math.max(0, amount - inStock);

      if (amountToOrder === 0) {
        return null; // Don't need to order this item
      }
      
      // Supplier requirement: Packs of 10
      // Round up to the nearest multiple of 10
      amountToOrder = Math.ceil(amountToOrder / 10) * 10;
      
      const unitCost = PREY_PRICE_MAP[size] || null;
      return {
        size,
        amount: amountToOrder,
        cost: unitCost ? unitCost * amountToOrder : null,
        currency: "£",
      };
    })
    .filter((item): item is PreyItem => item !== null)
    .sort((a, b) => (PREY_PRICE_MAP[a.size] || 0) - (PREY_PRICE_MAP[b.size] || 0));

  const itemsCost = items.reduce((acc, item) => acc + (item.cost || 0), 0);
  const totalCost = items.length > 0 ? itemsCost + DELIVERY_CHARGE : 0;

  return { 
      items, 
      itemsCost, 
      deliveryCost: items.length > 0 ? DELIVERY_CHARGE : 0, 
      totalCost 
  };
};
