// UpgradeManager - Handles permanent and temporary upgrades
class UpgradeManager {
    constructor(saveData) {
        this.saveData = saveData;
        this.upgrades = saveData.upgrades;
        this.prestige = saveData.prestige;

        // Temporary upgrades (active during run)
        this.tempUpgrades = {
            widePaddle: false,
            fireball: false,
            slow: false,
            magnet: false,
            shield: false
        };

        this.timers = {};
    }

    // Get current upgrade level
    getLevel(upgradeKey) {
        return this.upgrades[upgradeKey] || 0;
    }

    // Get cost for next level
    getCost(upgradeKey) {
        const level = this.getLevel(upgradeKey);
        const costs = CONFIG.UPGRADE_COSTS[upgradeKey.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')];
        if (!costs || level >= costs.length) return null; // Max level
        return costs[level];
    }

    // Purchase permanent upgrade
    purchaseUpgrade(upgradeKey, currencyManager) {
        const cost = this.getCost(upgradeKey);
        if (cost === null) return false; // Already maxed

        if (currencyManager.spendGems(cost)) {
            this.upgrades[upgradeKey]++;
            this.saveData.upgrades = this.upgrades;
            return true;
        }
        return false;
    }

    // Calculate bonuses from permanent upgrades
    getStartingCoinsBonus() {
        return this.getLevel('startingCoins') * 5;
    }

    getPaddleSizeMultiplier() {
        return 1 + (this.getLevel('paddleSize') * 0.05);
    }

    getBallSpeedReduction() {
        return this.getLevel('ballSpeed') * 0.03;
    }

    getCoinMultiplier() {
        let mult = 1 + (this.getLevel('coinMult') * 0.1);
        if (this.prestige.goldenPaddle) mult *= 1.25;
        return mult;
    }

    getExtraLives() {
        return this.getLevel('extraLives');
    }

    getCritChance() {
        return this.getLevel('critChance') * 0.01;
    }

    getShopDiscount() {
        return this.getLevel('shopDiscount') * 0.05;
    }

    getGemMultiplier() {
        let mult = 1;
        if (this.prestige.goldenPaddle) mult *= 1.25;
        if (this.prestige.doubleGems) mult *= 2;
        return mult;
    }

    // Temporary upgrade management
    activateTempUpgrade(type, scene) {
        const config = CONFIG.POWERUP_TYPES[type];
        if (!config) return;

        this.tempUpgrades[type.toLowerCase()] = true;

        // Clear existing timer if any
        if (this.timers[type]) {
            clearTimeout(this.timers[type]);
        }

        // Set expiration timer if duration > 0
        if (config.duration > 0) {
            this.timers[type] = setTimeout(() => {
                this.tempUpgrades[type.toLowerCase()] = false;
                if (scene && scene.onPowerUpExpired) {
                    scene.onPowerUpExpired(type);
                }
            }, config.duration);
        }
    }

    deactivateTempUpgrade(type) {
        this.tempUpgrades[type.toLowerCase()] = false;
        if (this.timers[type]) {
            clearTimeout(this.timers[type]);
            delete this.timers[type];
        }
    }

    hasTempUpgrade(type) {
        return this.tempUpgrades[type.toLowerCase()] || false;
    }

    // Reset temporary upgrades for new run
    resetTempUpgrades() {
        for (const key in this.tempUpgrades) {
            this.tempUpgrades[key] = false;
        }
        for (const key in this.timers) {
            clearTimeout(this.timers[key]);
        }
        this.timers = {};
    }
}
