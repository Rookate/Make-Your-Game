export class Collision {
    constructor(gameState) {
        this.state = gameState
    }

    checkCollisions() {
        this.checkPlayerProjectiles();
        this.checkEnemyProjectiles();
    }

    checkPlayerProjectiles() { }
    checkEnemyProjectiles() { }

    isCollision(obj1, obj2) {
        const objj1Rect = obj1.element.getBoundingClientRect();
        const objj2React = obj2.element.getBoundingClientRect();

        return objj1Rect.top < objj2React.bottom &&
            objj1Rect.left < objj2React.right &&
            objj1Rect.bottom > objj2React.top &&
            objj1Rect.right > objj2React.left
    }

}

