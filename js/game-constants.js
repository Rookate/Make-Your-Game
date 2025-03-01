export const GAME_CONFIG = {
    PLAYER: {
        SPEED: 5,
        LIVES: 3,
        FIRE_RATE: 200,
    },
    PROJECTILE: {
        SPEED: 5,
    },
    ENEMIES: {
        SPEED: 5,
        STEP_DOWN: 10,
        WIDTH: 60,
        HEIGHT: 40,
        ROWS: 3,
        COLS: 7,
        START_Y: 50,
        HEALTH: 2,
        SPECIAL_START_WAVE: 10,
        SPECIAL_HEALTH: 3,
        FIRE_RATE: 1000,
        DAMAGE: 1,
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