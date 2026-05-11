

export interface InventoryItem {
  preySize: string;
  quantity: number;
  lastUpdated: string; // ISO string
}

export interface Feeding {
  dueFeed: boolean;
  preySize: string;
  frequency: number;
  isASF?: boolean;
}

export interface LogEntry {
  id: string;
  date: string;
  notes?: string;
}

export interface FeedingLogEntry extends LogEntry {
  type: 'Feeding';
  item: string;
  result: 'Eaten' | 'Refused';
}

export interface WeightLogEntry extends LogEntry {
  type: 'Weight';
  weight: number;
}

export interface SheddingLogEntry extends LogEntry {
  type: 'Shedding';
  quality: 'Perfect' | 'Good' | 'Bad' | 'Incomplete';
}

export type SnakeLog = FeedingLogEntry | WeightLogEntry | SheddingLogEntry;

export interface Snake {
  id: string;
  name?: string;
  image?: string;
  genetics: string[];
  sex: 'Male' | 'Female';
  dob?: string; // Date of Birth YYYY-MM-DD
  sireId?: string; // Father
  damId?: string; // Mother
  clutchId?: string; // The clutch this snake came from
  currentWeight: number;
  targetWeight: number;
  health: string;
  breedingReadiness: boolean;
  feeding: Feeding;
  logs: SnakeLog[];
  price?: number;
  status?: 'Collection' | 'For Sale' | 'Hold' | 'Sold';
}

export interface PreyItem {
  size: string;
  amount: number;
  cost: number | null;
  currency: string;
}

export interface PreyShoppingList {
  items: PreyItem[];
  itemsCost: number;
  deliveryCost: number;
  totalCost: number;
}

export interface KeyMetrics {
  totalSnakes: number;
  averageWeight: number;
  breedableCount: number;
}

export type PairingEventType = 'Lock' | 'Ovulation' | 'Pre-Lay Shed' | 'Pairing' | 'Separation' | 'Observation';

export interface PairingEvent {
  id: string;
  date: string;
  type: PairingEventType;
  details?: string;
}

export interface Pairing {
  id: string;
  maleId: string;
  femaleId: string;
  startDate: string;
  lastLockDate?: string;
  status: 'Paired' | 'Separated' | 'Gravid';
  notes?: string;
  events: PairingEvent[]; 
}

export interface Clutch {
  id: string;
  pairingId: string;
  damId: string;
  sireId: string;
  layDate: string;
  eggCount: number;
  infertiles?: number;
  slugs?: number;
  hatchDateEst: string;
  status: 'Incubating' | 'Hatched' | 'Lost';
}

export interface CollectionData {
  collectionName: string;
  tagline: string;
  lastUpdated: string;
  keyMetrics: KeyMetrics;
  snakes: Snake[];
  preyShoppingList: PreyShoppingList;
  inventory: InventoryItem[];
  pairings: Pairing[];
  clutches: Clutch[];
  subscribers: string[];
}