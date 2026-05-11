

import { supabase } from './supabaseClient';
import { CollectionData } from '../types';
import { INITIAL_DATA } from '../constants';

// --- DATA TYPES ---
type StorageKey = 'progenix_snakes' | 'progenix_pairings' | 'progenix_clutches' | 'progenix_subscribers' | 'progenix_inventory';

// --- API ---

export const isCloudEnabled = () => {
  // We assume cloud is enabled if the URL is present in env
  // Safe check for import.meta.env
  try {
    return !!(import.meta && import.meta.env && import.meta.env.VITE_SUPABASE_URL);
  } catch {
    return false;
  }
};

export const storageService = {
  
  // Load all data
  async loadData(): Promise<Partial<CollectionData>> {
    const localSnakes = localStorage.getItem('progenix_snakes');
    const localPairings = localStorage.getItem('progenix_pairings');
    const localClutches = localStorage.getItem('progenix_clutches');
    const localSubscribers = localStorage.getItem('progenix_subscribers');
    const localInventory = localStorage.getItem('progenix_inventory');

    let data = {
      snakes: localSnakes ? JSON.parse(localSnakes) : INITIAL_DATA.snakes,
      pairings: localPairings ? JSON.parse(localPairings) : INITIAL_DATA.pairings,
      clutches: localClutches ? JSON.parse(localClutches) : INITIAL_DATA.clutches,
      subscribers: localSubscribers ? JSON.parse(localSubscribers) : INITIAL_DATA.subscribers,
      inventory: localInventory ? JSON.parse(localInventory) : INITIAL_DATA.inventory,
    };

    // If Cloud is enabled, try to fetch latest from Cloud
    // This works for public read (if RLS allows) or authenticated read
    if (isCloudEnabled()) {
      try {
        const { data: cloudData, error } = await supabase
          .from('progenix_data')
          .select('key, value');

        if (!error && cloudData) {
          const cloudSnakes = cloudData.find(r => r.key === 'snakes')?.value;
          const cloudPairings = cloudData.find(r => r.key === 'pairings')?.value;
          const cloudClutches = cloudData.find(r => r.key === 'clutches')?.value;
          const cloudSubscribers = cloudData.find(r => r.key === 'subscribers')?.value;
          const cloudInventory = cloudData.find(r => r.key === 'inventory')?.value;

          if (cloudSnakes) data.snakes = cloudSnakes;
          if (cloudPairings) data.pairings = cloudPairings;
          if (cloudClutches) data.clutches = cloudClutches;
          if (cloudSubscribers) data.subscribers = cloudSubscribers;
          if (cloudInventory) data.inventory = cloudInventory;
          
          // Sync cloud down to local to keep them in parity
          localStorage.setItem('progenix_snakes', JSON.stringify(data.snakes));
          localStorage.setItem('progenix_pairings', JSON.stringify(data.pairings));
          localStorage.setItem('progenix_clutches', JSON.stringify(data.clutches));
          localStorage.setItem('progenix_subscribers', JSON.stringify(data.subscribers));
          localStorage.setItem('progenix_inventory', JSON.stringify(data.inventory));
        }
      } catch (err) {
        console.warn("Cloud load failed, using local data", err);
      }
    }

    return data;
  },

  // Save specific entity
  async save(key: StorageKey, data: any) {
    // 1. Save Local (Always works)
    localStorage.setItem(key, JSON.stringify(data));

    // 2. Save Cloud (Only works if authenticated and RLS permits)
    if (isCloudEnabled()) {
      const dbKey = key.replace('progenix_', '');
      try {
        await supabase
          .from('progenix_data')
          .upsert({ key: dbKey, value: data }, { onConflict: 'key' });
      } catch (err) {
        console.error("Cloud save failed (likely permission denied if not logged in)", err);
      }
    }
  },

  // Export Data to JSON File
  exportData(currentData: Partial<CollectionData>) {
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `progenix_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Import Data from JSON File
  async importData(file: File): Promise<Partial<CollectionData> | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (!json.snakes || !json.pairings) {
            alert("Invalid backup file format.");
            resolve(null);
            return;
          }
          
          localStorage.setItem('progenix_snakes', JSON.stringify(json.snakes));
          localStorage.setItem('progenix_pairings', JSON.stringify(json.pairings));
          localStorage.setItem('progenix_clutches', JSON.stringify(json.clutches));
          if(json.subscribers) localStorage.setItem('progenix_subscribers', JSON.stringify(json.subscribers));
          if(json.inventory) localStorage.setItem('progenix_inventory', JSON.stringify(json.inventory));

          // Try to sync to cloud if logged in
          if (isCloudEnabled()) {
             await supabase.from('progenix_data').upsert({ key: 'snakes', value: json.snakes });
             await supabase.from('progenix_data').upsert({ key: 'pairings', value: json.pairings });
             await supabase.from('progenix_data').upsert({ key: 'clutches', value: json.clutches });
             if(json.subscribers) await supabase.from('progenix_data').upsert({ key: 'subscribers', value: json.subscribers });
             if(json.inventory) await supabase.from('progenix_data').upsert({ key: 'inventory', value: json.inventory });
          }

          resolve(json);
        } catch (err) {
          console.error(err);
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  },

  clearAll() {
    localStorage.removeItem('progenix_snakes');
    localStorage.removeItem('progenix_pairings');
    localStorage.removeItem('progenix_clutches');
    localStorage.removeItem('progenix_subscribers');
    localStorage.removeItem('progenix_inventory');
  }
};