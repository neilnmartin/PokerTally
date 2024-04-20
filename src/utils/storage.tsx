import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { BuyInAmountInCents, Player } from '../types';

interface StorageService {
    savePlayers: (players: Player[]) => Promise<void>;
    loadPlayers: () => Promise<Player[]>;
    saveBuyInAmount: (buyInAmount: BuyInAmountInCents) => Promise<void>;
    loadBuyInAmount: () => Promise<BuyInAmountInCents>;
}

// Implementations for web
const webStorage: StorageService = {
    savePlayers: async (players: Player[]) => {
        localStorage.setItem('players', JSON.stringify(players));
    },
    loadPlayers: async (): Promise<Player[]> => {
        const players = localStorage.getItem('players');
        return players ? JSON.parse(players) : [];
    },
    saveBuyInAmount: async (buyInAmountInCents: BuyInAmountInCents) => {
        localStorage.setItem('buyInAmountInCents', JSON.stringify(buyInAmountInCents));
    },
    loadBuyInAmount: async (): Promise<BuyInAmountInCents> => {
        const buyInAmountInCents = localStorage.getItem('buyInAmountInCents');
        return buyInAmountInCents ? JSON.parse(buyInAmountInCents) : [];
    }
};

// Implementations for native (using AsyncStorage)
const nativeStorage: StorageService = {
    savePlayers: async (players: Player[]) => {
        try {
            const jsonValue = JSON.stringify(players, null, 2);
            await AsyncStorage.setItem('players', jsonValue);
        } catch (e) {
            console.error("Failed to save players in native storage:", e);
        }
    },
    loadPlayers: async (): Promise<Player[]> => {
        try {
            const jsonValue = await AsyncStorage.getItem('players');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error("Failed to load players from native storage:", e);
            return [];
        }
    },
    saveBuyInAmount: async (amountInCents: BuyInAmountInCents) => {
        try {
            const jsonValue = JSON.stringify(amountInCents, null, 2);
            await AsyncStorage.setItem('buyInAmountInCents', jsonValue);
        } catch (e) {
            console.error("Failed to save buyInAmount in native storage:", e);
        }
    },
    loadBuyInAmount: async (): Promise<BuyInAmountInCents> => {
        try {
            const jsonValue = await AsyncStorage.getItem('buyInAmountInCents');
            return jsonValue != null ? JSON.parse(jsonValue) : 1000; // default to 10 dollars
        } catch (e) {
            console.error("Failed to load buyInAmount from native storage:", e);
            return 10;
        }
    },
};

const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

export const savePlayers = storage.savePlayers;
export const loadPlayers = storage.loadPlayers;
export const saveBuyInAmount = storage.saveBuyInAmount;
export const loadBuyInAmount = storage.loadBuyInAmount;
