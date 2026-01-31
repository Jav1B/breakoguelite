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

        // Add some gaps for variety
        const gapCount = Math.floor(layout.length * 0.1);
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

        // Wave-based probability adjustments
        const toughChance = Math.min(0.1 + wave * 0.02, 0.4);
        const tough3Chance = wave >= 5 ? Math.min(0.05 + (wave - 5) * 0.02, 0.2) : 0;
        const explosiveChance = wave >= 3 ? 0.08 : 0;
        const goldChance = 0.05;
        const mysteryChance = 0.05;
        const indestructibleChance = wave >= 4 && isTopHalf ? 0.05 : 0;

        let cumulative = 0;

        cumulative += indestructibleChance;
        if (rand < cumulative) return 'INDESTRUCTIBLE';

        cumulative += tough3Chance;
        if (rand < cumulative && isTopHalf) return 'TOUGH3';

        cumulative += toughChance;
        if (rand < cumulative && isTopHalf) return 'TOUGH';

        cumulative += explosiveChance;
        if (rand < cumulative) return 'EXPLOSIVE';

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
