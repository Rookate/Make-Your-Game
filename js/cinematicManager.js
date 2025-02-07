export const CinematicEventType = {
    TRANSITION: 'transition',
    TEXT: 'text',
    SCENE: 'scene',
    PLAYER: 'player',
    CUSTOM: 'custom'
};

export class CinematicEvent {
    constructor(type, config) {
        this.type = type;
        this.config = config;
        this.duration = config.duration || 3000;
    }
}

export class CinematicManager {
    constructor() {
        this.events = new Map();
        this.activeElements = new Set();
        this.isPlaying = false;
    }


    createEvent(name, type, config) {
        const event = new CinematicEvent(type, config);
        this.events.set(name, event);
        return event;
    }

    async playSequence(sequence) {
        if (this.isPlaying) return;
        this.isPlaying = true;

        try {
            for (const eventName of sequence) {
                const event = this.events.get(eventName);
                if (!event) continue;
                await this.executeEvent(event);
            }
        } finally {
            this.cleanup();
        }
    }

    async executeEvent(event) {
        const element = this.createEventElement(event);
        if (!element) return;

        this.activeElements.add(element);
        document.body.appendChild(element);

        await new Promise(resolve => {
            const cleanup = () => {
                element.remove();
                this.activeElements.delete(element);
                resolve();
            };

            if (event.type === CinematicEventType.TRANSITION) {
                element.addEventListener('animationend', cleanup);
            } else {
                setTimeout(cleanup, event.duration);
            }
        });
    }

    createEventElement(event) {
        switch (event.type) {
            case CinematicEventType.TRANSITION:
                return this.createTransitionElement(event.config);
            case CinematicEventType.TEXT:
                return this.createTextElement(event.config);
            case CinematicEventType.SCENE:
                return this.createSceneElement(event.config);
            case CinematicEventType.PLAYER:
                return this.createSceneElementPlayer(event.config);
            default:
                return null;
        }
    }

    createTransitionElement({ className = 'SceneTransition' }) {
        const element = document.createElement('div');
        element.className = className;
        return element;
    }

    createTextElement({ text, className = 'cinematic-text' }) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = text;
        return element;
    }

    createSceneElementPlayer({
        backgroundImage,
        text,
        playerImage,
        className = 'cut-scene',
        styles = {}
    }) {
        const element = document.createElement('section');
        element.className = className;

        const textElement = document.createElement('span');
        textElement.textContent = text;
        textElement.classList.add('cut-scene-text');
        element.appendChild(textElement);

        const defaultStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: '1000',
        };

        if (backgroundImage) {
            Object.assign(defaultStyles, {
                backgroundImage: `url("${backgroundImage}")`,
                backgroundSize: 'cover',
                imageRendering: 'pixelated',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            });
        }

        Object.assign(element.style, defaultStyles, styles);

        if (playerImage) {
            const playerElement = document.createElement('div');
            playerElement.id = 'playerCutscene';
            playerElement.classList.add('player-cutscene');
            Object.assign(playerElement.style, {
                position: 'absolute',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)',
                zIndex: '1001',
                backgroundImage: `url("${playerImage}")`
            });
            element.appendChild(playerElement);

            this.playerAppear(playerElement, element);
        }

        return element;
    }

    playerAppear(playerElement, element) {
        playerElement.style.animation = 'moveRight 10s linear forwards';

        setTimeout(() => {
            element.remove();
            this.activeElements.delete(element);
        }, 10000); // Match the animation duration
    }


    createSceneElement({ backgroundImage, planet, text, className = 'cut-scene', styles = {} }) {
        const element = document.createElement('section');
        element.className = className;
        const textElement = document.createElement('span');
        textElement.textContent = text;
        textElement.classList.add('cut-scene-text');
        element.appendChild(textElement);
        const defaultStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'black',
            zIndex: '1000',
        };

        if (backgroundImage) {
            Object.assign(defaultStyles, {
                backgroundImage: `url("${backgroundImage}")`,
                backgroundSize: 'cover',
                imageRendering: 'pixelated',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            });
        }

        if (planet) {
            const planetElement = document.createElement('img');
            planetElement.src = planet;
            planetElement.classList.add('cut-scene-image');
            Object.assign(planetElement.style, {
                position: 'absolute',
                top: '250px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '1000',
                width: '100px',
                height: '100px'
            });
            element.appendChild(planetElement);
        }


        return element;
    }

    cleanup() {
        this.activeElements.forEach(element => element.remove());
        this.activeElements.clear();
        this.isPlaying = false;
    }
}

