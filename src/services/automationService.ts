
import { Snake } from '../types';

// --- ID GENERATION ---

/**
 * Generates the next available ID based on a prefix and existing items.
 * Example: If PDS007 exists, returns PDS008.
 * @param items Array of objects with an 'id' property
 * @param prefix The prefix string (e.g., "PDS", "PDC")
 * @param digits Number of digits to pad (default 3)
 */
export const generateNextId = (items: { id: string }[], prefix: string, digits: number = 3): string => {
  const maxNum = items.reduce((max, item) => {
    if (item.id.startsWith(prefix)) {
      // Remove prefix, then parse the rest as integer
      // We use a regex to ensure we only grab the immediate numeric part
      const match = item.id.slice(prefix.length).match(/^(\d+)/);
      if (match) {
        const numPart = parseInt(match[1], 10);
        return !isNaN(numPart) && numPart > max ? numPart : max;
      }
    }
    return max;
  }, 0);

  return `${prefix}${(maxNum + 1).toString().padStart(digits, '0')}`;
};

// --- AUTOMATION LOGIC ---

// Calculates prey size based on a percentage of body weight, appropriate for the snake's life stage.
export const calculatePreySize = (weight: number, sex: 'Male' | 'Female', isASF: boolean): string => {
  if (isASF) {
    // Logic based on user-provided weight brackets for ASFs
    if (weight <= 100) return "🐀Fluffs ASF (3-5g)";
    if (weight <= 200) return "🐀Small ASF (10–19g)";
    if (weight <= 400) return "🐀Medium ASF (20–29g)";
    if (weight <= 600) return "🐀Large ASF (30–39g)";
    if (weight <= 900) return "🐀XL ASF (40–49g)";
    
    // For snakes over 900g, differentiate by sex to prevent overweight males
    if (sex === 'Male') {
      return "🐀XL ASF (40–49g)"; // Cap adult males at XL for healthy maintenance
    } else { // Female
      return "🐀2XL ASF (50–59g)"; // Females can move up to 2XL
    }
  } else {
    // Standard rat logic (can be refined if needed)
    let targetPercentage: number;

    if (weight < 750) {
      targetPercentage = 0.15; 
    } else if (sex === 'Female' && weight < 1500) {
      targetPercentage = 0.08;
    } else {
      targetPercentage = 0.05;
    }
    
    const targetPreyWeight = weight * targetPercentage;

    if (targetPreyWeight <= 9) return "🐀Rat Pups (4–9g)";
    if (targetPreyWeight <= 12) return "🐀Small Fluffs (10–12g)";
    if (targetPreyWeight <= 17) return "🐀Rat Fluffs (13–17g)";
    if (targetPreyWeight <= 24) return "🐀Large Rat Fluffs (18–24g)";
    if (targetPreyWeight <= 34) return "🐀Rat Chubbs (25–34g)";
    if (targetPreyWeight <= 49) return "🐀Small Weaner Rats (34–49g)";
    if (targetPreyWeight <= 59) return "🐀Medium Weaner Rats (50–59g)";
    if (targetPreyWeight <= 89) return "🐀Large Weaner Rats (60–89g)";
    if (targetPreyWeight <= 129) return "🐀Small Rats (90–129g)";
    if (targetPreyWeight <= 149) return "🐀Small Medium Rats (130–149g)";
    if (targetPreyWeight <= 199) return "🐀Medium Rats (150–199g)";
    if (targetPreyWeight <= 249) return "🐀Small Large Rats (200-249g)";
    if (targetPreyWeight <= 299) return "🐀Large Rats (250–299g)";
    if (targetPreyWeight <= 349) return "🐀Small XL Rats (300–349g)";
    if (targetPreyWeight <= 399) return "🐀XL Rats (350–399g)";
    if (targetPreyWeight <= 449) return "🐀Jumbo Rats (400–449g)";
    return "🐀Giant Rats (450g+)";
  }
};

// Calculates feeding frequency based on life stage to promote healthy maintenance over power-feeding.
export const calculateFrequency = (weight: number, sex: 'Male' | 'Female'): number => {
  if (weight < 750) {
    return 7; // Juveniles on weekly feedings
  }

  if (sex === 'Female') {
    if (weight < 1500) {
      return 10; // Sub-adult females every 10 days
    } else {
      return 14; // Adult females every 14 days for maintenance
    }
  } else { // Male >= 750g
    return 14; // Adult males every 14 days for maintenance
  }
};

export const calculateReadiness = (weight: number, sex: 'Male' | 'Female'): boolean => {
  if (sex === 'Female') return weight >= 1500;
  if (sex === 'Male') return weight >= 800;
  return false;
};

/**
 * Iterates through all snakes and recalculates their feeding schedule and breeding readiness.
 * @param snakes The current array of snakes.
 * @returns A new array of snakes with updated data.
 */
export const runGlobalAutomation = (snakes: Snake[]): Snake[] => {
  return snakes.map(snake => {
    // Don't update 'Sold' snakes
    if (snake.status === 'Sold') {
      return snake;
    }

    return {
      ...snake,
      breedingReadiness: calculateReadiness(snake.currentWeight, snake.sex),
      feeding: {
        ...snake.feeding,
        frequency: calculateFrequency(snake.currentWeight, snake.sex),
        preySize: calculatePreySize(snake.currentWeight, snake.sex, !!snake.feeding.isASF),
      }
    };
  });
};
