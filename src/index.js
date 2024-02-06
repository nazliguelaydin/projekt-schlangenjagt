import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import unten from './assets/unten.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
    }

    preload() {
        this.load.image('backgroundImg', hintergrund);
        this.load.image('barBottom', unten);
    }

    create() {
        const background = this.add.image(0, 0, 'backgroundImg').setOrigin(0);

        // Skaliere das Hintergrundbild, um das gesamte Fenster zu füllen
        background.setScale(this.game.canvas.width / background.width, this.game.canvas.height / background.height);

        const barGroup = this.add.group(); // Erstelle eine normale Gruppe für die Balken

        // Erstelle Balken unten
        const barSpacing = 100; // Abstand zwischen den Balken
        const barWidth = 40; // Breite der Balken
        const numBars = Math.floor(800 / (barWidth + barSpacing));
        const yValues = []; // Array für die zufälligen Y-Positionen der Balken

        for (let i = 0; i < numBars; i++) {
            yValues.push(Phaser.Math.Between(50, 300)); // Füge eine zufällige Y-Position zum Array hinzu
        }

        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const y = yValues[i]; // Holen Sie sich die Y-Position aus dem Array
            const barBottom = barGroup.create(x, y, 'barBottom').setOrigin(0.5, 0);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [MyGame]
};

const game = new Phaser.Game(config);
