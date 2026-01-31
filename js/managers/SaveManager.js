// SaveManager - Handles LocalStorage persistence
class SaveManager {
    constructor() {
        this.SAVE_KEY = 'breakout_roguelike_save';
    }

    getDefaultSave() {
        return {
            // Currencies (permanent)
            gems: 0,
            shards: 0,
            totalCoinsEarned: 0,
            totalGemsEarned: 0,

            // Stats
            highestWave: 0,
            totalRuns: 0,
            totalBricksDestroyed: 0,

            // Permanent upgrades (levels)
            upgrades: {
                startingCoins: 0,
                paddleSize: 0,
                ballSpeed: 0,
                coinMult: 0,
                extraLives: 0,
                critChance: 0,
                shopDiscount: 0
            },

            // Prestige upgrades
            prestige: {
                goldenPaddle: false,
                doubleGems: false,
                luckyStart: false,
                bossHunter: false
            },

            // Settings
            settings: {
                soundEnabled: true,
                musicEnabled: true
            }
        };
    }

    load() {
        try {
            const saved = localStorage.getItem(this.SAVE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                // Merge with defaults to handle new properties
                return { ...this.getDefaultSave(), ...data };
            }
        } catch (e) {
            console.error('Failed to load save:', e);
        }
        return this.getDefaultSave();
    }

    save(data) {
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save:', e);
            return false;
        }
    }

    reset() {
        localStorage.removeItem(this.SAVE_KEY);
        return this.getDefaultSave();
    }
}

// Global instance
const saveManager = new SaveManager();
