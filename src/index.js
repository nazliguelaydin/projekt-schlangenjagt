import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import oben from './assets/oben.png';
import unten from './assets/unten.png';
import schmetterling from './assets/schmetterling.png';
import schlange from './assets/schlange.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
        this.barGroupTop = null;
        this.barGroupBottom = null;
        this.score = 0;
        this.scoreText = null;
        this.gameOverText = null;
    }

    preload() {
        this.load.image('backgroundImg', hintergrund);
        this.load.image('barTop', oben);
        this.load.image('barBottom', unten);
        this.load.image('snake', schlange);
        this.load.image('butterfly', schmetterling);
    }

    create() {
        const background = this.add.image(0, 0, 'backgroundImg').setOrigin(0);
        const scaleX = this.game.canvas.width / background.width;
        const scaleY = this.game.canvas.height / background.height;
        background.setScale(scaleX, scaleY);

        this.barGroupTop = this.physics.add.staticGroup();
        this.barGroupBottom = this.physics.add.staticGroup();

        const barSpacing = 80;
        const barWidth = 60;
        const numBars = Math.floor(this.game.canvas.width / (barWidth + barSpacing));
        let longBar = true;

        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yTop = this.game.canvas.height;
            let barHeight = 100;
            if (longBar) {
                barHeight = Phaser.Math.Between(500,700);
            } else {
                barHeight = Phaser.Math.Between(250, 500);
            }
            this.barGroupTop.create(x, yTop, 'barTop').setDisplaySize(barWidth, barHeight);
            longBar = !longBar;
        }

        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yBottom = 0;
            let barHeight = 30;
            if (longBar) {
                barHeight = Phaser.Math.Between(500, 600);
            } else {
                barHeight = Phaser.Math.Between(250, 500);
            }
            this.barGroupBottom.create(x, yBottom, 'barBottom').setDisplaySize(barWidth, barHeight);
            longBar = !longBar;
        }

        console.log("Balken wurden erstellt.");

        this.snake = this.physics.add.sprite(5, this.game.canvas.height / 2, 'snake');
        this.snake.setCollideWorldBounds(true);
        this.snake.setScale(0.06);

        this.physics.add.collider(this.snake, this.barGroupTop, () => {
            this.gameOver();
        });

        this.physics.add.collider(this.snake, this.barGroupBottom, () => {
            this.gameOver();
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.butterflies = this.physics.add.group();
        const initialButterflies = 20;
    
        const createButterfly = () => {
            const butterfly = this.butterflies.create(Phaser.Math.Between(0, this.game.canvas.width), Phaser.Math.Between(0, this.game.canvas.height), 'butterfly');
            butterfly.setCollideWorldBounds(false);
            butterfly.setScale(0.05);
            butterfly.setData('point', 1);
    
            const speedX = Phaser.Math.Between(-100, 100);
            const speedY = Phaser.Math.Between(-100, 100);
            butterfly.setVelocity(speedX, speedY);
    
            const destroyTime = Phaser.Math.Between(5000, 10000);
            this.time.delayedCall(destroyTime, () => {
                butterfly.destroy();
                // Nachdem ein Schmetterling zerstört wurde, überprüfen wir die Anzahl der verbleibenden Schmetterlinge
                if (this.butterflies.countActive() <= 10) {
                    // Wenn 5 oder weniger Schmetterlinge übrig sind, erstellen wir erneut 20 Schmetterlinge
                    for (let i = 0; i < initialButterflies; i++) {
                        createButterfly();
                    }
                }
            });
        };
    
        // Erstelle die anfänglichen Schmetterlinge
        for (let i = 0; i < initialButterflies; i++) {
            createButterfly();
        }

        // Score Text
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' });

        // Game Over Text
        this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ff0000'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false);
    }

    
   
    update() {
        // Kollisionserkennung nur durchführen, wenn das Spiel nicht vorbei ist
        if (!this.gameOverText.visible) {
            this.physics.world.overlap(this.snake, [this.barGroupTop, this.barGroupBottom], () => {
                // Nur den Game Over-Text anzeigen, aber das Spiel nicht beenden
                this.showGameOverText();
            });
    
            this.physics.world.overlap(this.snake, this.butterflies, (snake, butterfly) => {
                this.score += butterfly.getData('point');
                this.scoreText.setText('Score: ' + this.score);
                butterfly.destroy();
            });
    
            // Stelle sicher, dass das Spiel weitergeht, auch wenn die Schlange den Bildschirmrand berührt
            if (this.snake.y < 0 || this.snake.y > this.game.canvas.height) {
                this.snake.y = this.game.canvas.height / 2; // Setze die Schlange zurück in die Mitte
            }
    
            // Überprüfe, ob die Schlange den rechten Bildschirmrand erreicht hat
            if (this.snake.x >= this.game.canvas.width) {
                // Setze die Schlange zurück auf die linke Seite des Bildschirms
                this.snake.x = 0;
                // Erzeuge neue Balken, wenn die Schlange den rechten Rand erreicht
                this.generateNewBars();
            }
        }
    
        // Bewegung der Schlange mit konstanter Geschwindigkeit
        this.snake.setVelocityX(160); // X-Geschwindigkeit
        this.snake.setVelocityY(160); // Y-Geschwindigkeit
    
    
    
        // Tasteneingaben für die Steuerung der Schlange
        if (this.cursors.left.isDown) {
            this.snake.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.snake.setVelocityX(160);
        } else {
            this.snake.setVelocityX(0);
        }
    
        if (this.cursors.up.isDown) {
            this.snake.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.snake.setVelocityY(160);
        } else {
            this.snake.setVelocityY(0);
        }
    }
    
    

    gameOver() {
        if (this.gameOverText) {
            this.gameOverText.setVisible(true);
            this.physics.pause();
            this.snake.anims.stop();
            this.snake.setVelocity(0);
        }

         // Stopp das Erstellen von Schmetterlingen
         clearInterval(this.butterflyInterval);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
}
   
const game = new Phaser.Game(config);
