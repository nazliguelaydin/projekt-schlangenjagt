
/*
import { Scene } from 'phaser';
import logoImg from '/src/assets/loadingscreen.jpg';

class PreloadScene extends Scene {
    constructor() {
        super("preload");
    }

    preload() {
        this.load.image('logo', logoImg); // Verwenden Sie 'logo' anstelle von 'logoImg'
    }

    create() {
        this.add.image(400, 300, 'logo') // Verwenden Sie 'logo' anstelle von 'logoImg'
            .setScale(0.8);

        // FX
        const pixelated = this.cameras.main.postFX.addPixelate(-1);

        // Create button
        const buttonBox = this.add.rectangle(this.sys.scale.width / 2, this.sys.scale.height - 100, 290, 50, 0x000000, 1);
        buttonBox.setInteractive();
        const buttonText = this.add.text(this.sys.scale.width / 2, this.sys.scale.height - 100, "Click to start").setOrigin(0.5);

        // Click to change scene
        buttonBox.on('pointerdown', () => {
            // Transition to next scene
            this.add.tween({
                targets: pixelated,
                duration: 700,
                amount: 40,
                onComplete: () => {
                    this.cameras.main.fadeOut(100);
                    this.scene.start('MyGame'); 
                }
            });
        });
        

        
    }
}

export default startGame;

*/
