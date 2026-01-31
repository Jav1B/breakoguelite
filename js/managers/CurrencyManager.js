// CurrencyManager - Handles all currency operations
class CurrencyManager {
    constructor(saveData) {
        this.saveData = saveData;

        // Run-specific (reset each run)
        this.coins = 0;

        // Permanent (from save)
        this.gems = saveData.gems || 0;
        this.shards = saveData.shards || 0;
    }

    // Initialize for a new run
    startRun(startingCoinsBonus = 0) {
        this.coins = CONFIG.GAMEPLAY.STARTING_COINS + startingCoinsBonus;
    }

    // Coin operations (run-specific)
    addCoins(amount, multiplier = 1) {
        const total = Math.floor(amount * multiplier);
        this.coins += total;
        this.saveData.totalCoinsEarned += total;
        return total;
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            return true;
        }
        return false;
    }

    // Gem operations (permanent)
    addGems(amount, multiplier = 1) {
        const total = Math.floor(amount * multiplier);
        this.gems += total;
        this.saveData.gems = this.gems;
        this.saveData.totalGemsEarned += total;
        return total;
    }

    spendGems(amount) {
        if (this.gems >= amount) {
            this.gems -= amount;
            this.saveData.gems = this.gems;
            return true;
        }
        return false;
    }

    // Shard operations (permanent/prestige)
    addShards(amount) {
        this.shards += amount;
        this.saveData.shards = this.shards;
        return amount;
    }

    spendShards(amount) {
        if (this.shards >= amount) {
            this.shards -= amount;
            this.saveData.shards = this.shards;
            return true;
        }
        return false;
    }

    // Getters
    getCoins() { return this.coins; }
    getGems() { return this.gems; }
    getShards() { return this.shards; }
}
