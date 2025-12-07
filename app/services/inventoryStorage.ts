import * as SecureStore from 'expo-secure-store';
import { InventoryItem } from '../data/inventory';

const INVENTORY_KEY = 'user_inventory';

export class InventoryStorage {
  static async saveInventory(inventory: InventoryItem[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(inventory);
      
      if (jsonData.length > 2048) {
        await this.saveInventoryChunked(inventory);
      } else {
        await SecureStore.setItemAsync(INVENTORY_KEY, jsonData);
      }
    } catch (error) {
      console.error('Failed to save inventory:', error);
      throw new Error('Failed to save inventory data');
    }
  }

  static async loadInventory(): Promise<InventoryItem[]> {
    try {
      const data = await SecureStore.getItemAsync(INVENTORY_KEY);
      
      if (!data) {
        const chunkedData = await this.loadInventoryChunked();
        if (chunkedData.length > 0) {
          return chunkedData;
        }
        return [];
      }
      
      return JSON.parse(data) as InventoryItem[];
    } catch (error) {
      console.error('Failed to load inventory:', error);
      return [];
    }
  }

  static async addItem(item: InventoryItem): Promise<void> {
    try {
      const inventory = await this.loadInventory();
      inventory.push(item);
      await this.saveInventory(inventory);
    } catch (error) {
      console.error('Failed to add item:', error);
      throw new Error('Failed to add item to inventory');
    }
  }

  static async addItems(items: InventoryItem[]): Promise<void> {
    try {
      const inventory = await this.loadInventory();
      inventory.push(...items);
      await this.saveInventory(inventory);
    } catch (error) {
      console.error('Failed to add items:', error);
      throw new Error('Failed to add items to inventory');
    }
  }

  static async updateItem(id: string, updatedItem: Partial<InventoryItem>): Promise<void> {
    try {
      const inventory = await this.loadInventory();
      const index = inventory.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      inventory[index] = { ...inventory[index], ...updatedItem };
      await this.saveInventory(inventory);
    } catch (error) {
      console.error('Failed to update item:', error);
      throw new Error('Failed to update item in inventory');
    }
  }

  static async deleteItem(id: string): Promise<void> {
    try {
      const inventory = await this.loadInventory();
      const filtered = inventory.filter(item => item.id !== id);
      await this.saveInventory(filtered);
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw new Error('Failed to delete item from inventory');
    }
  }

  static async clearInventory(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(INVENTORY_KEY);
      
      let chunkIndex = 0;
      while (true) {
        const chunkKey = `${INVENTORY_KEY}_chunk_${chunkIndex}`;
        const exists = await SecureStore.getItemAsync(chunkKey);
        if (!exists) break;
        await SecureStore.deleteItemAsync(chunkKey);
        chunkIndex++;
      }
    } catch (error) {
      console.error('Failed to clear inventory:', error);
      throw new Error('Failed to clear inventory data');
    }
  }

  private static async saveInventoryChunked(inventory: InventoryItem[]): Promise<void> {
    const CHUNK_SIZE = 1800;
    const jsonData = JSON.stringify(inventory);
    const chunks: string[] = [];
    
    for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
      chunks.push(jsonData.slice(i, i + CHUNK_SIZE));
    }
    
    await SecureStore.deleteItemAsync(INVENTORY_KEY);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkKey = `${INVENTORY_KEY}_chunk_${i}`;
      await SecureStore.setItemAsync(chunkKey, chunks[i]);
    }
    
    await SecureStore.setItemAsync(`${INVENTORY_KEY}_chunks`, chunks.length.toString());
  }

  private static async loadInventoryChunked(): Promise<InventoryItem[]> {
    try {
      const chunkCountStr = await SecureStore.getItemAsync(`${INVENTORY_KEY}_chunks`);
      if (!chunkCountStr) return [];
      
      const chunkCount = parseInt(chunkCountStr, 10);
      let jsonData = '';
      
      for (let i = 0; i < chunkCount; i++) {
        const chunkKey = `${INVENTORY_KEY}_chunk_${i}`;
        const chunk = await SecureStore.getItemAsync(chunkKey);
        if (chunk) {
          jsonData += chunk;
        }
      }
      
      if (!jsonData) return [];
      
      return JSON.parse(jsonData) as InventoryItem[];
    } catch (error) {
      console.error('Failed to load chunked inventory:', error);
      return [];
    }
  }

  static async hasStoredInventory(): Promise<boolean> {
    try {
      const data = await SecureStore.getItemAsync(INVENTORY_KEY);
      const chunked = await SecureStore.getItemAsync(`${INVENTORY_KEY}_chunks`);
      return !!(data || chunked);
    } catch (error) {
      return false;
    }
  }
}
