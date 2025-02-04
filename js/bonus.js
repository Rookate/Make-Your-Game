import { displayBonus } from "./ui.js";

export class Bonus {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.element = this.createBonusElement();
    }

    createBonusElement() {
        const bonus = document.createElement('div');
        bonus.classList.add('bonus');
        bonus.classList.add(this.type);
        bonus.textContent = '?';
        bonus.style.left = `${this.x}px`;
        bonus.style.top = `${this.y}px`;
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(bonus);
        return bonus;
    }

    updatePosition() {
        this.y += 1;
        this.element.style.top = `${this.y}px`;
    }

    applyBonus(player) {
        switch (this.type) {
            case 'damage':
                player.increaseDamage();
                break;
            case 'spread':
                player.enableSpreadShot();
                break;
            case 'shield':
                player.activateShield();
                break;
            case 'speed':
                player.increaseShootingSpeed();
                break;
            case "lives":
                player.powerUp();
                break;
        }
    }

    destroy() {
        this.element.remove();
        const msg = displayBonus(this.x, this.y, this.type);

        setTimeout(() => {
            msg.remove()
        }, 400)
    }
}