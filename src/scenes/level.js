class Level extends Phaser.Scene {

    constructor(name) { // name = on reprend le nom qu'on trouve dans le constructeur du niveau
        super({
            key: "LevelScene",
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 600 },
                    debug: false,
                    tileBias: 32, // permet d'éviter de passer à travers les tiles à la réception d'un saut
                }
            },

            input: { gamepad: true },
            pixelArt: true,

            fps: {
                target: 60,
            }
        })
    }

    // FONCTION CREATE - Gère le stade initial du jeu
    create() {

        // VARIABLES
        this.player;

        this.gameOver = false;

        this.cursors; // commandes fleches directionnellements 

        this.health = 4; // pv
        this.frameInvincible = 0; // durée invincibilité
        this.invincibleOn = false;

        this.commandesLocked = false; // bloquage commandes déplacements
        this.wallJumpLocked = false; // bloquage wall jump

        this.esprits; // image esprits collectables
        this.textScore; // texte de score
        this.espritScore = 0; // nb esprits collectés

        this.porteVertDisable = false; // bouton vert appuyé
        this.porteRoseDisable = false; // bouton rose appuyé

        this.clefUI;
        this.clefScore = 0; // nb de clés récoltées
        this.textclefScore; // texte de score clef

        this.wallNeige = false; // contact tile neige
        this.wallIce = false; // contact tile glace

        this.doubleJumpAbility = false; // activation Double Jump
        this.didPressJump = false; // pression bouton Jump
        this.canDoubleJump = false; // possibilité Double Jump

        this.picsRetractOn = false; // pattern des pics rétractables

        this.checkPointScore = 0;

        this.controller = false; //controles manette

        // ARRIERE PLAN
        // ARRIERE PLAN - BACKGROUND
        this.background = this.add.tileSprite(0, 0, 1600, 1600, "background").setDepth(-4);
        this.background.setOrigin(0, 0);

        // ARRIERE PLAN - SECOND PLAN
        this.sndPlan = this.add.tileSprite(0, 0, 1600, 1600, "secondPlan").setDepth(-3);
        this.sndPlan.setOrigin(0, 0);

        // ARRIERE PLAN - Second plan montagne (effet parallaxe)
        this.sndPlanParallax = this.add.tileSprite(0, 0, 1600, 1600, "secondPlanMontagne").setDepth(-2);
        this.sndPlanParallax.setOrigin(0, 0);
        this.sndPlanParallax.setScrollFactor(0.8, 1);

        // PLAYER

        this.spawnX = 1350;
        this.spawnY = 645;

        this.player = this.physics.add.sprite(this.spawnX, this.spawnY, 'perso'); // SPAWN DEBUT BIOME CAVERNE (DEPART NORMAL)

        //this.player = this.physics.add.sprite(690, 1450, 'perso'); // SPAWN DEBUT BIOME DONJON

        //this.player = this.physics.add.sprite(462, 480, 'perso'); // SPAWN DEBUT BIOME MONTAGNE

        this.checkPoint1 = this.physics.add.staticSprite(690, 1450, 'perso').setAlpha(0);

        this.physics.add.overlap(this.player, this.checkPoint1, () => {

            if (this.checkPointScore == 0) {
                this.checkPointScore++;
                this.spawnX = this.checkPoint1.x;
                this.spawnY = this.checkPoint1.y;
            }

        }, null, this);

        this.checkPoint2 = this.physics.add.staticSprite(462, 480, 'perso').setAlpha(0);

        this.physics.add.overlap(this.player, this.checkPoint2, () => {

            if (this.checkPointScore == 1) {
                this.checkPointScore++;
                this.spawnX = this.checkPoint2.x;
                this.spawnY = this.checkPoint2.y;
            }

        }, null, this);

        this.player.setSize(24, 48, true); // Taille hitbox personnage

        this.player.setOffset(4, 15); // placement hitbox personnage;

        //TILED
        // TILEMAP    
        const carteDuNiveau = this.add.tilemap("carte");

        // TILESET
        const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu", "Phaser_tuilesdejeu",);

        // CALQUES OBJETS (PART 1)

        //OBSTACLES CAVERNE ET DONJON

        //CRISTAUX (CAVERNE)
        //récupération
        this.cristaux = this.physics.add.staticGroup();
        this.cristauxLayer = carteDuNiveau.getObjectLayer('cristauxLayer')['objects'];

        // creation
        this.cristauxLayer.forEach(object => {
            let obj = this.cristaux.create(object.x + 16, object.y - 10, 'cristauxImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.cristaux, this.spikeHit, null, this);

        // LAVE (DONJON)
        //récupération
        this.lave = this.physics.add.staticGroup();
        this.laveLayer = carteDuNiveau.getObjectLayer('laveLayer')['objects'];

        // creation
        this.laveLayer.forEach(object => {
            let obj = this.lave.create(object.x + 16, object.y - 10, 'laveImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.lave, this.spikeHit, null, this);

        //PICS NORMAUX (DONJON)

        // PICS BAS

        //récupération
        this.picsBas = this.physics.add.staticGroup();
        this.picsBasLayer = carteDuNiveau.getObjectLayer('picsBasLayer')['objects'];

        // creation
        this.picsBasLayer.forEach(object => {
            let obj = this.picsBas.create(object.x + 16, object.y - 16, 'picsBasImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsBas, this.spikeHit, null, this);

        // PICS HAUT

        //récupération
        this.picsHaut = this.physics.add.staticGroup();
        this.picsHautLayer = carteDuNiveau.getObjectLayer('picsHautLayer')['objects'];

        // creation
        this.picsHautLayer.forEach(object => {
            let obj = this.picsHaut.create(object.x + 16, object.y - 16, 'picsHautImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsHaut, this.spikeHit, null, this);

        // PICS DROITE

        //récupération
        this.picsDroite = this.physics.add.staticGroup();
        this.picsDroiteLayer = carteDuNiveau.getObjectLayer('picsDroiteLayer')['objects'];

        // creation
        this.picsDroiteLayer.forEach(object => {
            let obj = this.picsDroite.create(object.x + 16, object.y - 16, 'picsDroiteImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsDroite, this.spikeHit, null, this);

        // PICS GAUCHE

        //récupération
        this.picsGauche = this.physics.add.staticGroup();
        this.picsGaucheLayer = carteDuNiveau.getObjectLayer('picsGaucheLayer')['objects'];

        // creation
        this.picsGaucheLayer.forEach(object => {
            let obj = this.picsGauche.create(object.x + 16, object.y - 16, 'picsGaucheImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsGauche, this.spikeHit, null, this);

        // PICS RETRACTABLES (DONJON)

        // PICS RETRACTABLES BAS

        // OFF
        //récupération
        this.retractPicsBasOff = this.physics.add.staticGroup();
        this.retractPicsBasOffLayer = carteDuNiveau.getObjectLayer('retractPicsBasOffLayer')['objects'];
        // creation
        this.retractPicsBasOffLayer.forEach(object => {
            let obj = this.retractPicsBasOff.create(object.x + 16, object.y - 7, 'retractPicsBasOff');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // ON
        //récupération
        this.retractPicsBas = this.physics.add.staticGroup();
        this.retractPicsBasLayer = carteDuNiveau.getObjectLayer('retractPicsBasLayer')['objects'];
        // creation
        this.retractPicsBasLayer.forEach(object => {
            let obj = this.retractPicsBas.create(object.x + 16, object.y - 16, 'retractPicsBasOn');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });
        // collisions
        this.physics.add.overlap(this.player, this.retractPicsBas, this.picsRetractablesKill, null, this);

        // PICS RETRACTABLES DROITE

        // OFF
        //récupération
        this.retractPicsDroiteOff = this.physics.add.staticGroup();
        this.retractPicsDroiteOffLayer = carteDuNiveau.getObjectLayer('retractPicsDroiteOffLayer')['objects'];
        // creation
        this.retractPicsDroiteOffLayer.forEach(object => {
            let obj = this.retractPicsDroiteOff.create(object.x + 24, object.y - 16, 'retractPicsDroiteOff');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // ON
        //récupération
        this.retractPicsDroite = this.physics.add.staticGroup();
        this.retractPicsDroiteLayer = carteDuNiveau.getObjectLayer('retractPicsDroiteLayer')['objects'];
        // creation
        this.retractPicsDroiteLayer.forEach(object => {
            let obj = this.retractPicsDroite.create(object.x + 16, object.y - 16, 'retractPicsDroiteOn');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });
        // collisions
        this.physics.add.overlap(this.player, this.retractPicsDroite, this.picsRetractablesKill, null, this);

        // PICS RETRACTABLES GAUCHE

        // OFF
        //récupération
        this.retractPicsGaucheOff = this.physics.add.staticGroup();
        this.retractPicsGaucheOffLayer = carteDuNiveau.getObjectLayer('retractPicsGaucheOffLayer')['objects'];
        // creation
        this.retractPicsGaucheOffLayer.forEach(object => {
            let obj = this.retractPicsGaucheOff.create(object.x + 7, object.y - 16, 'retractPicsGaucheOff');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // ON
        //récupération
        this.retractPicsGauche = this.physics.add.staticGroup();
        this.retractPicsGaucheLayer = carteDuNiveau.getObjectLayer('retractPicsGaucheLayer')['objects'];
        // creation
        this.retractPicsGaucheLayer.forEach(object => {
            let obj = this.retractPicsDroite.create(object.x + 16, object.y - 16, 'retractPicsGaucheOn');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });
        // collisions
        this.physics.add.overlap(this.player, this.retractPicsGauche, this.picsRetractablesKill, null, this);

        // PICS GLACE (MONTAGNE)

        // PICS GLACE BAS

        //récupération
        this.picsGlaceBas = this.physics.add.staticGroup();
        this.picsGlaceBasLayer = carteDuNiveau.getObjectLayer('picsGlaceBasLayer')['objects'];

        // creation
        this.picsGlaceBasLayer.forEach(object => {
            let obj = this.picsGlaceBas.create(object.x + 16, object.y - 10, 'picsGlaceBasImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsGlaceBas, this.spikeHit, null, this);

        // PICS GLACE DROITE

        //récupération
        this.picsGlaceDroite = this.physics.add.staticGroup();
        this.picsGlaceDroiteLayer = carteDuNiveau.getObjectLayer('picsGlaceDroiteLayer')['objects'];

        // creation
        this.picsGlaceDroiteLayer.forEach(object => {
            let obj = this.picsGlaceDroite.create(object.x + 22, object.y - 16, 'picsGlaceDroiteImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsGlaceDroite, this.spikeHit, null, this);

        // PICS GLACE GAUCHE

        //récupération
        this.picsGlaceGauche = this.physics.add.staticGroup();
        this.picsGlaceGaucheLayer = carteDuNiveau.getObjectLayer('picsGlaceGaucheLayer')['objects'];

        // creation
        this.picsGlaceGaucheLayer.forEach(object => {
            let obj = this.picsGlaceGauche.create(object.x + 10, object.y - 16, 'picsGlaceGaucheImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.picsGlaceGauche, this.spikeHit, null, this);

        // CALQUES TILESET
        // PLATEFORMES NORMALES
        const plateformes = carteDuNiveau.createLayer("plateformes", tileset);
        // collisions
        plateformes.setCollisionByProperty({ estSolide: true });
        this.physics.add.collider(this.player, plateformes, this.normalPlatsProperties, null, this);

        // PLATEFORMES NEIGE
        const plateformesNeige = carteDuNiveau.createLayer("plateformesNeige", tileset);
        // collisions
        plateformesNeige.setCollisionByProperty({ estNeige: true });
        this.physics.add.collider(this.player, plateformesNeige, this.neigePlatsProperties, null, this);

        // PLATEFORMES GLACE __
        const plateformesGlace = carteDuNiveau.createLayer("plateformesGlace", tileset);
        // collisions
        plateformesGlace.setCollisionByProperty({ estGlace: true });
        this.physics.add.collider(this.player, plateformesGlace, this.glacePlatsProperties, null, this);

        // CALQUES OBJETS (PART 2)

        //OBSTACLES MONTAGNE

        // PLATEFORMES GLACE FRAGILES (MONTAGNE)

        //récupération
        this.platsGlaceFragile = this.physics.add.staticGroup();
        this.platsGlaceFragileLayer = carteDuNiveau.getObjectLayer('platsGlaceFragileLayer')['objects'];

        // creation
        this.platsGlaceFragileLayer.forEach(object => {
            let obj = this.platsGlaceFragile.create(object.x + 16, object.y - 16, 'glaceFragileImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.collider(this.player, this.platsGlaceFragile, this.destructionGlace, null, this);

        this.listPicsGlaceHaut = [];

        const picsGlaceHautLayer = carteDuNiveau.getObjectLayer('picsGlaceHautLayer');

        picsGlaceHautLayer.objects.forEach(pic => {
            const picsGlaceHautLayer = this.physics.add.sprite(pic.x + 16, pic.y + 16, "picsGlaceHautImage");
            picsGlaceHautLayer.body.setAllowGravity(false);

            this.listPicsGlaceHaut.push(picsGlaceHautLayer);

            this.physics.add.overlap(this.player, picsGlaceHautLayer, this.spikeHit, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHautLayer, this.destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHautLayer, this.destroyPicGlace, null, this);
            this.physics.add.collider(this.platsGlaceFragile, picsGlaceHautLayer, this.destroyPicGlace, null, this);

            // ici, il faudrait chopper la taille de la liste => permet de savoir l'index du dernier objet à avoir été push dans la liste

            if (pic.name == "7") {
                const triggerFallIce = this.physics.add.staticSprite(pic.x + 16, pic.y + 112, "trigger1x7").setVisible(false)

                this.physics.add.overlap(triggerFallIce, this.player, () => {
                    setTimeout(() => { picsGlaceHautLayer.body.setAllowGravity(true); }, 500)
                    triggerFallIce.disableBody(true, true);
                }, null, this);
            }

            else if (pic.name == "9") {
                const triggerFallIce = this.physics.add.staticSprite(pic.x + 16, pic.y + 144, "trigger1x9").setVisible(false)

                this.physics.add.overlap(triggerFallIce, this.player, () => {
                    setTimeout(() => { picsGlaceHautLayer.body.setAllowGravity(true); }, 500)
                    triggerFallIce.disableBody(true, true);
                }, null, this);
            }

            else if (pic.name == "3") {
                const triggerFallIce = this.physics.add.staticSprite(pic.x + 16, pic.y + 48, "trigger1x3").setVisible(false)

                this.physics.add.overlap(triggerFallIce, this.player, () => {
                    setTimeout(() => { picsGlaceHautLayer.body.setAllowGravity(true); }, 500)
                    triggerFallIce.disableBody(true, true);
                }, null, this);
            }
        });

        //MOBS 
        // MONSTRES VERS DROITE
        // récupération
        this.monstresRight = this.physics.add.group();
        this.monstresRightLayer = carteDuNiveau.getObjectLayer('monstresRightLayer');

        // creation
        this.monstresRightLayer.objects.forEach(monstresRightLayer => {
            const MmonstresRightLayer = this.monstresRight.create(monstresRightLayer.x + 16, monstresRightLayer.y + 16, "monsterRightApparence").body.setAllowGravity(false).setBounce(1);
        });
        this.monstresRight.setVelocity(0, 100);

        // collisions
        this.physics.add.overlap(this.player, this.monstresRight, this.toucheMob, null, this);

        //BORDURES MONSTRES RIGHT (délimitant les déplacements des Ennemis de droite)
        // récupération
        this.limitesMonstresRight = this.physics.add.group();
        this.limitesMonstresRightLayer = carteDuNiveau.getObjectLayer('limitesMonstresRightLayer');

        // création
        this.limitesMonstresRightLayer.objects.forEach(limitesMonstresRightLayer => {
            const LimitesMonstresRightLayer = this.limitesMonstresRight.create(limitesMonstresRightLayer.x + 16, limitesMonstresRightLayer.y + 16).setVisible(false).body.setAllowGravity(false).setImmovable(true);
        });

        // collisions
        this.physics.add.collider(this.monstresRight, this.limitesMonstresRight);

        //MONSTRES VERS GAUCHE
        // récupération
        this.monstresLeft = this.physics.add.group();
        this.monstresLeftLayer = carteDuNiveau.getObjectLayer('monstresLeftLayer');

        // creation
        this.monstresLeftLayer.objects.forEach(monstresLeftLayer => {
            const MMonstresLeftLayer = this.monstresLeft.create(monstresLeftLayer.x + 16, monstresLeftLayer.y + 16, "monsterLeftApparence").body.setAllowGravity(false).setBounce(1);
        });
        this.monstresLeft.setVelocity(0, 100);

        // collisions
        this.physics.add.overlap(this.player, this.monstresLeft, this.toucheMob, null, this);

        //BORDURES MONSTRES LEFT (délimitant les déplacements des Ennemis de gauche)
        // récupération
        this.limitesMonstresLeft = this.physics.add.group();
        this.limitesMonstresLeftLayer = carteDuNiveau.getObjectLayer('limitesMonstresLeftLayer');

        // création
        this.limitesMonstresLeftLayer.objects.forEach(limitesMonstresLeftLayer => {
            const LimitesMonstresLeftLayer = this.limitesMonstresLeft.create(limitesMonstresLeftLayer.x + 16, limitesMonstresLeftLayer.y + 16).setVisible(false).body.setAllowGravity(false).setImmovable(true);
        });

        // collisions
        this.physics.add.collider(this.monstresLeft, this.limitesMonstresLeft);

        // ELEMENTS INTERACTIFS

        // BOUTON ROSE

        //récupération
        //this.boutonRose = this.physics.add.staticGroup();
        this.boutonRoseLayer = carteDuNiveau.getObjectLayer('boutonRoseLayer')['objects'];

        // creation
        this.boutonRoseLayer.forEach(object => {
            this.boutonRose = this.physics.add.staticSprite(object.x + 16, object.y - 11, 'boutonRoseImage').setScale(object.width / 32, object.height / 32);

            this.textBoutonRose = this.add.text(object.x + 16, object.y + 16, "Press E", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setAlpha(0);

            this.boutonRose.body.width = object.width;
            this.boutonRose.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.boutonRose, this.pressBoutonRose, null, this);

        // PORTE ROSE

        //récupération
        //this.porteRose = this.physics.add.staticGroup();
        this.porteRoseLayer = carteDuNiveau.getObjectLayer('porteRoseLayer')['objects'];

        // creation
        this.porteRoseLayer.forEach(object => {
            this.porteRose = this.physics.add.staticSprite(object.x + 16, object.y + 32, 'porteRoseImage').setScale(object.width / 32, object.height / 64);
            this.porteRose.body.width = object.width;
            this.porteRose.body.height = object.height;
        });

        // collisions
        this.physics.add.collider(this.player, this.porteRose, this.disablePorteRose, null, this);

        // BOUTON VERT

        //récupération
        //this.boutonVert = this.physics.add.staticGroup();
        this.boutonVertLayer = carteDuNiveau.getObjectLayer('boutonVertLayer')['objects'];

        // creation
        this.boutonVertLayer.forEach(object => {
            this.boutonVert = this.physics.add.staticSprite(object.x + 16, object.y - 16, 'boutonVertImage').setScale(object.width / 32, object.height / 32);
            
            this.textBoutonVert = this.add.text(object.x + 16, object.y + 16, "Press E", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setAlpha(0);
            
            this.boutonVert.body.width = object.width;
            this.boutonVert.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.boutonVert, this.pressBoutonVert, null, this);

        // PORTE VERTE

        //récupération
        //this.porteVert = this.physics.add.staticGroup();
        this.porteVertLayer = carteDuNiveau.getObjectLayer('porteVerteLayer')['objects'];

        // creation
        this.porteVertLayer.forEach(object => {
            this.porteVert = this.physics.add.staticSprite(object.x + 16, object.y + 32, 'porteVertImage').setScale(object.width / 32, object.height / 64);
            this.porteVert.body.width = object.width;
            this.porteVert.body.height = object.height;
        });

        // collisions
        this.physics.add.collider(this.player, this.porteVert, this.disablePorteVert, null, this);

        // PICK-UP-OBJECTS 

        //CLEFS
        //récupération
        this.clef = this.physics.add.staticGroup();
        this.clefsLayer = carteDuNiveau.getObjectLayer('clefsLayer')['objects'];

        // creation
        this.clefsLayer.forEach(object => {
            let obj = this.clef.create(object.x + 16, object.y - 16, 'clefsImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.clef, this.collectClefs, null, this);

        //PORTE FINALE
        //récupération
        //this.porteFinale = this.physics.add.staticGroup();
        this.porteFinaleLayer = carteDuNiveau.getObjectLayer('porteFinaleLayer')['objects'];

        // creation
        this.porteFinaleLayer.forEach(object => {
            this.porteFinale = this.physics.add.staticSprite(object.x + 16, object.y + 48, 'porteFinale').setScale(object.width / 32, object.height / 96);
            this.porteFinale.body.width = object.width;
            this.porteFinale.body.height = object.height;
        });

        // collisions
        this.physics.add.collider(this.player, this.porteFinale, this.disablePorteFinale, null, this);

        this.fin = this.physics.add.staticSprite(1048, 48, 'porteFinale').setAlpha(0);

        this.physics.add.overlap(this.player, this.fin, () => {
            if (this.gameOver == false) {
                this.commandesLocked = true;
                this.player.setVelocity(0);
                this.player.setAccelerationX(0);
                this.cameras.main.fadeOut(1500, 255, 255, 255)
                this.gameOver = true;

                this.time.delayedCall(1500, () => {
                    this.scene.start("GameOver", {
                        esprits : this.espritScore
                    });
                
                }, [], this);

            }
        }, null, this);


        //ESPRITS
        //récupération
        this.esprits = this.physics.add.staticGroup();
        this.espritsLayer = carteDuNiveau.getObjectLayer('espritsLayer')['objects'];

        // creation
        this.espritsLayer.forEach(object => {
            let obj = this.esprits.create(object.x + 16, object.y - 16, 'espritCollectible');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.esprits, this.collectEsprits, null, this);

        // POWER UP - DOUBLE JUMP

        //récupération
        this.powerUp = this.physics.add.staticGroup();
        this.powerUpLayer = carteDuNiveau.getObjectLayer('powerUpLayer')['objects'];

        // creation
        this.powerUpLayer.forEach(object => {
            let obj = this.powerUp.create(object.x + 16, object.y - 16, 'powerUpImage');
            obj.setScale(object.width / 32, object.height / 32);
            obj.body.width = object.width;
            obj.body.height = object.height;
        });

        // collisions
        this.physics.add.overlap(this.player, this.powerUp, this.unlockDoubleJump, null, this);

        // UI
        // LIFE
        this.lifeUI = this.add.sprite(90, 50, 'lifeFull').setOrigin(0, 0).setScrollFactor(0).setScale(0.8);

        // SCORE ESPRITS

        //IMAGE ESPRITS
        this.espritUi = this.add.sprite(470, 70, 'espritUI').setOrigin(0, 0).setScrollFactor(0).setScale(0.8);

        //NOMBRE D'ESPRITS
        this.fondScore = this.add.sprite(420, 50, 'fond_score').setOrigin(0, 0).setScrollFactor(0).setScale(0.6);
        this.textScore = this.add.text(447, 84, `${this.espritScore}`, { font: '16px MorrisRomanBlack', fill: '#FFFFFF' }).setOrigin(0, 0).setScrollFactor(0);

        // SCORE CLEF

        // IMAGE CLEF
        this.clefUI = this.add.sprite(475, 110, 'clefUI').setOrigin(0, 0).setScrollFactor(0).setVisible(false).setScale(0.6);

        //NOMBRE D'ESPRITS
        this.fondClefScore = this.add.sprite(420, 84, 'fond_score').setOrigin(0, 0).setScrollFactor(0).setVisible(false).setScale(0.6);
        this.textclefScore = this.add.text(442, 120, `${this.clefScore}/2`, { font: '10px MorrisRomanBlack', fill: '#FFFFFF' }).setOrigin(0, 0).setScrollFactor(0).setVisible(false);

        // COMMANDES

        // CLAVIER
        // DEPLACEMENTS FLECHES DIRECTIONNELLES
        this.cursors = this.input.keyboard.createCursorKeys();

        // DEPLACEMENT HORIZONTAUX - D et Q
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // INTERACTION
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // SAUT (BARRE D'ESPACE)
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // WALL GRAP (SHIFT)
        this.keyWallGrap = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // MANETTE
        this.input.gamepad.once('connected', function (pad) {
            this.controller = pad;
        });

        // LIMITES DU NIVEAU

        // LIMITES DU NIVEAU VIA DIMENSIONS
        this.physics.world.setBounds(0, 0, 1600, 1600);

        // PLAYER - Collision entre le joueur et les limites du niveau
        this.player.setCollideWorldBounds(true);

        // CAMERA

        // LIMITES CAMERA (champs de la caméra de taille identique à celle du niveau)
        this.cameras.main.setBounds(0, 0, 1600, 1600).setSize(600, 400).fadeIn(1500, 0, 0, 0) // fondu au noir

        // ANCRAGE CAMERA - JOUEUR
        this.cameras.main.startFollow(this.player);

        // CAMERA - Zoom de la camera (RETIRE CAR CREE DES STRIES PARASITES ENTRE LES TILES -> PAS BON POUR LE RENDU DE 2D)
        this.cameras.main.setZoom(1.5, 1.5);

        this.listTutoKill = ["Jump on the head", "of Corrupt Souls", "to eliminate them"]
        this.listTutoBonus = ["Catch souls to get cured", "when you need some heal"]

        this.tutoJump = this.add.text(1440, 592, "Press Space to Jump", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(-1);
        this.tutoGrab = this.add.text(1424, 880, "Press Shift to Grab walls", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(-1);
        this.tutoKill = this.add.text(848, 720, this.listTutoKill, { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(-1);
        this.tutoGetSoul = this.add.text(992, 1168, this.listTutoBonus, { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(-1);

        // ----------------------------------------------------- FIN FONCTION CREATE ----------------------------------------------
    }

    //FONCTION UPDATE - s'exécute à chaque frame du jeu
    update() {
        this.picsRetractablesAnim();
        this.movementPlayer();
        //NE FONCTIONNE PAS -> respawn();
    }

    // --------------------------------- FONCTIONS ---------------------------------

    // CARACTERISTIQUES DES PLATEFORMES

    //PLATEFORMES NORMALES (grotte et donjon)
    normalPlatsProperties() {
        this.speedMoveX = 150; // Vitesse classique
        this.speedMoveY = 290; // hauteur de saut
        this.playerInertie = 0; // aucune inertie
        this.wallNeige = false;
        this.wallIce = false;
    }

    // PLATEFORMES NEIGE (ralentissement)
    neigePlatsProperties() {
        this.speedMoveX = 100; // Vitesse ralentie
        this.speedMoveY = 290; // hauteur de saut
        this.playerInertie = 0; // aucune inertie
        this.wallNeige = true; // on glisse le lond des parois
        this.wallIce = false;
    }

    // PLATEFORMES GLACE (inertie et wallgrab glissant)
    glacePlatsProperties() {
        this.speedMoveX = 150; // Vitesse classique
        this.speedMoveY = 290; // hauteur de saut
        this.playerInertie = 3000; // inertie
        this.wallNeige = false;
        this.wallIce = true; // impossibilité de wall jump
    }

    // Déverouillage des commandes
    unlockCommandes() { this.commandesLocked = false; }

    // CAPACITES DU JOUEUR AU SOL
    onFloorProperties() {

        if (this.player.body.onFloor() && this.gameOver == false) { // si le joueur est au sol
            this.wallJumpLocked = true; //on ne peut pas walljump à partir du sol
            this.unlockCommandes(); // on débloque les commandes

            if (this.wallIce == false) { // si pas de glace
                // Coupe l'inertie du saut
                this.player.setAccelerationX(this.playerInertie);
            }
        }

        else {
            this.wallJumpLocked = false; // si le joueur n'est pas au sol : wall jump débloqué
        }
    }

    // DEPLACEMENTS DU PLAYER
    movementPlayer() {

        // Verification continue que le joueur est au sol ou à l'air. Débloquage de capacités en conséquent
        this.onFloorProperties();

        // DEPLACEMENT - GAUCHE
        if ((this.cursors.left.isDown || this.keyQ.isDown || this.controller.left) && this.commandesLocked == false) { //si la touche gauche est appuyée
            this.player.setVelocityX(-this.speedMoveX); //alors vitesse négative en X

            if (this.player.body.onFloor()) { // si joueur au sol
                this.player.anims.play('runLeft', true); //animation marche gauche
                this.player.setAccelerationX(-this.playerInertie); // inertie si glace, sinon 0
            }

            else if (!this.player.body.onFloor()) {
                this.player.anims.play('jumpLeft', true);
            }
        }

        // DEPLACEMENT - DROITE
        else if ((this.cursors.right.isDown || this.keyD.isDown || this.controller.right) && this.commandesLocked == false) { //sinon si la touche droite est appuyée
            this.player.setVelocityX(this.speedMoveX); //alors vitesse positive en X

            if (this.player.body.onFloor()) { // si joueur au sol
                this.player.anims.play('runRight', true); //animation marche droite
                this.player.setAccelerationX(this.playerInertie); // inertie si glace, sinon 0
            }
            else if (!this.player.body.onFloor()) {
                this.player.anims.play('jumpRight', true);
            }
        }

        // IDLE
        else {
            this.player.setVelocityX(0); //vitesse nulle
            if (this.player.body.velocity.x == 0) {
                this.player.anims.play('turn'); //animation idle
            }
        }

        // DEPLACEMENT - SAUT

        if ((this.cursors.up.isDown || this.spaceBar.isDown || this.controller.up || this.controller.A) && this.commandesLocked == false) {
            this.didPressJump = true; // autorise le jump normal

            if (this.didPressJump == true) {
                if (this.player.body.onFloor()) { // possibilité de sauter seulement depuis le sol

                    this.player.body.setVelocityY(-this.speedMoveY); // vitesseverticale négative 
                    this.player.setAccelerationX(0); // coupe l'inertie sur la glace

                    this.didPressJump = false; // bloque le jump normal (évite un double jump non autorisé, le onFloor ne suffit pas à empêcher ça)

                    setTimeout(() => {
                        if (this.doubleJumpAbility == true) {
                            this.canDoubleJump = true; // possibilité Double Jump
                        }
                    }, 500);

                } else if (this.canDoubleJump == true) {
                    // le perso peut double jump
                    this.canDoubleJump = false;
                    this.player.body.setVelocityY(-this.speedMoveY);
                }
            }
        }

        // WALL JUMP

        // WALL JUMP GAUCHE
        if (this.player.body.blocked.left && (this.keyWallGrap.isDown || this.controller.R2 || this.controller.L2) && this.wallJumpLocked == false) {

            if (this.wallNeige == true) { // si neige : on glisse le long du mur
                this.player.setVelocityY(20);
                this.player.setVelocityX(0);
            }
            else if ((this.wallNeige == false) && (this.wallIce == false)) { // si normal : on reste accroché au mur
                this.player.setVelocityY(-12);
                this.player.setVelocityX(-2);
            }

            if ((this.cursors.up.isDown || this.spaceBar.isDown || this.controller.up || this.controller.A) && (this.wallIce == false)) { // SAUT => on se repousse du mur
                // commandes bloquées
                this.commandesLocked = true;

                this.player.setAccelerationX(0); // reset l'accélération à 0

                this.player.setAccelerationX(4000);
                this.player.setMaxVelocity(1000);
                this.player.setVelocityY(-this.speedMoveY);

                // commandes débloquées
                setTimeout(() => {
                    this.commandesLocked = false;
                    this.player.setAccelerationX(0);
                }, 2000);
            }
        }

        // WALL JUMP DROIT
        if (this.player.body.blocked.right && (this.keyWallGrap.isDown || this.controller.R2 || this.controller.L2) && this.wallJumpLocked == false) {

            if (this.wallNeige == true) { // si neige : on glisse le long du mur
                this.player.setVelocityY(20);
                this.player.setVelocityX(0);
            }
            else if ((this.wallNeige == false) && (this.wallIce == false)) { // si normal : on reste accroché au mur
                this.player.setVelocityY(-12);
                this.player.setVelocityX(2);
            }

            if ((this.cursors.up.isDown || this.spaceBar.isDown || this.controller.up || this.controller.A) && (this.wallIce == false)) { // SAUT => on se repousse du mur
                // commandes bloquées
                this.commandesLocked = true;

                this.player.setAccelerationX(0); // reset l'accélération à 0

                this.player.setAccelerationX(-4000);
                this.player.setMaxVelocity(1000);
                this.player.setVelocityY(-this.speedMoveY);

                // commandes débloquées
                setTimeout(() => {
                    this.commandesLocked = false;
                    this.player.setAccelerationX(0);
                }, 2000);
            }
        }
    }

    //COLLECTES DE PICK UP OBJECTS

    // COLLECTE ESPRIT
    collectEsprits(player, esprit) {
        esprit.destroy(esprit.x, esprit.y); // détruit l'esprit collecté
        this.espritScore++; // incrémente le score
        this.textScore.setText(`${this.espritScore}`); // montre le score actuel

        if (this.health < 4) {
            this.health++;
            this.gestionLife(); // change l'UI de vie
        }
    }

    // COLLECTE POWER UP
    unlockDoubleJump(player, powerUp) { // au contact du joueur
        this.doubleJumpAbility = true; // activation de la capacité double jump

        this.tutoJump = this.add.text(powerUp.x - 96, powerUp.y - 32, "You can now Double Jump", { font: '20px MorrisRomanBlack', fill: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(-1);

        powerUp.destroy(powerUp.x, powerUp.y); // détruit l'objet
    }

    // CLEF PORTE FINALE

    // SCORE CLEF

    // COLLECTE CLEFS
    collectClefs(player, clef) {
        clef.destroy(clef.x, clef.y); // détruit la clé collectée
        this.clefScore++; // incrémente le score

        // affiche l'UI
        this.clefUI.setVisible(true);
        this.textclefScore.setVisible(true);
        this.fondClefScore.setVisible(true);

        this.textclefScore.setText(`${this.clefScore}/2`); // montre le score actuel
    }

    // OUVERTURE PORTE FINALE
    disablePorteFinale(player, porteFinale) { // au contact du joueur
        if (this.clefScore == 2) { // si le joueur possede 2 clefs
            porteFinale.destroy(); // detruit la porte

            // affiche l'UI
            this.clefUI.setVisible(false);
            this.textclefScore.setVisible(false);
            this.fondClefScore.setVisible(false);
        }
    }

    // PORTES ET BOUTON (DONJON)

    // BOUTON ROSE

    // ACTIVATION BOUTON ROSE
    pressBoutonRose(player, boutonRose) { // au contact du joueur

        this.tweens.add({
            targets: this.textBoutonRose,
            alpha: 1,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        if (this.cursors.down.isDown || this.keyE.isDown || this.controller.B) { // si le joueur presse le bouton
            this.porteRoseDisable = true; // désactivation de la porte rose
            this.porteRose.setActive(false).setVisible(false); // porte rose = plus active et plus visible

            this.tweens.add({
                targets: boutonRose,
                alpha: 0,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });            
        }
    }

    // DESACTIVATION PORTE ROSE
    disablePorteRose(player, porteRose) { // au contact du joueur
        if (this.porteRoseDisable == true) { // si le bouton rose a été pressé
            porteRose.destroy(); // l'objet est détruit
        }
    }

    // BOUTON VERT

    // ACTIVATION BOUTON VERT (même logique)
    pressBoutonVert(player, boutonVert) {

        this.tweens.add({
            targets: this.textBoutonVert,
            alpha: 1,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        if (this.cursors.down.isDown || this.keyE.isDown || this.controller.B) {
            this.porteVertDisable = true;
            this.porteVert.setActive(false).setVisible(false);

            this.tweens.add({
                targets: boutonVert,
                alpha: 0,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });       
        }
    }

    // DESACTIVATION PORTE VERTE (même logique)
    disablePorteVert(player, porteVert) {
        if (this.porteVertDisable == true) {
            porteVert.destroy();
        }
    }

    // OBSTACLES DONJON

    // ANIMATION DES PICS RETRACTABLES (DONJON)

    picsRetractablesAnim() {
        if (this.picsRetractOn == false) {
            this.retractPicsBasOff.setActive(true).setVisible(true); // inoffensif ON
            this.retractPicsBas.setActive(false).setVisible(false); // mortel OFF

            this.retractPicsDroiteOff.setActive(true).setVisible(true); // inoffensif ON
            this.retractPicsDroite.setActive(false).setVisible(false); // mortel OFF

            setTimeout(() => { //après 2 sec, switch les états des pics
                this.picsRetractOn = true;
            }, 2000);
        }

        if (this.picsRetractOn == true) {
            this.retractPicsBasOff.setActive(false).setVisible(false); // inoffensif OFF
            this.retractPicsBas.setActive(true).setVisible(true); // mortel ON

            this.retractPicsDroiteOff.setActive(false).setVisible(false); // inoffensif OFF
            this.retractPicsDroite.setActive(true).setVisible(true); // mortel ON

            setTimeout(() => { //après 2 sec, switch les états des pics
                this.picsRetractOn = false;
            }, 2000);
        }
    }

    // PICS RETRACTABLES TUE JOUEUR
    picsRetractablesKill(player, retractPicsBas) {
        if (this.picsRetractOn == true) { // si mortel ON => tue le joueur au contact
            this.spikeHit();
        }
    }

    // OBSTACLES MONTAGNE

    // CASES GLACE FRAGILES
    destructionGlace(player, platsGlaceFragile) {
        this.speedMoveX = 150;
        this.speedMoveY = 280;
        this.playerInertie = 3000;
        this.wallNeige = true;
        setTimeout(() => {
            platsGlaceFragile.destroy();
        }, 1000);
    }

    destroyPicGlace(pics) {
        pics.destroy();
    }

    // MONSTRES

    // POUR LES MONSTRES TOURNES A GAUCHE
    toucheMob(player, monstresLeft) { // au contact du joueur
        if (player.body.touching.right || player.body.touching.left || player.body.touching.up) { // si touché sur les côtés
            if (this.invincibleOn == false) { // verifie que player n'est pas invulnérable
                this.health -= 1; // enlève 1 PV
                this.cameras.main.shake(100, 0.02, false, null); // mouvement de caméra pour blessure
                this.gestionLife(); // change l'UI de vie

                this.invincible(); // active la frame d'invulnérabilité
                setTimeout(() => { this.finInvicible() }, 700); // stop la frame d'invulnérabilité à 0.7 sec 
            }
        }
        else if (player.body.touching.down && !player.body.touching.right && !player.body.touching.left && !player.body.touching.up && monstresLeft.body.touching.up) { // si touché depuis le haut
            monstresLeft.disableBody(true, true); // détruit le monstre
            player.setVelocityY(-this.speedMoveY); // rebond du joueur
        }
    }

    // INVINCIBILITE SI TOUCHE MONSTRE

    // REND INVINCIBLE
    invincible() {
        this.invincibleOn = true;

        // animation invincible
        this.playerInvisible();
    }

    // FIN INVINCIBLE
    finInvicible() {
        this.invincibleOn = false;
    }

    // ANIMATION - FRAME D'INVINCIBILITE

    // ANIMATION - FRAME D'INVINCIBILITE (PART 1 - INVISIBLE)
    playerInvisible() {
        this.player.visible = false;
        setTimeout(() => { this.playerVisible() }, 100);
    }

    // ANIMATION - FRAME D'INVINCIBILITE (PART 2 - VISIBLE)
    playerVisible() {
        if (this.frameInvincible < 3) { // tant que frameInvincible n'a pas dépassé 3, exécute
            this.player.visible = true;
            setTimeout(() => { this.playerInvisible() }, 100);
            this.frameInvincible += 1; // ajoute +1 jusqu'à 3 (durée de la frame d'invulnérabilité)
        }
        else {
            this.player.visible = true; // remet visible
            this.frameInvincible = 0; // remet à zéro
        }
    }

    spikeHit() {
        if (this.invincibleOn == false) { // verifie que player n'est pas invulnérable
            this.health -= 1; // enlève 1 PV
            this.cameras.main.shake(100, 0.02, false, null); // mouvement de caméra pour blessure
            this.gestionLife(); // change l'UI de vie

            this.invincible(); // active la frame d'invulnérabilité
            setTimeout(() => { this.finInvicible() }, 700); // stop la frame d'invulnérabilité à 0.7 sec 
        }
    }

    // Change l'interface et déclenche la mort si 0 PV
    gestionLife() {
        if (this.health == 4) {
            this.lifeUI.setTexture('lifeFull');
        }
        if (this.health == 3) {
            this.lifeUI.setTexture('life1');
        }
        if (this.health == 2) {
            this.lifeUI.setTexture('life2');
        }
        if (this.health == 1) {
            this.lifeUI.setTexture('life3');
        }
        if (this.health == 0) {
            this.lifeUI.setTexture('lifeDead');
            this.killPlayer(this.player);
        }
    }

    // MORT DU JOUEUR
    killPlayer(player) {
        this.gameOver = true;
        //player.setTint(0xff0000); //perso en rouge
        player.anims.play('turn'); // tourné vers nous
        this.lifeUI.setTexture('lifeDead'); // UI "mort"

        this.commandesLocked = true;

        player.disableBody(true);

        this.tweens.add({
            targets: player,
            alpha: 0,
            duration: 300,  // Durée de l'animation en millisecondes
            ease: 'Linear', // Fonction d'interpolation pour l'animation
        });

        setTimeout(() => {

            this.commandesLocked = false;

            player.x = this.spawnX;
            player.y = this.spawnY;

            player.enableBody()

            this.tweens.add({
                targets: player,
                alpha: 1,
                duration: 300,  // Durée de l'animation en millisecondes
                ease: 'Linear', // Fonction d'interpolation pour l'animation
            });

            this.espritScore -= 5;

            if (this.espritScore < 0) {
                this.espritScore = 0;
            }

            this.textScore.setText(`${this.espritScore}`); // montre le score actuel

            this.health = 4;
            this.lifeUI.setTexture('lifeFull');
        }, 1000);
    }

    // RESTART LE JEU (NE FONCTIONNE PAS)
    /*function respawn(){
        if (gameOver == true){
    
            setTimeout(function() {
                
                this.scene.restart();   
            }, 1000);
        }
    }*/

}

export default Level