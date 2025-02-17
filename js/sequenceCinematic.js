import { CinematicEventType, CinematicManager } from './cinematicManager.js';

export class SequenceCinematic {
    constructor(id, events) {
        this.id = id;
        this.events = events;
        this.cinematic = new CinematicManager();
    }

    async playSequence() {
        const cinematic = this.cinematic;

        cinematic.createEvent('titleText', CinematicEventType.SCENE, {
            duration: 3000,
            text: 'Welcome to the game',
            className: 'cut-scene',
            planet: "css/Lava.png"
        });
        cinematic.createEvent('titleText3', CinematicEventType.SCENE, {
            duration: 3000,
            text: 'The invader come and destroy our planet',
            className: 'cut-scene',
            planet: "css/Terran.png"
        });
        cinematic.createEvent('titleText4', CinematicEventType.SCENE, {
            duration: 4000,
            text: 'You are the last chance',
            className: 'cut-scene',
            planet: "css/Ice.png"
        });
        cinematic.createEvent('playerAppear', CinematicEventType.PLAYER, {
            duration: 5000,
            className: 'cutscene',
            text: 'Space June 2079 9pm',
            playerImage: 'css/pngkey.com-galaga-ship-png-1472422.png',
            backgroundImage: "css/HD-wallpaper-artistic-pixel-art-space-moon.jpg"
        });
        cinematic.createEvent('zoomPlayer', CinematicEventType.PLAYER, {
            duration: 4000,
            className: 'cutscene',
            text: 'Leader to falcon I approach the targets',
            backgroundImage: 'css/471a0d1d9af520c394e02a09120fc7c1.gif'
        });
        cinematic.createEvent('zoomPlayer2', CinematicEventType.PLAYER, {
            duration: 5000,
            className: 'cutscene',
            text: 'Ok leader you can engage',
            backgroundImage: 'css/f2162a69274b7cb1f9330c4580f28723.gif'
        });
        cinematic.createEvent('zoomPlayer3', CinematicEventType.PLAYER, {
            duration: 2000,
            className: 'cutscene',
            text: 'Prepare to fight !',
            backgroundImage: 'css/471a0d1d9af520c394e02a09120fc7c1.gif'
        });

        try {
            //   await transition.play('levelStart');
            await cinematic.playSequence(['titleText', 'titleText2', 'titleText3', 'titleText4', 'playerAppear', 'zoomPlayer', 'zoomPlayer2', 'zoomPlayer3']);
            return true;
        } catch (error) {
            console.error('Failed to start game:', error);
            return false;
        }
    }
    async playGameOverSequence() {
        const cinematic = this.cinematic;

        cinematic.createEvent('titleText', CinematicEventType.PLAYER, {
            duration: 3000,
            text: 'Game Over, Invaders win',
            className: 'cut-scene',
            playerImage: "css/galaga-ship.png",
            backgroundImage: "css/83024e2e5cd4fc4261e4b97dc93ed12c.gif"
        });
        try {
            await cinematic.playSequence(['titleText']);
            return true
        } catch (error) {
            console.error('Failed to start game:', error);
            return false
        }
    }

    async playWaveSequence() {
        const cinematic = this.cinematic;
        const wave = window.gameState.wave;

        cinematic.createEvent(`waveIntro${wave}`, CinematicEventType.PLAYER, {
            duration: 2000,
            text: `Wave ${wave} Incoming!`,
            className: 'cut-scene',
            backgroundImage: 'css/885542.png'
        });

        cinematic.createEvent(`waveBriefing${wave}`, CinematicEventType.PLAYER, {
            duration: 3000,
            text: `Prepare for stronger enemies!`,
            className: 'cut-scene',
            backgroundImage: 'css/885542.png'
        });

        if (wave % 5 === 0) {
            cinematic.createEvent(`waveSpecial${wave}`, CinematicEventType.PLAYER, {
                duration: 3000,
                text: `Special enemies appear every 5 waves!`,
                className: 'cut-scene-special',
                backgroundImage: 'css/HD-wallpaper-artistic-pixel-art-space-moon.jpg'
            });
        }

        try {
            await cinematic.playSequence([
                `waveIntro${wave}`,
                `waveSpecial${wave}`,
                `waveBriefing${wave}`
            ]);
            window.gameState.waveTransition = false;
            return true;
        } catch (error) {
            console.error('Wave cinematic failed:', error);
            window.gameState.waveTransition = false;
            return false;
        }
    }
}
