class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.esprits = data.esprits;
    };

    create() {

        this.cameras.main
            .setBounds(0, 0, 600, 400)
            .setSize(600, 400)
            .setOrigin(0, 0)
            .fadeIn(1500, 255, 255, 255) // fondu au noir

        this.logo = this.add.image(50, 200, 'logoMainScreen').setOrigin(0, 0).setScale(0.8).setAlpha(0);

        this.end1 = ["You have reached the gates of Heaven."];
        this.end2 = ["The souls you have carried fly away into this realm of purity,"];
        this.end3 = ["But you are condemned to remain within the confines of this land of light."];
        this.end4 = ["Your work is not finished."];
        this.end5 = ["It never will be."];

        this.end = [this.end1, this.end2, this.end3, this.end4, this.end5]

        this.texts = [];

        let temps = 3000;

        for (let step = 0; step < 12; step++) {

            if (step < 7) {
                const distanceY = 50 + 50 * step;

                this.time.delayedCall(temps, () => {
                    const newTexte = this.add.text(300, distanceY, this.end[step], { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'justify' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;
                    this.tweens.add({
                        targets: newTexte,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                    this.texts.push(newTexte);

                }, [], this);
            }

            if (step == 6) {

                this.time.delayedCall(temps, () => {
                    this.tweens.add({
                        targets: this.texts,
                        alpha: 0,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }

            if (step == 7) {

                this.time.delayedCall(temps, () => {

                    const newTexte = this.add.text(215, 75, "You have saved", { font: '26px MorrisRomanBlack', fill: '#ffffff', align: 'justify' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;

                    this.tweens.add({
                        targets: newTexte,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }

            if (step == 8) {

                this.time.delayedCall(temps, () => {

                    const newTexte = this.add.text(312, 75, `${this.esprits}`, { font: '26px MorrisRomanBlack', fill: '#ffffff', align: 'justify' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;

                    this.tweens.add({
                        targets: newTexte,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });
                }, [], this);
            }

            if (step == 9) {

                this.time.delayedCall(temps, () => {

                    const newTexte = this.add.text(390, 75, "souls on 24.", { font: '26px MorrisRomanBlack', fill: '#ffffff', align: 'justify' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;

                    this.tweens.add({
                        targets: newTexte,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }

            if (step == 10) {

                this.time.delayedCall(temps, () => {

                    const newText1 = this.add.text(300, 175, "And thank you for playing", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'justify' }).setOrigin(0.5, 0.5).setAlpha(0) // fondu au noir;

                    this.tweens.add({
                        targets: newText1,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }

            if (step == 11) {

                this.time.delayedCall(temps, () => {

                    this.tweens.add({
                        targets: this.logo,
                        alpha: 1,
                        duration: 1000,  // Durée de l'animation en millisecondes
                        ease: 'Linear', // Fonction d'interpolation pour l'animation
                    });

                }, [], this);
            }








            temps += 3000

        }

    }
}

export default GameOver