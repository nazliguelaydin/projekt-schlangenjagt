import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import oben from './assets/oben.png';
import unten from './assets/unten.png';
import schmetterling from './assets/schmetterling.png';
import schlange from './assets/schlange.png';
import loadingScreen from './assets/loadingscreen.jpg';
import spinnerGif from './assets/spinnerGif.gif';



class SceneA extends Phaser.Scene {
    constructor() {
        super('SceneA');
    }

    preload() {
        // Bildschirm laden
        this.load.image('loadingScreen', loadingScreen);
        this.load.image('spinnerGif', spinnerGif); // Ändere das Laden des GIFs zu `load.image`
    }

    create() {
        // Hintergrundbild setzen
        this.add.image(0, 0, 'loadingScreen').setOrigin(0).setDisplaySize(800,600);

        // Startbutton
        const playButton = this.add.rectangle(this.sys.scale.width / 2, this.sys.scale.height - 100, 290, 50, 0x000000, 1);
        playButton.setInteractive();
        const textButton = this.add.text(this.sys.scale.width / 2, this.sys.scale.height - 100, "Play", 
        { 
            fill: 'orange',
            fontSize: '24px',
            fontStyle: 'bold',
            padding: {x:50, y:5},
            
        }).setOrigin(0.5);

        // Spinner erstellen
        const spinner = this.add.image(this.sys.scale.width / 2, this.sys.scale.height / 2, 'spinnerGif');
        spinner.setScale(2); // Beispiel: Skalierung des Spinners
        spinner.setRotation(Phaser.Math.DegToRad(45)); // Anfangsrotation des Spinners

        // Animation des Spinners
        this.tweens.add({
            targets: spinner,
            rotation: '+=6.28', // Die Drehung um 360 Grad im Bogenmaß
            duration: 5000, // Zeit für eine vollständige Umdrehung (in Millisekunden)
            repeat: -1 // Wiederholen der Animation unendlich
        });

        // Szene wechseln
        playButton.on('pointerdown', () => {
            this.scene.start('MyGame');
        });
    }
}

class SceneB extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
        this.barGroupTop = null;
        this.barGroupBottom = null;
        this.score = 0;
        this.scoreText = null;
        this.gameOverText = null;
        this.backgroundSpeed = 1;
    }

    preload() {
        this.load.image('backgroundImg', hintergrund);
        this.load.image('barTop', oben);
        this.load.image('barBottom', unten);
        this.load.image('snake', schlange);
        this.load.image('butterfly', schmetterling);

        //this.load.audio('mainMusic', 'music/sound.mp3');

    
    }

    create() {

      
       // this.gameMusic = this.sound.add('mainMusic', { loop: true, volume: 0.15 });
        //this.gameMusic.play();
        
        

        // Erstelle den ersten Hintergrund
        this.background = this.add.image(0, 0, 'backgroundImg').setOrigin(0);

        // Erstelle den zweiten Hintergrund neben dem ersten Hintergrund
        this.background2 = this.add.image(this.background.x + this.background.width, 0, 'backgroundImg').setOrigin(0);

        // Hinzufügen der Balken
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
                barHeight = Phaser.Math.Between(500, 700);
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

        // Schlange hinzufügen und Kollisionen einrichten
        this.snake = this.physics.add.sprite(5, this.game.canvas.height / 2, 'snake');
        this.snake.setCollideWorldBounds(true);
        this.snake.setScale(0.06);
        this.physics.add.collider(this.snake, this.barGroupTop, () => {
            this.gameOver();
        });
        this.physics.add.collider(this.snake, this.barGroupBottom, () => {
            this.gameOver();
        });

        // Tastatursteuerung für die Schlange einrichten
        this.cursors = this.input.keyboard.createCursorKeys();

        // Schmetterlinge hinzufügen
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
                if (this.butterflies.countActive() <= 10) {
                    for (let i = 0; i < initialButterflies; i++) {
                        createButterfly();
                    }
                }
            });
        };

        for (let i = 0; i < initialButterflies; i++) {
            createButterfly();
        }

        // Anzeige für den Punktestand und das Game Over
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' });
        this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ff0000'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false);
    }

    update() {
        // Bewege die Hintergrundbilder nach links
        this.background.x -= this.backgroundSpeed;
        this.background2.x -= this.backgroundSpeed;
    
        // Überprüfe, ob die Hintergrundbilder den Bildschirm verlassen haben
        if (this.background.x + this.background.width < 0) {
            this.background.x = this.background2.x + this.background2.width;
        }
    
        if (this.background2.x + this.background2.width < 0) {
            this.background2.x = this.background.x + this.background.width;
        }
    
        // Steuerung der Schlange
        this.snake.setVelocity(0);
    
        if (this.cursors.left.isDown) {
            this.snake.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.snake.setVelocityX(160);
        }
    
        if (this.cursors.up.isDown) {
            this.snake.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.snake.setVelocityY(160);
        }
    
        // Kollisionen und Punkteberechnung aktualisieren
        if (!this.gameOverText.visible) {
            this.physics.world.overlap(this.snake, [this.barGroupTop, this.barGroupBottom], () => {
                this.gameOver();
            });
    
            this.physics.world.overlap(this.snake, this.butterflies, (snake, butterfly) => {
                this.score += butterfly.getData('point');
                this.scoreText.setText('Score: ' + this.score);
                butterfly.destroy();
            });
    
            if (this.snake.y < 0 || this.snake.y > this.game.canvas.height) {
                this.snake.y = this.game.canvas.height / 2;
            }
    
            if (this.snake.x >= this.game.canvas.width) {
                this.snake.x = 0;
                this.generateNewBars();
            }
        }
    }
    

    generateNewBars() {
        // Zerstöre alte Balken
        this.barGroupTop.clear(true, true);
        this.barGroupBottom.clear(true, true);
    
        // Erstelle neue Balken
        const barSpacing = 80;
        const barWidth = 60;
        const numBars = Math.floor(this.game.canvas.width / (barWidth + barSpacing));
        let longBar = true;
    
        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yTop = this.game.canvas.height;
            let barHeight = 100;
            if (longBar) {
                barHeight = Phaser.Math.Between(500, 700);
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
    scene: [SceneA, SceneB],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }

   
};
   
const game = new Phaser.Game(config);
