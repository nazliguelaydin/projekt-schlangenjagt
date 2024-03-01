import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import oben from './assets/oben.png';
import unten from './assets/unten.png';
import schmetterling from './assets/schmetterling.png';
import schlange from './assets/schlange.png';
import loadingScreen from './assets/loadingscreen.jpg';
import spinnerGif from './assets/spinnerGif.gif';
//import music from './assets/sound.mp3';


class SceneA extends Phaser.Scene {
    constructor() {
        super('SceneA');
    }

    preload() {
        // Bildschirm laden
        this.load.image('loadingScreen', loadingScreen);
        this.load.image('spinnerGif', spinnerGif); // Ändere das Laden des GIFs zu `load.image`

        this.load.audio('startmusic', '/assets/startsound.mp3');
    }

    create() {


        // Hintergrundbild setzen
        this.add.image(0, 0, 'loadingScreen').setOrigin(0).setDisplaySize(800, 600);

        this.gameMusic = this.sound.add('startmusic', {
            loop: true,
            volume: 0.2
        })

        this.gameMusic.play();

        // Startbutton
        const playButton = this.add.rectangle(this.sys.scale.width / 2, this.sys.scale.height - 100, 290, 50, 0x000000, 1);
        playButton.setInteractive();
        const textButton = this.add.text(this.sys.scale.width / 2, this.sys.scale.height - 100, "Play",
            {
                fill: 'orange',
                fontSize: '24px',
                fontStyle: 'bold',
                padding: { x: 50, y: 5 },

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
            this.gameMusic.stop();
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
        this.barGroupBottomSpeed = 1;
        this.barGroupTopSpeed = 1;

    }

    preload() {
        this.load.image('backgroundImg', hintergrund);
        this.load.image('barTop', oben);
        this.load.image('barBottom', unten);
        this.load.image('snake', schlange);
        this.load.image('butterfly', schmetterling);
        this.load.audio('music', '/assets/sound.mp3');
    }

    create() {
        this.music = this.sound.add('music', {
            volume: 0.4,
            loop: true
        });

        if (!this.sound.locked) {
            this.music.play();
        } else {
            this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
                this.music.play();
            });
        }

        this.background = this.add.image(0, 0, 'backgroundImg').setOrigin(0);
        this.background2 = this.add.image(this.background.x + this.background.width, 0, 'backgroundImg').setOrigin(0);

        this.barGroupTop = this.physics.add.group();
        this.barGroupBottom = this.physics.add.group();

        // Funktion zur Erstellung der oberen Balken
        const createBarTop = () => {
            this.barGroupTop.clear(true, true);

            const barSpacing = 200; // Abstand zwischen den Balken
            const barWidth = 60;
            const numBars = Math.ceil(this.game.canvas.width / (barWidth + barSpacing)); // Anzahl der Balken basierend auf der Bildschirmbreite

            for (let i = 0; i < numBars; i++) {
                const x = i * (barWidth + barSpacing) + this.game.canvas.width; // Balken starten außerhalb des Bildschirms
                const yTop = this.game.canvas.height;
                const barHeight = Phaser.Math.Between(100, 400); // Zufällige Höhe für die Balken
                const barTop = this.physics.add.image(x, yTop - barHeight / 2, 'barTop').setDisplaySize(barWidth, barHeight).setImmovable(true);

                // Balken nach links bewegen
                this.tweens.add({
                    targets: barTop,
                    x: '-=' + (this.game.canvas.width + barWidth + barSpacing), // Ziel-X-Position (Bildschirmbreite entfernt)
                    duration: 7000, // Dauer der Bewegung
                    onComplete: () => {
                        barTop.destroy(); // Balken zerstören, wenn er den Bildschirm verlässt
                    }
                });
            }
        }

        // Funktion zur Erstellung der unteren Balken
        const createBarBottom = () => {
            this.barGroupBottom.clear(true, true);

            const barSpacing = 200; // Abstand zwischen den Balken
            const barWidth = 60;
            const numBars = Math.ceil(this.game.canvas.width / (barWidth + barSpacing)); // Anzahl der Balken basierend auf der Bildschirmbreite

            for (let i = 0; i < numBars; i++) {
                const x = i * (barWidth + barSpacing) + this.game.canvas.width; // Balken starten außerhalb des Bildschirms
                const yBottom = 0;
                const barHeight = Phaser.Math.Between(100, 400); // Zufällige Höhe für die Balken
                const barBottom = this.barGroupBottom.create(x, yBottom + barHeight / 2, 'barBottom')
                .setDisplaySize(barWidth, barHeight).setImmovable(true);
                // this.physics.add.image(x, yBottom + barHeight / 2, 'barBottom').setDisplaySize(barWidth, barHeight).setImmovable(true);

                // Balken nach links bewegen
                this.tweens.add({
                    targets: barBottom,
                    x: '-=' + (this.game.canvas.width + barWidth + barSpacing), // Ziel-X-Position (Bildschirmbreite entfernt)
                    duration: 7000, // Dauer der Bewegung
                    onComplete: () => {
                        barBottom.destroy(); // Balken zerstören, wenn er den Bildschirm verlässt
                    }
                });
            }
        }

        // Initialer Aufruf für die Balkenerstellung
        createBarTop();
        createBarBottom();
        
        // Event-Schleife für die kontinuierliche Balkenerstellung
        this.createBarBottomLoop = this.time.addEvent({
            delay: Phaser.Math.FloatBetween(5000, 10000), // Verzögerung zwischen den Wiederholungen
            callback: () => {
                createBarBottom();
                createBarTop(); // Obere Balken gleichzeitig erstellen
            },
            callbackScope: this,
            loop: true
        });

        this.snake = this.physics.add.sprite(5, this.game.canvas.height / 2, 'snake');
        this.snake.setCollideWorldBounds(true);
        this.snake.setScale(0.06);
        this.snake.refreshBody();

        
        /*
        this.physics.add.collider(this.snake, this.barGroupTop, () => {
            this.gameOver();
        });
        
        this.physics.add.collider(this.snake, this.barGroupBottom, () => {
            this.gameOver();
        });
        */
        
        

    

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
                if (this.butterflies.countActive() <= 10) {
                    for (let i = 0; i < initialButterflies; i++) {
                        createButterfly();
                    }
                }
            });
        };

        this.butterflyInterval =  setInterval(() => {
            createButterfly();
        }, 1000);

        for (let i = 0; i < initialButterflies; i++) {
            createButterfly();
        }

        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff' });
        this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            color: '#ff0000'
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setVisible(false);

        /*
        this.physics.world.overlap(this.snake, [this.barGroupTop, this.barGroupBottom], () => {
            this.gameOver();
        });
        */

        const gameOver = () => {
            console.log('aus')
            this.gameOverText.setVisible(true);
            // this.physics.pause();
            clearInterval(this.butterflyInterval); // Clear the interval
            this.physics.world.overlap(this.snake, this.butterflies, null); // End overlap checks
            this.snake.setVelocity(0);
            
        }


       this.physics.add.overlap(this.snake, this.barGroupBottom, gameOver, null, this)
       this.physics.add.overlap(this.snake, this.barGroupTop, gameOver, null, this)
       

        this.physics.world.overlap(this.snake, this.butterflies, (snake, butterfly) => {
            this.score += butterfly.getData('point');
            this.scoreText.setText('Score: ' + this.score);
            butterfly.destroy();
        });

    }

    update() {
        this.background.x -= this.backgroundSpeed;
        this.background2.x -= this.backgroundSpeed;
    
        if (this.background.x + this.background.width < 0) {
            this.background.x = this.background2.x + this.background2.width;
        }
    
        if (this.background2.x + this.background2.width < 0) {
            this.background2.x = this.background.x + this.background.width;
        }
    
        this.barGroupTop.getChildren().forEach(bar => {
            bar.x -= this.barGroupTopSpeed;
            if (bar.x + bar.width <= 0) {
                bar.destroy();
                this.createBarTop();
            }
        });
    
        this.barGroupBottom.getChildren().forEach(bar => {
            bar.x -= this.barGroupBottomSpeed;
            if (bar.x + bar.width <= 0) {
                bar.destroy();
                this.createBarBottom();
            }
        });
    
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
    
        if (!this.gameOverText.visible) {
            
    
            
            if (this.snake.y < 0 || this.snake.y > this.game.canvas.height) {
                this.snake.y = this.game.canvas.height / 2;
            }
    
            if (this.snake.x >= this.game.canvas.width) {
                this.snake.x = 0;
                this.generateNewBars();
            }
        }
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