import Phaser from 'phaser';
import hintergrund from './assets/hintergrund.png';
import oben from './assets/oben.png';
import unten from './assets/unten.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'MyGame' });
    }

    preload() {
        // Hintergrundbild und Balken laden
        this.load.image('backgroundImg', hintergrund);
        this.load.image('barTop', oben); // Bild für Balken oben laden
        this.load.image('barBottom', unten); // Bild für Balken unten laden
    }

    create() {
        // Hintergrundbild hinzufügen
        const background = this.add.image(0, 0, 'backgroundImg').setOrigin(0);

        // Skalierung des Hintergrundbilds anpassen, um es vollständig anzuzeigen
        const scaleX = this.game.canvas.width / background.width;
        const scaleY = this.game.canvas.height / background.height;
        background.setScale(scaleX, scaleY);

        // Balkengruppe für Balken oben und unten erstellen
        const barGroupTop = this.add.group();
        const barGroupBottom = this.add.group();

        const barSpacing = 100;
        const barWidth = 60; // Breite der Balken erhöhen
        const numBars = Math.floor(800 / (barWidth + barSpacing));
        let longBar = true; // Variable, um abwechselnd lange und kurze Balken zu erzeugen

        // Balken oben an der Linie des Hintergrunds erstellen
        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yTop = background.y; // Balken oben an der Linie des Hintergrunds beginnen
            let barHeight = 20; // Standardhöhe für kurze Balken
            if (longBar) {
                barHeight = Phaser.Math.Between(50, 200); // Zufällige Höhe für lange Balken
            } else {
                barHeight = Phaser.Math.Between(20, 100); // Zufällige Höhe für kurze Balken
            }
            const barTop = barGroupTop.create(x, yTop, 'barTop').setOrigin(0.5, 0).setDisplaySize(barWidth, barHeight);
            longBar = !longBar; // Toggle zwischen langen und kurzen Balken
        }

        // Balken unten an der Linie des Hintergrunds erstellen
        for (let i = 0; i < numBars; i++) {
            const x = (i * (barWidth + barSpacing)) + (barWidth / 2);
            const yBottom = background.height; // Balken unten an der Linie des Hintergrunds beginnen
            let barHeight = 20; // Standardhöhe für kurze Balken
            if (longBar) {
                barHeight = Phaser.Math.Between(50, 200); // Zufällige Höhe für lange Balken
            } else {
                barHeight = Phaser.Math.Between(20, 100); // Zufällige Höhe für kurze Balken
            }
            const barBottom = barGroupBottom.create(x, yBottom, 'barBottom').setOrigin(0.5, 1).setDisplaySize(barWidth, barHeight);
            longBar = !longBar; // Toggle zwischen langen und kurzen Balken
        }

        // Debugging-Ausgabe
        console.log("Balken wurden erstellt.");
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
