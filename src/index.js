import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import oben from './assets/oben.png';
import unten from './assets/unten.png';
import schmetterling from './assets/schmetterling.png';
import schlange from './assets/schlange.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
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

        const barGroupTop = this.physics.add.staticGroup();
        const barGroupBottom = this.physics.add.staticGroup();

        const barSpacing = 80;
        const barWidth = 60;
        const numBars = Math.floor(this.game.canvas.width / (barWidth + barSpacing));
        let longBar = true;

        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yTop = this.game.canvas.height;
            let barHeight = 100;
            if (longBar) {
                barHeight = Phaser.Math.Between(50, 200);
            } else {
                barHeight = Phaser.Math.Between(20, 100);
            }
            barGroupTop.create(x, yTop, 'barTop').setDisplaySize(barWidth, barHeight);
            longBar = !longBar;
        }

        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yBottom = 0;
            let barHeight = 30;
            if (longBar) {
                barHeight = Phaser.Math.Between(100, 200);
            } else {
                barHeight = Phaser.Math.Between(20, 100);
            }
            barGroupBottom.create(x, yBottom, 'barBottom').setDisplaySize(barWidth, barHeight);
            longBar = !longBar;
        }

        console.log("Balken wurden erstellt.");

        this.snake = this.physics.add.sprite(5, this.game.canvas.height / 2, 'snake');
        this.snake.setCollideWorldBounds(true);
        this.snake.setScale(0.1); // Anpassung der Größe

        this.cursors = this.input.keyboard.createCursorKeys();

  

       
        this.butterflies = this.physics.add.group();
        const numButterflies = 5;
        for (let i = 0; i < numButterflies; i++) {
            const butterfly = this.butterflies.create(Phaser.Math.Between(0, this.game.canvas.width), Phaser.Math.Between(0, this.game.canvas.height), 'butterfly');
            butterfly.setCollideWorldBounds(true);
            butterfly.setScale(0.05); // Anpassung der Größe
        }
    

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.physics.add.collider(this.snake, barGroupTop);
        this.physics.add.collider(this.snake, barGroupBottom);

        this.physics.add.overlap(this.snake, this.butterflies, this.handleEatButterfly, null, this);
    }

    update() {
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

    handleEatButterfly(snake, butterfly) {
        butterfly.destroy();
        this.butterflies.create(Phaser.Math.Between(0, this.game.canvas.width), Phaser.Math.Between(0, this.game.canvas.height), 'butterfly').setScale(0.5);
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
};

const game = new Phaser.Game(config);
