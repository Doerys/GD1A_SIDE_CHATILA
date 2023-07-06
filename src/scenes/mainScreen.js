class MainScreen extends Phaser.Scene {
    constructor() {
        super("MainScreen");
    }

    create() {

        this.music = this.sound.add('music');

        this.music.play();
        this.music.setLoop(true)
            .setVolume(0.4);

        this.logo = this.add.image(50, 50, 'logoMainScreen').setOrigin(0, 0).setScale(0.8).setAlpha(0);

        this.startButton = this.add.text(200, 280, 'START', { font: '50px MorrisRomanBlack', fill: '#ffffff', justify: 'middle' })
            .setTint(0xffffff)
            .setOrigin(0, 0)
            .setAlpha(0)
            .setInteractive({ cursor: 'pointer' });

        this.startButton.on("pointerdown", this.launchGame, this)

        this.intro1 = ["Trapped between the realms of the living and the dead,"];
        this.intro2 = ["You are entrusted with the infinite destiny of leading lost souls to Heaven."];
        this.intro3 = ["There is no rest for you. No peace, no thanks."];
        this.intro4 = ["Only an eternal debt to pay, an endless quest for redemption,"];
        this.intro5 = ["Because you're one of them."];
        this.intro6 = ["A Souls' Guardian."];

        this.intro = [this.intro1, this.intro2, this.intro3, this.intro4, this.intro5, this.intro6]

        this.cameras.main
            .setBounds(0, 0, 600, 400)
            .setSize(600, 400)
            .setOrigin(0, 0)
            .fadeIn(1500, 0, 0, 0) // fondu au noir

        this.texts = [];

        let temps = 3000;

        for (let step = 0; step < 9; step++) {

            if (step < 7) {
                const distanceY = 50 + 50*step; 

                this.time.delayedCall(temps, () => {
                    const newTexte = this.add.text(300, distanceY, this.intro[step], { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;
                    this.tweens.add({
                        targets: newTexte,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                    this.texts.push(newTexte);
                
                }, [], this);
            }

            if (step == 7) {

                this.time.delayedCall(temps, () => {
                    this.tweens.add({
                        targets: this.texts,
                        alpha: 0,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });
                
                }, [], this);
            }

            if (step == 8) {

                this.time.delayedCall(temps, () => {
                    this.tweens.add({
                        targets: this.logo,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });
                
                    this.tweens.add({
                        targets: this.startButton,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }

            temps += 3000
        }
    }

    update() {

        this.startButton.on('pointerover', () => { this.startButton.setTint(0x808080) }, this);

        this.startButton.on('pointerout', () => { this.startButton.setTint(0xffffff) }, this);

    }

    launchGame() {

        this.cameras.main
            .fadeOut(1500, 0, 0, 0) // fondu au noir

        this.scene.start("LevelScene");
    }

}

export default MainScreen