class Preload extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    // FONCTION PRELOAD - précharger en mémoire les éléments de notre jeu (assets)
    preload() {

        // Player
        this.load.spritesheet('perso', 'assets/perso_spritesheet.png',
            { frameWidth: 32, frameHeight: 64 });

        // BACKGROUND
        this.load.image('background', 'assets/background.png');
        this.load.image('secondPlan', 'assets/secondPlan.png');
        this.load.image('secondPlanMontagne', 'assets/secondPlan_montagne.png');

        // logo
        this.load.image('logoMainScreen', 'assets/logo.png');

        // UI
        // UI - LIFE
        this.load.image('lifeFull', "assets/Life_Full.png");
        this.load.image('life1', "assets/Life_Hurt_1.png");
        this.load.image('life2', "assets/Life_Hurt_2.png");
        this.load.image('life3', "assets/Life_Hurt_3.png");
        this.load.image('lifeDead', "assets/Life_Dead.png");

        // UI - ESPRITS
        this.load.image('fond_score', 'assets/fond_chiffre.png');
        this.load.image('espritUI', "assets/esprit.png");

        // UI - CLEF
        this.load.image('clefUI', 'assets/clefUI.png');

        // PLATEFORMES
        this.load.tilemapTiledJSON("carte", "assets/map.json");
        this.load.image("Phaser_tuilesdejeu", "assets/tuilesJeu.png");

        // OBSTACLES
        this.load.image('cristauxImage', 'assets/cristaux.png');

        this.load.image('picsBasImage', 'assets/picsBas.png');
        this.load.image('picsHautImage', 'assets/picsHaut.png');
        this.load.image('picsDroiteImage', 'assets/picsDroite.png');
        this.load.image('picsGaucheImage', 'assets/picsGauche.png');

        this.load.image('retractPicsBasOn', 'assets/extractPicsBas.png');
        this.load.image('retractPicsHautOn', 'assets/extractPicsHaut.png');
        this.load.image('retractPicsDroiteOn', 'assets/extractPicsDroite.png');
        this.load.image('retractPicsGaucheOn', 'assets/extractPicsGauche.png');

        this.load.image('retractPicsBasOff', 'assets/retractPicsBas.png');
        this.load.image('retractPicsHautOff', 'assets/retractPicsHaut.png');
        this.load.image('retractPicsDroiteOff', 'assets/retractPicsDroite.png');
        this.load.image('retractPicsGaucheOff', 'assets/retractPicsGauche.png');

        this.load.image('laveImage', 'assets/lava.png');

        this.load.image('picsGlaceBasImage', 'assets/picsGlaceBas.png');
        this.load.image('picsGlaceHautImage', 'assets/picsGlaceHaut.png');
        this.load.image('picsGlaceDroiteImage', 'assets/picsGlaceDroite.png');
        this.load.image('picsGlaceGaucheImage', 'assets/picsGlaceGauche.png');

        this.load.image('trigger1x7', 'assets/trigger1x7.png');
        this.load.image('trigger1x9', 'assets/trigger1x9.png');
        this.load.image('trigger1x3', 'assets/trigger1x3.png');

        this.load.image('glaceFragileImage', 'assets/glaceFragile.png');

        // MOBS
        this.load.image('monsterRightApparence', 'assets/monstre_right.png');
        this.load.image('monsterLeftApparence', 'assets/monstre_left.png');

        // ELEMENTS INTERACTIFS

        // BOUTON ET PORTE ROSE
        this.load.image('boutonRoseImage', 'assets/boutonRose.png');
        this.load.image('porteRoseImage', 'assets/porteRose.png');

        // BOUTON ET PORTE VERTE
        this.load.image('boutonVertImage', 'assets/boutonVert.png');
        this.load.image('porteVertImage', 'assets/porteVerte.png');

        // PICK UPS OBJECTS
        this.load.image('espritCollectible', 'assets/esprit_in_game.png');
        this.load.image("powerUpImage", 'assets/powerUp.png');

        this.load.image('clefsImage', 'assets/clef.png');
        this.load.image('porteFinale', 'assets/porteFinale.png');

        this.load.audio('music', 'assets/music.mp3');

        // ----------------------------------------------------- FIN FONCTION PRELOAD ----------------------------------------------

    }

    create() {

        // ANIMATIONS

        // PLAYER - MARCHE GAUCHE
        this.anims.create({
            key: 'runLeft',
            frames: this.anims.generateFrameNumbers('perso', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // PLAYER - MARCHE DROITE
        this.anims.create({
            key: 'runRight',
            frames: this.anims.generateFrameNumbers('perso', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // PLAYER - SAUT GAUCHE
        this.anims.create({
            key: 'jumpLeft',
            frames: [{ key: 'perso', frame: 0 }],
            frameRate: 20
        });
  
        // PLAYER - SAUT GAUCHE
        this.anims.create({
            key: 'jumpRight',
            frames: [{ key: 'perso', frame: 8 }],
            frameRate: 20
        });

        // PLAYER - IDLE
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'perso', frame: 4 }],
            frameRate: 20
        });

        this.scene.start("MainScreen");

    }

}

export default Preload