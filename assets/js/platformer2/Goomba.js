import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class Goomba extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, goombaData){
        super(canvas, 
            image, 
            speedRatio,
            goombaData.width, 
            goombaData.height, 
            goombaData.scaleSize, 
        );

        //Initial Position of Goomba
        this.x = .6 * GameEnv.innerWidth;
    }

    update() {
        super.update();
        
        // Check for boundaries
        if (this.x <= 0 || (this.x + this.canvasWidth >= GameEnv.innerWidth) ) {
            this.speed = -this.speed;
        }

        // Every so often change direction
        if (Math.random() < 0.005) {
            this.speed = Math.random() < 0.5 ? -this.speed : this.speed;
        }

        // Move the enemy
        this.x += this.speed;
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision with the top of the Enemy
            if (this.collisionData.touchPoints.this.ontop) {
                console.log("Bye Bye Goomba");
                this.destroy();
            }
        }    
    }

}

export default Goomba;