export const GAME_CONFIG = {
    PLAYER: {
        SPEED: 5,
        LIVES: 3,
        FIRE_RATE: 300,
    },
    PROJECTILE: {
        SPEED: 5,
    },
    ENEMIES: {
        SPEED: 5,
        STEP_DOWN: 20,
        WIDTH: 60,
        HEIGHT: 40,
        ROWS: 3,
        COLS: 7,
        START_Y: 50,
        HEALTH: 1,
        SPECIAL_START_WAVE: 10,
        SPECIAL_HEALTH: 3,
        FIRE_RATE: 800,
    },
    DIFFICULTY: {
        minProjectileRate: 100, // Limite minimale
        projectileDecrement: 50, // Réduction de la cadence de tir toutes les 5 vagues
    },

    SCORES: {
        LOW_ROW: 10,
        MID_ROW: 20,
        HIGH_ROW: 30,
    }
};