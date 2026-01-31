// Game Constants and Configuration
const CONFIG = {
    // Game dimensions (portrait orientation for mobile)
    GAME_WIDTH: 480,
    GAME_HEIGHT: 800,

    // Colors
    COLORS: {
        BACKGROUND: 0x1a1a2e,
        PADDLE: 0x4fc3f7,
        BALL: 0xffffff,
        UI_TEXT: '#ffffff',
        UI_ACCENT: '#4fc3f7',
        COIN: 0xffd700,
        GEM: 0xe040fb,
        SHARD: 0x00e5ff
    },

    // Paddle settings
    PADDLE: {
        WIDTH: 80,  // Smaller = harder (upgrades restore to 100+)
        HEIGHT: 20,
        Y_OFFSET: 60,  // Distance from bottom
        SPEED: 800,
        COLOR: 0x4fc3f7
    },

    // Ball settings
    BALL: {
        RADIUS: 10,
        BASE_SPEED: 400,
        MAX_SPEED: 600,
        MIN_SPEED: 300,
        RALLY_ACCELERATION: 0.02,  // 2% speed increase per paddle hit
        BRICK_ACCELERATION: 0.005   // 0.5% speed increase per brick hit
    },

    // Brick settings
    BRICK: {
        WIDTH: 52,
        HEIGHT: 24,
        PADDING: 4,
        OFFSET_TOP: 100,
        OFFSET_SIDE: 20,
        COLS: 8,
        ROWS: 6,
        FALL_DURATION: 150
    },

    // Brick types with their properties (reduced coin drops for difficulty)
    BRICK_TYPES: {
        NORMAL: { hp: 1, color: 0x26a69a, points: 10, coinDrop: 1, sprite: 'brick-normal' },
        TOUGH: { hp: 2, color: 0x5c6bc0, points: 25, coinDrop: 1, sprite: 'brick-tough' },
        TOUGH3: { hp: 3, color: 0x7e57c2, points: 40, coinDrop: 2, sprite: 'brick-tough3' },
        EXPLOSIVE: { hp: 1, color: 0xef5350, points: 15, coinDrop: 1, explosive: true, sprite: 'brick-explosive' },
        BOMB_PURPLE: { hp: 1, color: 0x9c27b0, points: 20, coinDrop: 2, explosive: true, bombType: 'purple', sprite: 'brick-bomb-purple' },
        BOMB_RED: { hp: 1, color: 0xd32f2f, points: 25, coinDrop: 2, explosive: true, bombType: 'red', sprite: 'brick-bomb-red' },
        BOMB_GOLD: { hp: 1, color: 0xffa000, points: 30, coinDrop: 5, explosive: true, bombType: 'gold', sprite: 'brick-bomb-gold' },
        GOLD: { hp: 1, color: 0xffd700, points: 50, coinDrop: 3, sprite: 'brick-gold' },
        MYSTERY: { hp: 1, color: 0xe040fb, points: 20, coinDrop: 1, dropsPowerUp: true, sprite: 'brick-mystery' },
        INDESTRUCTIBLE: { hp: Infinity, color: 0x424242, points: 0, coinDrop: 0, sprite: 'brick-indestructible' }
    },

    // Gameplay settings
    GAMEPLAY: {
        STARTING_LIVES: 1,  // Hard start - upgrades are essential
        STARTING_COINS: 0,
        COINS_PER_BRICK: 1,
        GEMS_PER_WAVE: 1,
        GEMS_PER_BOSS: 5,
        BOSS_WAVE_INTERVAL: 5,
        TIME_PRESSURE_SECONDS: 60,  // Time before bricks start descending
        BRICK_DESCENT_SPEED: 40,  // Pixels per second when time pressure activates
        MERGE_BONUS_MULTIPLIER: 0.5,  // 50% bonus per merge level
        BOMB_SETTINGS: {
            DEFAULT_RADIUS: 60,
            PURPLE_RADIUS: 45,
            RED_RADIUS: 90,
            GOLD_BONUS_COINS: 10
        }
    },

    // Power-up types
    POWERUP_TYPES: {
        MULTIBALL: { color: 0x4fc3f7, duration: 0, sprite: 'powerup-multiball' },
        WIDE_PADDLE: { color: 0x66bb6a, duration: 15000, sprite: 'powerup-wide-paddle' },
        FIREBALL: { color: 0xef5350, duration: 10000, sprite: 'powerup-fireball' },
        SLOW: { color: 0xffee58, duration: 10000, sprite: 'powerup-slow' },
        SHIELD: { color: 0x42a5f5, duration: 0, sprite: 'powerup-shield' },
        MAGNET: { color: 0xab47bc, duration: 12000, sprite: 'powerup-magnet' }
    },

    // Shop prices (in coins)
    SHOP_PRICES: {
        MULTIBALL: 30,
        WIDE_PADDLE: 20,
        FIREBALL: 40,
        SLOW: 25,
        SHIELD: 35,
        MAGNET: 30
    },

    // Permanent upgrade costs (in gems)
    UPGRADE_COSTS: {
        STARTING_COINS: [5, 10, 15, 20, 30, 40, 50, 75, 100, 150],
        PADDLE_SIZE: [10, 25, 50, 100, 200],
        BALL_SPEED: [10, 25, 50, 100, 200],
        COIN_MULT: [5, 10, 20, 35, 50, 75, 100, 150, 200, 300],
        EXTRA_LIVES: [20, 75, 200],
        CRIT_CHANCE: [5, 10, 20, 35, 50, 75, 100, 150, 200, 300],
        SHOP_DISCOUNT: [15, 40, 80, 150, 300]
    }
};
