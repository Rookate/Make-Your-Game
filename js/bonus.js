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

    checkCollisionWithProjectile(projectile, player) {
        const projectileRect = projectile.getBoundingClientRect();
        const bonusRect = this.element.getBoundingClientRect();

        if (
            bonusRect.left < projectileRect.right &&
            bonusRect.right > projectileRect.left &&
            bonusRect.top < projectileRect.bottom &&
            bonusRect.bottom > projectileRect.top
        ) {
            this.applyBonus(player);
            this.destroy();
            return true
        }
        return false
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
        }
    }

    destroy() {
        this.element.remove();
    }
}