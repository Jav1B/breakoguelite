// WaveManager - Handles procedural wave generation
class WaveManager {
    constructor() {
        this.currentWave = 0;
        this.bricksRemaining = 0;
    }

    reset() {
        this.currentWave = 0;
        this.bricksRemaining = 0;
    }

    nextWave() {
        this.currentWave++;
        return this.currentWave;
    }

    getCurrentWave() {
        return this.currentWave;
    }

    isBossWave() {
        return this.currentWave > 0 && this.currentWave % CONFIG.GAMEPLAY.BOSS_WAVE_INTERVAL === 0;
    }

    // Generate brick layout for current wave
    generateLayout() {
        const wave = this.currentWave;
        const layout = [];

        const cols = CONFIG.BRICK.COLS;
        const rows = Math.min(CONFIG.BRICK.ROWS + Math.floor(wave / 3), 10); // More rows as waves progress

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const brickType = this.selectBrickType(wave, row, rows);
                if (brickType) {
                    layout.push({
                        col,
                        row,
                        type: brickType
                    });
                }
            }
        }

        // Add some gaps for variety (reduced from 10% to 5%)
        const gapCount = Math.floor(layout.length * 0.05);
        for (let i = 0; i < gapCount; i++) {
            const idx = Math.floor(Math.random() * layout.length);
            layout.splice(idx, 1);
        }

        this.bricksRemaining = layout.filter(b => b.type !== 'INDESTRUCTIBLE').length;
        return layout;
    }

    selectBrickType(wave, row, totalRows) {
        const rand = Math.random();

        // Top rows tend to be tougher
        const isTopHalf = row < totalRows / 2;

        // Wave-based probability adjustments (more aggressive scaling)
        // TOUGH: Starts at 15% on wave 1 (was 10% + 2%/wave)
        const toughChance = Math.min(0.15 + wave * 0.03, 0.5);
        // TOUGH3: Starts wave 3 (was wave 5)
        const tough3Chance = wave >= 3 ? Math.min(0.05 + (wave - 3) * 0.03, 0.25) : 0;
        const explosiveChance = wave >= 3 ? 0.08 : 0;
        const bombPurpleChance = wave >= 4 ? 0.03 : 0;
        const bombRedChance = wave >= 5 ? 0.02 : 0;
        const bombGoldChance = wave >= 6 ? 0.015 : 0;
        const goldChance = 0.05;
        const mysteryChance = 0.05;
        // INDESTRUCTIBLE: Starts wave 2 (was wave 4)
        const indestructibleChance = wave >= 2 && isTopHalf ? 0.05 + (wave - 2) * 0.01 : 0;

        let cumulative = 0;

        cumulative += indestructibleChance;
        if (rand < cumulative) return 'INDESTRUCTIBLE';

        cumulative += tough3Chance;
        if (rand < cumulative && isTopHalf) return 'TOUGH3';

        cumulative += toughChance;
        if (rand < cumulative && isTopHalf) return 'TOUGH';

        cumulative += explosiveChance;
        if (rand < cumulative) return 'EXPLOSIVE';

        cumulative += bombPurpleChance;
        if (rand < cumulative) return 'BOMB_PURPLE';

        cumulative += bombRedChance;
        if (rand < cumulative) return 'BOMB_RED';

        cumulative += bombGoldChance;
        if (rand < cumulative) return 'BOMB_GOLD';

        cumulative += goldChance;
        if (rand < cumulative) return 'GOLD';

        cumulative += mysteryChance;
        if (rand < cumulative) return 'MYSTERY';

        return 'NORMAL';
    }

    brickDestroyed() {
        this.bricksRemaining--;
        return this.bricksRemaining;
    }

    isWaveComplete() {
        return this.bricksRemaining <= 0;
    }

    getGemsForWave() {
        if (this.isBossWave()) {
            return CONFIG.GAMEPLAY.GEMS_PER_BOSS;
        }
        return CONFIG.GAMEPLAY.GEMS_PER_WAVE;
    }
}
