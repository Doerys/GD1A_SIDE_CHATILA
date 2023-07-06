//

    <script type="text/javascript">

        var config = {
            type: Phaser.AUTO,

            // Dimensions de l'espace de la fenêtre alloué au jeu
            scale: {
                mode: Phaser.Scale.FIT,
                width: 600,
                height: 400
            },

            // Physique du jeu (gravité)
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 600 },
                    fps: 50,
                    debug: false
                }
            },

            input: { gamepad: true },
            scene: { preload: preload, create: create, update: update }
        };

        new Phaser.Game(config);

        // VARIABLES
        let player;

        let gameOver = false;

        let cursors; // commandes fleches directionnellements 

        let health = 4; // pv
        let frameInvincible = 0; // durée invincibilité
        let invincibleOn = false;

        let commandesLocked = false; // bloquage commandes déplacements
        let wallJumpLocked = false; // bloquage wall jump

        let esprits; // image esprits collectables
        let textScore; // texte de score
        let espritScore = 0; // nb esprits collectés

        let porteVertDisable = false; // bouton vert appuyé
        let porteRoseDisable = false; // bouton rose appuyé

        let clefUI;
        let clefScore = 0; // nb de clés récoltées
        let textclefScore; // texte de score clef

        let wallNeige = false; // contact tile neige
        let wallIce = false; // contact tile glace

        let doubleJumpAbility = true; // activation Double Jump
        let didPressJump = false; // pression bouton Jump
        let canDoubleJump = false; // possibilité Double Jump

        let picsRetractOn = false; // pattern des pics rétractables

        // 1 VARIABLE POUR CHAQUE PIC GLACE QUI TOMBE (SEULE SOLUTION POUR CONTOURNER UN BUG !)

        let chutePicGlace = false;
        let chutePicGlace2 = false;
        let chutePicGlace3 = false;
        let chutePicGlace4 = false;
        let chutePicGlace5 = false;
        let chutePicGlace6 = false;
        let chutePicGlace7 = false;
        let chutePicGlace8 = false;
        let chutePicGlace9 = false;
        let chutePicGlace10 = false;
        let chutePicGlace11 = false;
        let chutePicGlace12 = false;

        var controller = false; //controles manette

        // FONCTION CREATE - Gère le stade initial du jeu
        function create() {

            // ARRIERE PLAN
            // ARRIERE PLAN - BACKGROUND
            this.background = this.add.tileSprite(0, 0, 1600, 1600, "background");
            this.background.setOrigin(0, 0);

            // ARRIERE PLAN - SECOND PLAN
            this.sndPlan = this.add.tileSprite(0, 0, 1600, 1600, "secondPlan");
            this.sndPlan.setOrigin(0, 0);

            // ARRIERE PLAN - Second plan montagne (effet parallaxe)
            this.sndPlanParallax = this.add.tileSprite(0, 0, 1600, 1600, "secondPlanMontagne");
            this.sndPlanParallax.setOrigin(0, 0);
            this.sndPlanParallax.setScrollFactor(0.8, 1);

            // PLAYER

            player = this.physics.add.sprite(1350, 650, 'perso'); // SPAWN DEBUT BIOME CAVERNE (DEPART NORMAL)

            //player = this.physics.add.sprite(690, 1450, 'perso'); // SPAWN DEBUT BIOME DONJON

            //player = this.physics.add.sprite(462, 480, 'perso'); // SPAWN DEBUT BIOME MONTAGNE

            player.setSize(24, 48, true); // Taille hitbox personnage

            player.setOffset(4, 15); // placement hitbox personnage

            //TILED
            // TILEMAP    
            const carteDuNiveau = this.add.tilemap("carte");

            // TILESET
            const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu", "Phaser_tuilesdejeu",);

            // CALQUES OBJETS (PART 1)

            //OBSTACLES CAVERNE ET DONJON

            //CRISTAUX (CAVERNE)
            //récupération
            cristaux = this.physics.add.staticGroup();
            cristauxLayer = carteDuNiveau.getObjectLayer('cristauxLayer')['objects'];

            // creation
            cristauxLayer.forEach(object => {
                let obj = cristaux.create(object.x + 16, object.y - 10, 'cristauxImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, cristaux, killPlayer, null, this);

            // LAVE (DONJON)
            //récupération
            lave = this.physics.add.staticGroup();
            laveLayer = carteDuNiveau.getObjectLayer('laveLayer')['objects'];

            // creation
            laveLayer.forEach(object => {
                let obj = lave.create(object.x + 16, object.y - 10, 'laveImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, lave, killPlayer, null, this);

            //PICS NORMAUX (DONJON)

            // PICS BAS

            //récupération
            picsBas = this.physics.add.staticGroup();
            picsBasLayer = carteDuNiveau.getObjectLayer('picsBasLayer')['objects'];

            // creation
            picsBasLayer.forEach(object => {
                let obj = picsBas.create(object.x + 16, object.y - 16, 'picsBasImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsBas, killPlayer, null, this);

            // PICS HAUT

            //récupération
            picsHaut = this.physics.add.staticGroup();
            picsHautLayer = carteDuNiveau.getObjectLayer('picsHautLayer')['objects'];

            // creation
            picsHautLayer.forEach(object => {
                let obj = picsHaut.create(object.x + 16, object.y - 16, 'picsHautImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsHaut, killPlayer, null, this);

            // PICS DROITE

            //récupération
            picsDroite = this.physics.add.staticGroup();
            picsDroiteLayer = carteDuNiveau.getObjectLayer('picsDroiteLayer')['objects'];

            // creation
            picsDroiteLayer.forEach(object => {
                let obj = picsDroite.create(object.x + 16, object.y - 16, 'picsDroiteImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsDroite, killPlayer, null, this);

            // PICS GAUCHE

            //récupération
            picsGauche = this.physics.add.staticGroup();
            picsGaucheLayer = carteDuNiveau.getObjectLayer('picsGaucheLayer')['objects'];

            // creation
            picsGaucheLayer.forEach(object => {
                let obj = picsGauche.create(object.x + 16, object.y - 16, 'picsGaucheImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsGauche, killPlayer, null, this);

            // PICS RETRACTABLES (DONJON)

            // PICS RETRACTABLES BAS

            // OFF
            //récupération
            retractPicsBasOff = this.physics.add.staticGroup();
            retractPicsBasOffLayer = carteDuNiveau.getObjectLayer('retractPicsBasOffLayer')['objects'];
            // creation
            retractPicsBasOffLayer.forEach(object => {
                let obj = retractPicsBasOff.create(object.x + 16, object.y - 7, 'retractPicsBasOff');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // ON
            //récupération
            retractPicsBas = this.physics.add.staticGroup();
            retractPicsBasLayer = carteDuNiveau.getObjectLayer('retractPicsBasLayer')['objects'];
            // creation
            retractPicsBasLayer.forEach(object => {
                let obj = retractPicsBas.create(object.x + 16, object.y - 16, 'retractPicsBasOn');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });
            // collisions
            this.physics.add.overlap(player, retractPicsBas, picsRetractablesKill, null, this);

            // PICS RETRACTABLES DROITE

            // OFF
            //récupération
            retractPicsDroiteOff = this.physics.add.staticGroup();
            retractPicsDroiteOffLayer = carteDuNiveau.getObjectLayer('retractPicsDroiteOffLayer')['objects'];
            // creation
            retractPicsDroiteOffLayer.forEach(object => {
                let obj = retractPicsDroiteOff.create(object.x + 24, object.y - 16, 'retractPicsDroiteOff');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // ON
            //récupération
            retractPicsDroite = this.physics.add.staticGroup();
            retractPicsDroiteLayer = carteDuNiveau.getObjectLayer('retractPicsDroiteLayer')['objects'];
            // creation
            retractPicsDroiteLayer.forEach(object => {
                let obj = retractPicsDroite.create(object.x + 16, object.y - 16, 'retractPicsDroiteOn');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });
            // collisions
            this.physics.add.overlap(player, retractPicsDroite, picsRetractablesKill, null, this);

            // PICS RETRACTABLES GAUCHE

            // OFF
            //récupération
            retractPicsGaucheOff = this.physics.add.staticGroup();
            retractPicsGaucheOffLayer = carteDuNiveau.getObjectLayer('retractPicsGaucheOffLayer')['objects'];
            // creation
            retractPicsGaucheOffLayer.forEach(object => {
                let obj = retractPicsGaucheOff.create(object.x + 7, object.y - 16, 'retractPicsGaucheOff');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // ON
            //récupération
            retractPicsGauche = this.physics.add.staticGroup();
            retractPicsGaucheLayer = carteDuNiveau.getObjectLayer('retractPicsGaucheLayer')['objects'];
            // creation
            retractPicsGaucheLayer.forEach(object => {
                let obj = retractPicsDroite.create(object.x + 16, object.y - 16, 'retractPicsGaucheOn');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });
            // collisions
            this.physics.add.overlap(player, retractPicsGauche, picsRetractablesKill, null, this);

            // PICS GLACE (MONTAGNE)

            // PICS GLACE BAS

            //récupération
            picsGlaceBas = this.physics.add.staticGroup();
            picsGlaceBasLayer = carteDuNiveau.getObjectLayer('picsGlaceBasLayer')['objects'];

            // creation
            picsGlaceBasLayer.forEach(object => {
                let obj = picsGlaceBas.create(object.x + 16, object.y - 10, 'picsGlaceBasImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsGlaceBas, killPlayer, null, this);

            // PICS GLACE DROITE

            //récupération
            picsGlaceDroite = this.physics.add.staticGroup();
            picsGlaceDroiteLayer = carteDuNiveau.getObjectLayer('picsGlaceDroiteLayer')['objects'];

            // creation
            picsGlaceDroiteLayer.forEach(object => {
                let obj = picsGlaceDroite.create(object.x + 22, object.y - 16, 'picsGlaceDroiteImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsGlaceDroite, killPlayer, null, this);

            // PICS GLACE GAUCHE

            //récupération
            picsGlaceGauche = this.physics.add.staticGroup();
            picsGlaceGaucheLayer = carteDuNiveau.getObjectLayer('picsGlaceGaucheLayer')['objects'];

            // creation
            picsGlaceGaucheLayer.forEach(object => {
                let obj = picsGlaceGauche.create(object.x + 10, object.y - 16, 'picsGlaceGaucheImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, picsGlaceGauche, killPlayer, null, this);

            // CALQUES TILESET
            // PLATEFORMES NORMALES
            const plateformes = carteDuNiveau.createLayer("plateformes", tileset);
            // collisions
            plateformes.setCollisionByProperty({ estSolide: true });
            this.physics.add.collider(player, plateformes, normalPlatsProperties, null, this);

            // PLATEFORMES NEIGE
            const plateformesNeige = carteDuNiveau.createLayer("plateformesNeige", tileset);
            // collisions
            plateformesNeige.setCollisionByProperty({ estNeige: true });
            this.physics.add.collider(player, plateformesNeige, neigePlatsProperties, null, this);

            // PLATEFORMES GLACE __
            const plateformesGlace = carteDuNiveau.createLayer("plateformesGlace", tileset);
            // collisions
            plateformesGlace.setCollisionByProperty({ estGlace: true });
            this.physics.add.collider(player, plateformesGlace, glacePlatsProperties, null, this);

            // CALQUES OBJETS (PART 2)

            //OBSTACLES MONTAGNE

            // PLATEFORMES GLACE FRAGILES (MONTAGNE)

            //récupération
            platsGlaceFragile = this.physics.add.staticGroup();
            platsGlaceFragileLayer = carteDuNiveau.getObjectLayer('platsGlaceFragileLayer')['objects'];

            // creation
            platsGlaceFragileLayer.forEach(object => {
                let obj = platsGlaceFragile.create(object.x + 16, object.y - 16, 'glaceFragileImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.collider(player, platsGlaceFragile, destructionGlace, null, this);

            // ---------------------------------- ZONE TRIGGER PICS GLACE HAUTS (1 CALQUE OBJET PAR TRIGGER, SEULE FACON DE CONTOURNER UN BUG) ----------------------------

            // TRIGGER PICS GLACE HAUT 1

            // récupération
            triggerPicsGlace1 = this.physics.add.staticGroup(); triggerPicsGlaceLayer1 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer1')['objects'];

            //creation
            triggerPicsGlaceLayer1.forEach(object => { let obj = triggerPicsGlace1.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            //collisions
            this.physics.add.overlap(player, triggerPicsGlace1, detectTrigger, null, this);

            // TRIGGER PICS GLACE HAUT2

            //récupération
            triggerPicsGlace2 = this.physics.add.staticGroup(); triggerPicsGlaceLayer2 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer2')['objects'];

            // creation
            triggerPicsGlaceLayer2.forEach(object => { let obj = triggerPicsGlace2.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace2, detectTrigger2, null, this);


            // TRIGGER PICS GLACE HAUT3

            //récupération
            triggerPicsGlace3 = this.physics.add.staticGroup(); triggerPicsGlaceLayer3 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer3')['objects'];

            // creation
            triggerPicsGlaceLayer3.forEach(object => { let obj = triggerPicsGlace3.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace3, detectTrigger3, null, this);

            // TRIGGER PICS GLACE HAUT4

            //récupération
            triggerPicsGlace4 = this.physics.add.staticGroup(); triggerPicsGlaceLayer4 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer4')['objects'];

            // creation
            triggerPicsGlaceLayer4.forEach(object => { let obj = triggerPicsGlace4.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace4, detectTrigger4, null, this);

            // TRIGGER PICS GLACE HAUT5

            //récupération
            triggerPicsGlace5 = this.physics.add.staticGroup(); triggerPicsGlaceLayer5 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer5')['objects'];

            // creation
            triggerPicsGlaceLayer5.forEach(object => { let obj = triggerPicsGlace5.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace5, detectTrigger5, null, this);

            // TRIGGER PICS GLACE HAUT6

            //récupération
            triggerPicsGlace6 = this.physics.add.staticGroup(); triggerPicsGlaceLayer6 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer6')['objects'];

            // creation
            triggerPicsGlaceLayer6.forEach(object => { let obj = triggerPicsGlace6.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace6, detectTrigger6, null, this);

            // TRIGGER PICS GLACE HAUT7

            //récupération
            triggerPicsGlace7 = this.physics.add.staticGroup(); triggerPicsGlaceLayer7 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer7')['objects'];

            // creation
            triggerPicsGlaceLayer7.forEach(object => { let obj = triggerPicsGlace7.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace7, detectTrigger7, null, this);

            // TRIGGER PICS GLACE HAUT8

            //récupération
            triggerPicsGlace8 = this.physics.add.staticGroup(); triggerPicsGlaceLayer8 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer8')['objects'];

            // creation
            triggerPicsGlaceLayer8.forEach(object => { let obj = triggerPicsGlace8.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace8, detectTrigger8, null, this);

            // TRIGGER PICS GLACE HAUT9

            //récupération
            triggerPicsGlace9 = this.physics.add.staticGroup(); triggerPicsGlaceLayer9 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer9')['objects'];

            // creation
            triggerPicsGlaceLayer9.forEach(object => { let obj = triggerPicsGlace9.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace9, detectTrigger9, null, this);

            // TRIGGER PICS GLACE HAUT10

            //récupération
            triggerPicsGlace10 = this.physics.add.staticGroup(); triggerPicsGlaceLayer10 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer10')['objects'];

            // creation
            triggerPicsGlaceLayer10.forEach(object => { let obj = triggerPicsGlace10.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace10, detectTrigger10, null, this);

            // TRIGGER PICS GLACE HAUT11

            //récupération
            triggerPicsGlace11 = this.physics.add.staticGroup(); triggerPicsGlaceLayer11 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer11')['objects'];

            // creation
            triggerPicsGlaceLayer11.forEach(object => { let obj = triggerPicsGlace11.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace11, detectTrigger11, null, this);

            // TRIGGER PICS GLACE HAUT12

            //récupération
            triggerPicsGlace12 = this.physics.add.staticGroup(); triggerPicsGlaceLayer12 = carteDuNiveau.getObjectLayer('triggerPicsGlaceLayer12')['objects'];

            // creation
            triggerPicsGlaceLayer12.forEach(object => { let obj = triggerPicsGlace12.create(object.x + 16, object.y + 16).setVisible(false); obj.setScale(object.width / 32, object.height / 32); obj.body.width = object.width; obj.body.height = object.height; });

            // collisions
            this.physics.add.overlap(player, triggerPicsGlace12, detectTrigger12, null, this);


            // --------------------------------- FIN DES TRIGGERS ------------------------------

            // ---------------------------------- PICS GLACE HAUT (QUI TOMBE) (1 CALQUE OBJET PAR PIC, SEULE FACON DE CONTOURNER UN BUG) ----------------------------  
            // PICS GLACE HAUT (QUI TOMBE) 1

            //récupération
            picsGlaceHaut = this.physics.add.group();
            picsGlaceHautLayer1 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer1');

            // creation
            picsGlaceHautLayer1.objects.forEach(picsGlaceHautLayer1 => {
                const PicsGlaceHautLayer = picsGlaceHaut.create(picsGlaceHautLayer1.x + 16, picsGlaceHautLayer1.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace1, picsGlaceHaut, physicAllowPicGlace, null, this);
            this.physics.add.overlap(player, picsGlaceHaut, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 2

            //récupération
            picsGlaceHaut2 = this.physics.add.group();
            picsGlaceHautLayer2 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer2');

            // creation
            picsGlaceHautLayer2.objects.forEach(picsGlaceHautLayer2 => {
                const PicsGlaceHautLayer2 = picsGlaceHaut2.create(picsGlaceHautLayer2.x + 16, picsGlaceHautLayer2.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace2, picsGlaceHaut2, physicAllowPicGlace2, null, this);
            this.physics.add.overlap(player, picsGlaceHaut2, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut2, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut2, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut2, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 3

            //récupération
            picsGlaceHaut3 = this.physics.add.group();
            picsGlaceHautLayer3 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer3');

            // creation
            picsGlaceHautLayer3.objects.forEach(picsGlaceHautLayer3 => {
                const PicsGlaceHautLayer3 = picsGlaceHaut3.create(picsGlaceHautLayer3.x + 16, picsGlaceHautLayer3.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace3, picsGlaceHaut3, physicAllowPicGlace3, null, this);
            this.physics.add.overlap(player, picsGlaceHaut3, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut3, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut3, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut3, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 4

            //récupération
            picsGlaceHaut4 = this.physics.add.group();
            picsGlaceHautLayer4 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer4');

            // creation
            picsGlaceHautLayer4.objects.forEach(picsGlaceHautLayer4 => {
                const PicsGlaceHautLayer4 = picsGlaceHaut4.create(picsGlaceHautLayer4.x + 16, picsGlaceHautLayer4.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace4, picsGlaceHaut4, physicAllowPicGlace4, null, this);
            this.physics.add.overlap(player, picsGlaceHaut4, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut4, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut4, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut4, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 5

            //récupération
            picsGlaceHaut5 = this.physics.add.group();
            picsGlaceHautLayer5 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer5');

            // creation
            picsGlaceHautLayer5.objects.forEach(picsGlaceHautLayer5 => {
                const PicsGlaceHautLayer5 = picsGlaceHaut5.create(picsGlaceHautLayer5.x + 16, picsGlaceHautLayer5.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace5, picsGlaceHaut5, physicAllowPicGlace5, null, this);
            this.physics.add.overlap(player, picsGlaceHaut5, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut5, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut5, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut5, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 6

            //récupération
            picsGlaceHaut6 = this.physics.add.group();
            picsGlaceHautLayer6 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer6');

            // creation
            picsGlaceHautLayer6.objects.forEach(picsGlaceHautLayer6 => {
                const PicsGlaceHautLayer6 = picsGlaceHaut6.create(picsGlaceHautLayer6.x + 16, picsGlaceHautLayer6.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace6, picsGlaceHaut6, physicAllowPicGlace6, null, this);
            this.physics.add.overlap(player, picsGlaceHaut6, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut6, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut6, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut6, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 7

            //récupération
            picsGlaceHaut7 = this.physics.add.group();
            picsGlaceHautLayer7 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer7');

            // creation
            picsGlaceHautLayer7.objects.forEach(picsGlaceHautLayer7 => {
                const PicsGlaceHautLayer7 = picsGlaceHaut7.create(picsGlaceHautLayer7.x + 16, picsGlaceHautLayer7.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace7, picsGlaceHaut7, physicAllowPicGlace7, null, this);
            this.physics.add.overlap(player, picsGlaceHaut7, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut7, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut7, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut7, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 8

            //récupération
            picsGlaceHaut8 = this.physics.add.group();
            picsGlaceHautLayer8 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer8');

            // creation
            picsGlaceHautLayer8.objects.forEach(picsGlaceHautLayer8 => {
                const PicsGlaceHautLayer8 = picsGlaceHaut8.create(picsGlaceHautLayer8.x + 16, picsGlaceHautLayer8.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace8, picsGlaceHaut8, physicAllowPicGlace8, null, this);
            this.physics.add.overlap(player, picsGlaceHaut8, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut8, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut8, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut8, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 9

            //récupération
            picsGlaceHaut9 = this.physics.add.group();
            picsGlaceHautLayer9 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer9');

            // creation
            picsGlaceHautLayer9.objects.forEach(picsGlaceHautLayer9 => {
                const PicsGlaceHautLayer9 = picsGlaceHaut9.create(picsGlaceHautLayer9.x + 16, picsGlaceHautLayer9.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace9, picsGlaceHaut9, physicAllowPicGlace9, null, this);
            this.physics.add.overlap(player, picsGlaceHaut9, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut9, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut9, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut9, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 10

            //récupération
            picsGlaceHaut10 = this.physics.add.group();
            picsGlaceHautLayer10 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer10');

            // creation
            picsGlaceHautLayer10.objects.forEach(picsGlaceHautLayer10 => {
                const PicsGlaceHautLayer10 = picsGlaceHaut10.create(picsGlaceHautLayer10.x + 16, picsGlaceHautLayer10.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace10, picsGlaceHaut10, physicAllowPicGlace10, null, this);
            this.physics.add.overlap(player, picsGlaceHaut10, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut10, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut10, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut10, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 11

            //récupération
            picsGlaceHaut11 = this.physics.add.group();
            picsGlaceHautLayer11 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer11');

            // creation
            picsGlaceHautLayer11.objects.forEach(picsGlaceHautLayer11 => {
                const PicsGlaceHautLayer11 = picsGlaceHaut11.create(picsGlaceHautLayer11.x + 16, picsGlaceHautLayer11.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace11, picsGlaceHaut11, physicAllowPicGlace11, null, this);
            this.physics.add.overlap(player, picsGlaceHaut11, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut11, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut11, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut11, destroyPicGlace, null, this);

            // PICS GLACE HAUT (QUI TOMBE) 12

            //récupération
            picsGlaceHaut12 = this.physics.add.group();
            picsGlaceHautLayer12 = carteDuNiveau.getObjectLayer('picsGlaceHautLayer12');

            // creation
            picsGlaceHautLayer12.objects.forEach(picsGlaceHautLayer12 => {
                const PicsGlaceHautLayer12 = picsGlaceHaut12.create(picsGlaceHautLayer12.x + 16, picsGlaceHautLayer12.y - 16, "picsGlaceHautImage").body.setAllowGravity(false);
            });

            // collisions
            this.physics.add.overlap(triggerPicsGlace12, picsGlaceHaut12, physicAllowPicGlace12, null, this);
            this.physics.add.overlap(player, picsGlaceHaut12, killPlayer, null, this);
            this.physics.add.collider(plateformesNeige, picsGlaceHaut12, destroyPicGlace, null, this);
            this.physics.add.collider(plateformesGlace, picsGlaceHaut12, destroyPicGlace, null, this);
            this.physics.add.collider(platsGlaceFragile, picsGlaceHaut12, destroyPicGlace, null, this);

            // --------------------------------- FIN DES PICS QUI TOMBENT ------------------------------

            //MOBS 
            // MONSTRES VERS DROITE
            // récupération
            monstresRight = this.physics.add.group();
            monstresRightLayer = carteDuNiveau.getObjectLayer('monstresRightLayer');

            // creation
            monstresRightLayer.objects.forEach(monstresRightLayer => {
                const MmonstresRightLayer = monstresRight.create(monstresRightLayer.x + 16, monstresRightLayer.y + 16, "monsterRightApparence").body.setAllowGravity(false).setBounce(1);
            });
            monstresRight.setVelocity(0, 100);

            // collisions
            this.physics.add.overlap(player, monstresRight, toucheMobDroite, null, this);

            //BORDURES MONSTRES RIGHT (délimitant les déplacements des Ennemis de droite)
            // récupération
            limitesMonstresRight = this.physics.add.group();
            limitesMonstresRightLayer = carteDuNiveau.getObjectLayer('limitesMonstresRightLayer');

            // création
            limitesMonstresRightLayer.objects.forEach(limitesMonstresRightLayer => {
                const LimitesMonstresRightLayer = limitesMonstresRight.create(limitesMonstresRightLayer.x + 16, limitesMonstresRightLayer.y + 16).setVisible(false).body.setAllowGravity(false).setImmovable(true);
            });

            // collisions
            this.physics.add.collider(monstresRight, limitesMonstresRight);

            //MONSTRES VERS GAUCHE
            // récupération
            monstresLeft = this.physics.add.group();
            monstresLeftLayer = carteDuNiveau.getObjectLayer('monstresLeftLayer');

            // creation
            monstresLeftLayer.objects.forEach(monstresLeftLayer => {
                const MMonstresLeftLayer = monstresLeft.create(monstresLeftLayer.x + 16, monstresLeftLayer.y + 16, "monsterLeftApparence").body.setAllowGravity(false).setBounce(1);
            });
            monstresLeft.setVelocity(0, 100);

            // collisions
            this.physics.add.overlap(player, monstresLeft, toucheMobGauche, null, this);

            //BORDURES MONSTRES LEFT (délimitant les déplacements des Ennemis de gauche)
            // récupération
            limitesMonstresLeft = this.physics.add.group();
            limitesMonstresLeftLayer = carteDuNiveau.getObjectLayer('limitesMonstresLeftLayer');

            // création
            limitesMonstresLeftLayer.objects.forEach(limitesMonstresLeftLayer => {
                const LimitesMonstresLeftLayer = limitesMonstresLeft.create(limitesMonstresLeftLayer.x + 16, limitesMonstresLeftLayer.y + 16).setVisible(false).body.setAllowGravity(false).setImmovable(true);
            });

            // collisions
            this.physics.add.collider(monstresLeft, limitesMonstresLeft);

            // ELEMENTS INTERACTIFS

            // BOUTON ROSE

            //récupération
            boutonRose = this.physics.add.staticGroup();
            boutonRoseLayer = carteDuNiveau.getObjectLayer('boutonRoseLayer')['objects'];

            // creation
            boutonRoseLayer.forEach(object => {
                let obj = boutonRose.create(object.x + 16, object.y - 11, 'boutonRoseImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, boutonRose, pressBoutonRose, null, this);

            // PORTE ROSE

            //récupération
            porteRose = this.physics.add.staticGroup();
            porteRoseLayer = carteDuNiveau.getObjectLayer('porteRoseLayer')['objects'];

            // creation
            porteRoseLayer.forEach(object => {
                let obj = porteRose.create(object.x + 16, object.y + 32, 'porteRoseImage');
                obj.setScale(object.width / 32, object.height / 64);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.collider(player, porteRose, disablePorteRose, null, this);

            // BOUTON VERT

            //récupération
            boutonVert = this.physics.add.staticGroup();
            boutonVertLayer = carteDuNiveau.getObjectLayer('boutonVertLayer')['objects'];

            // creation
            boutonVertLayer.forEach(object => {
                let obj = boutonVert.create(object.x + 16, object.y - 16, 'boutonVertImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, boutonVert, pressBoutonVert, null, this);

            // PORTE VERTE

            //récupération
            porteVert = this.physics.add.staticGroup();
            porteVertLayer = carteDuNiveau.getObjectLayer('porteVerteLayer')['objects'];

            // creation
            porteVertLayer.forEach(object => {
                let obj = porteVert.create(object.x + 16, object.y + 32, 'porteVertImage');
                obj.setScale(object.width / 32, object.height / 64);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.collider(player, porteVert, disablePorteVert, null, this);

            // PICK-UP-OBJECTS 

            //CLEFS
            //récupération
            clef = this.physics.add.staticGroup();
            clefsLayer = carteDuNiveau.getObjectLayer('clefsLayer')['objects'];

            // creation
            clefsLayer.forEach(object => {
                let obj = clef.create(object.x + 16, object.y - 16, 'clefsImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, clef, collectClefs, null, this);

            //PORTE FINALE
            //récupération
            porteFinale = this.physics.add.staticGroup();
            porteFinaleLayer = carteDuNiveau.getObjectLayer('porteFinaleLayer')['objects'];

            // creation
            porteFinaleLayer.forEach(object => {
                let obj = porteFinale.create(object.x + 16, object.y + 48, 'porteFinale');
                obj.setScale(object.width / 32, object.height / 96);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.collider(player, porteFinale, disablePorteFinale, null, this);

            //ESPRITS
            //récupération
            esprits = this.physics.add.staticGroup();
            espritsLayer = carteDuNiveau.getObjectLayer('espritsLayer')['objects'];

            // creation
            espritsLayer.forEach(object => {
                let obj = esprits.create(object.x + 16, object.y - 16, 'espritCollectible');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, esprits, collectEsprits, null, this);

            // POWER UP - DOUBLE JUMP

            //récupération
            powerUp = this.physics.add.staticGroup();
            powerUpLayer = carteDuNiveau.getObjectLayer('powerUpLayer')['objects'];

            // creation
            powerUpLayer.forEach(object => {
                let obj = powerUp.create(object.x + 16, object.y - 16, 'powerUpImage');
                obj.setScale(object.width / 32, object.height / 32);
                obj.body.width = object.width;
                obj.body.height = object.height;
            });

            // collisions
            this.physics.add.overlap(player, powerUp, unlockDoubleJump, null, this);

            // UI
            // LIFE
            lifeUI = this.add.sprite(-15, -15, 'lifeFull').setOrigin(0, 0).setScrollFactor(0);

            // SCORE ESPRITS

            //IMAGE ESPRITS
            espritUi = this.add.sprite(520, 5, 'espritUI').setOrigin(0, 0).setScrollFactor(0);

            //NOMBRE D'ESPRITS
            fondScore = this.add.sprite(520, -40, 'fond_score').setOrigin(0, 0).setScrollFactor(0);
            textScore = this.add.text(561, 17, `${espritScore}`, { fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0, 0).setScrollFactor(0);

            // SCORE CLEF

            // IMAGE CLEF
            clefUI = this.add.sprite(520, 55, 'clefUI').setOrigin(0, 0).setScrollFactor(0).setVisible(false);

            //NOMBRE D'ESPRITS
            fondClefScore = this.add.sprite(520, 10, 'fond_score').setOrigin(0, 0).setScrollFactor(0).setVisible(false);
            textclefScore = this.add.text(557, 72, `${clefScore}/2`, { fontSize: '16px', fill: '#FFFFFF' }).setOrigin(0, 0).setScrollFactor(0).setVisible(false);


            // COMMANDES

            // CLAVIER
            // DEPLACEMENTS FLECHES DIRECTIONNELLES
            cursors = this.input.keyboard.createCursorKeys();

            // DEPLACEMENT HORIZONTAUX - D et Q
            keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

            // INTERACTION
            keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

            // SAUT (BARRE D'ESPACE)
            spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            // WALL GRAP (SHIFT)
            keyWallGrap = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

            // MANETTE
            this.input.gamepad.once('connected', function (pad) {
                controller = pad;
            });

            // LIMITES DU NIVEAU

            // LIMITES DU NIVEAU VIA DIMENSIONS
            this.physics.world.setBounds(0, 0, 1600, 1600);

            // PLAYER - Collision entre le joueur et les limites du niveau
            player.setCollideWorldBounds(true);

            // CAMERA

            // LIMITES CAMERA (champs de la caméra de taille identique à celle du niveau)
            this.cameras.main.setBounds(0, 0, 1600, 1600);

            // TAILLE
            this.cameras.main.setSize(600, 400);

            // ANCRAGE CAMERA - JOUEUR
            this.cameras.main.startFollow(player);

            // CAMERA - Zoom de la camera (RETIRE CAR CREE DES STRIES PARASITES ENTRE LES TILES -> PAS BON POUR LE RENDU DE 2D)
            //this.cameras.main.setZoom(1.5, 1.5);

            // ----------------------------------------------------- FIN FONCTION CREATE ----------------------------------------------
        }

        //FONCTION UPDATE - s'exécute à chaque frame du jeu
        function update() {
            picsRetractablesAnim();
            movementPlayer();
            //NE FONCTIONNE PAS -> respawn();
        }

        // --------------------------------- FONCTIONS ---------------------------------

        // CARACTERISTIQUES DES PLATEFORMES

        //PLATEFORMES NORMALES (grotte et donjon)
        function normalPlatsProperties() {
            speedMoveX = 150; // Vitesse classique
            speedMoveY = 290; // hauteur de saut
            playerInertie = 0; // aucune inertie
            wallNeige = false;
            wallIce = false;
        }

        // PLATEFORMES NEIGE (ralentissement)
        function neigePlatsProperties() {
            speedMoveX = 100; // Vitesse ralentie
            speedMoveY = 290; // hauteur de saut
            playerInertie = 0; // aucune inertie
            wallNeige = true; // on glisse le lond des parois
            wallIce = false;
        }

        // PLATEFORMES GLACE (inertie et wallgrab glissant)
        function glacePlatsProperties() {
            speedMoveX = 150; // Vitesse classique
            speedMoveY = 290; // hauteur de saut
            playerInertie = 3000; // inertie
            wallNeige = false;
            wallIce = true; // impossibilité de wall jump
        }

        // Déverouillage des commandes
        function unlockCommandes() { commandesLocked = false; }

        // CAPACITES DU JOUEUR AU SOL
        function onFloorProperties() {

            if (player.body.onFloor()) { // si le joueur est au sol
                wallJumpLocked = true; //on ne peut pas walljump à partir du sol
                unlockCommandes(); // on débloque les commandes

                if (wallIce == false) { // si pas de glace
                    // Coupe l'inertie du saut
                    player.setAccelerationX(playerInertie);
                }
            }

            else {
                wallJumpLocked = false; // si le joueur n'est pas au sol : wall jump débloqué
            }
        }

        // DEPLACEMENTS DU PLAYER
        function movementPlayer() {

            // Verification continue que le joueur est au sol ou à l'air. Débloquage de capacités en conséquent
            onFloorProperties();

            // DEPLACEMENT - GAUCHE
            if ((cursors.left.isDown || keyQ.isDown || controller.left) && commandesLocked == false) { //si la touche gauche est appuyée
                player.setVelocityX(-speedMoveX); //alors vitesse négative en X

                if (player.body.onFloor()) { // si joueur au sol
                    player.anims.play('left', true); //animation marche gauche
                    player.setAccelerationX(-playerInertie); // inertie si glace, sinon 0
                }
            }

            // DEPLACEMENT - DROITE
            else if ((cursors.right.isDown || keyD.isDown || controller.right) && commandesLocked == false) { //sinon si la touche droite est appuyée
                player.setVelocityX(speedMoveX); //alors vitesse positive en X

                if (player.body.onFloor()) { // si joueur au sol
                    player.anims.play('right', true); //animation marche droite
                    player.setAccelerationX(playerInertie); // inertie si glace, sinon 0
                }
            }

            // IDLE
            else {
                player.setVelocityX(0); //vitesse nulle
                player.anims.play('turn'); //animation idle
            }

            // DEPLACEMENT - SAUT

            if ((cursors.up.isDown || spaceBar.isDown || controller.up || controller.A) && commandesLocked == false) {
                didPressJump = true; // autorise le jump normal

                if (didPressJump == true) {
                    if (player.body.onFloor()) { // possibilité de sauter seulement depuis le sol

                        player.body.setVelocityY(-speedMoveY); // vitesseverticale négative 
                        player.setAccelerationX(0); // coupe l'inertie sur la glace

                        didPressJump = false; // bloque le jump normal (évite un double jump non autorisé, le onFloor ne suffit pas à empêcher ça)

                        setTimeout(function () {
                            if (doubleJumpAbility == true) {
                                canDoubleJump = true; // possibilité Double Jump
                            }
                        }, 500);

                    } else if (canDoubleJump == true) {
                        // le perso peut double jump
                        canDoubleJump = false;
                        player.body.setVelocityY(-speedMoveY);
                    }
                }
            }

            // WALL JUMP

            // WALL JUMP GAUCHE
            if (player.body.blocked.left && (keyWallGrap.isDown || controller.R2 || controller.L2) && wallJumpLocked == false) {

                if (wallNeige == true) { // si neige : on glisse le long du mur
                    player.setVelocityY(20);
                    player.setVelocityX(0);
                }
                else if ((wallNeige == false) && (wallIce == false)) { // si normal : on reste accroché au mur
                    player.setVelocityY(-12);
                    player.setVelocityX(-2);
                }

                if ((cursors.up.isDown || spaceBar.isDown || controller.up || controller.A) && (wallIce == false)) { // SAUT => on se repousse du mur
                    // commandes bloquées
                    commandesLocked = true;

                    player.setAccelerationX(0); // reset l'accélération à 0

                    player.setAccelerationX(4000);
                    player.setMaxVelocity(1000);
                    player.setVelocityY(-speedMoveY);

                    // commandes débloquées
                    setTimeout(function () {
                        unlockCommandes();
                        player.setAccelerationX(0);
                    }, 2000);
                }
            }

            // WALL JUMP DROIT
            if (player.body.blocked.right && (keyWallGrap.isDown || controller.R2 || controller.L2) && wallJumpLocked == false) {

                if (wallNeige == true) { // si neige : on glisse le long du mur
                    player.setVelocityY(20);
                    player.setVelocityX(0);
                }
                else if ((wallNeige == false) && (wallIce == false)) { // si normal : on reste accroché au mur
                    player.setVelocityY(-12);
                    player.setVelocityX(2);
                }

                if ((cursors.up.isDown || spaceBar.isDown || controller.up || controller.A) && (wallIce == false)) { // SAUT => on se repousse du mur
                    // commandes bloquées
                    commandesLocked = true;

                    player.setAccelerationX(0); // reset l'accélération à 0

                    player.setAccelerationX(-4000);
                    player.setMaxVelocity(1000);
                    player.setVelocityY(-speedMoveY);

                    // commandes débloquées
                    setTimeout(function () {
                        unlockCommandes();
                        player.setAccelerationX(0);
                    }, 2000);
                }
            }
        }

        //COLLECTES DE PICK UP OBJECTS

        // COLLECTE ESPRIT
        function collectEsprits(player, esprit) {
            esprit.destroy(esprit.x, esprit.y); // détruit l'esprit collecté
            espritScore++; // incrémente le score
            textScore.setText(`${espritScore}`); // montre le score actuel
        }

        // COLLECTE POWER UP
        function unlockDoubleJump(player, powerUp) { // au contact du joueur
            doubleJumpAbility = true; // activation de la capacité double jump
            powerUp.destroy(powerUp.x, powerUp.y); // détruit l'objet
        }

        // CLEF PORTE FINALE

        // SCORE CLEF

        // COLLECTE CLEFS
        function collectClefs(player, clef) {
            clef.destroy(clef.x, clef.y); // détruit la clé collectée
            clefScore++; // incrémente le score

            // affiche l'UI
            clefUI.setVisible(true);
            textclefScore.setVisible(true);
            fondClefScore.setVisible(true);

            textclefScore.setText(`${clefScore}/2`); // montre le score actuel
        }

        // OUVERTURE PORTE FINALE
        function disablePorteFinale(player, porteFinale) { // au contact du joueur
            if (clefScore == 2) { // si le joueur possede 2 clefs
                porteFinale.destroy(); // detruit la porte

                // affiche l'UI
                clefUI.setVisible(false);
                textclefScore.setVisible(false);
                fondClefScore.setVisible(false);
            }
        }

        // PORTES ET BOUTON (DONJON)

        // BOUTON ROSE

        // ACTIVATION BOUTON ROSE
        function pressBoutonRose(player, boutonRose) { // au contact du joueur
            if (cursors.down.isDown || keyE.isDown || controller.B) { // si le joueur presse le bouton
                porteRoseDisable = true; // désactivation de la porte rose
                porteRose.setActive(false).setVisible(false); // porte rose = plus active et plus visible
            }
        }

        // DESACTIVATION PORTE ROSE
        function disablePorteRose(player, porteRose) { // au contact du joueur
            if (porteRoseDisable == true) { // si le bouton rose a été pressé
                porteRose.destroy(); // l'objet est détruit
            }
        }

        // BOUTON VERT

        // ACTIVATION BOUTON VERT (même logique)
        function pressBoutonVert(player, boutonVert) {
            if (cursors.down.isDown || keyE.isDown || controller.B) {
                porteVertDisable = true;
                porteVert.setActive(false).setVisible(false);
            }
        }

        // DESACTIVATION PORTE VERTE (même logique)
        function disablePorteVert(player, porteVert) {
            if (porteVertDisable == true) {
                porteVert.destroy();
            }
        }

        // OBSTACLES DONJON

        // ANIMATION DES PICS RETRACTABLES (DONJON)

        function picsRetractablesAnim() {
            if (picsRetractOn == false) {
                retractPicsBasOff.setActive(true).setVisible(true); // inoffensif ON
                retractPicsBas.setActive(false).setVisible(false); // mortel OFF

                retractPicsDroiteOff.setActive(true).setVisible(true); // inoffensif ON
                retractPicsDroite.setActive(false).setVisible(false); // mortel OFF

                setTimeout(function () { //après 2 sec, switch les états des pics
                    picsRetractOn = true;
                }, 2000);
            }

            if (picsRetractOn == true) {
                retractPicsBasOff.setActive(false).setVisible(false); // inoffensif OFF
                retractPicsBas.setActive(true).setVisible(true); // mortel ON

                retractPicsDroiteOff.setActive(false).setVisible(false); // inoffensif OFF
                retractPicsDroite.setActive(true).setVisible(true); // mortel ON

                setTimeout(function () { //après 2 sec, switch les états des pics
                    picsRetractOn = false;
                }, 2000);
            }
        }

        // PICS RETRACTABLES TUE JOUEUR
        function picsRetractablesKill(player, retractPicsBas) {
            if (picsRetractOn == true) { // si mortel ON => tue le joueur au contact
                killPlayer();
            }
        }

        // OBSTACLES MONTAGNE

        // CASES GLACE FRAGILES
        function destructionGlace(player, platsGlaceFragile) {
            speedMoveX = 150;
            speedMoveY = 280;
            playerInertie = 3000;
            wallNeige = true;
            setTimeout(function () {
                platsGlaceFragile.destroy();
            }, 1000);
        }

        function destroyPicGlace(pics) {
            pics.destroy();
        }

        // ACTIVATION PHYSIQUE PICS GLACE - (1 fonction pour chaque Pic, pour contourner un bug)

        //1
        function physicAllowPicGlace(trigger, pics) {
            if (chutePicGlace == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger(player, trigger) { chutePicGlace = true; console.log("TEST"); }

        //2
        function physicAllowPicGlace2(trigger, pics) {
            if (chutePicGlace2 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger2(player, trigger) { chutePicGlace2 = true; }

        //3
        function physicAllowPicGlace3(trigger, pics) {
            if (chutePicGlace3 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger3(player, trigger) { chutePicGlace3 = true; }

        //4
        function physicAllowPicGlace4(trigger, pics) {
            if (chutePicGlace4 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger4(player, trigger) { chutePicGlace4 = true; }

        //5
        function physicAllowPicGlace5(trigger, pics) {
            if (chutePicGlace5 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger5(player, trigger) { chutePicGlace5 = true; }

        //6
        function physicAllowPicGlace6(trigger, pics) {
            if (chutePicGlace6 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger6(player, trigger) { chutePicGlace6 = true; }

        //7
        function physicAllowPicGlace7(trigger, pics) {
            if (chutePicGlace7 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger7(player, trigger) { chutePicGlace7 = true; }

        //8
        function physicAllowPicGlace8(trigger, pics) {
            if (chutePicGlace8 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger8(player, trigger) { chutePicGlace8 = true; }

        //9
        function physicAllowPicGlace9(trigger, pics) {
            if (chutePicGlace9 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger9(player, trigger) { chutePicGlace9 = true; }

        // 10
        function physicAllowPicGlace10(trigger, pics) {
            if (chutePicGlace10 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger10(player, trigger) { chutePicGlace10 = true; }

        //11
        function physicAllowPicGlace11(trigger, pics) {
            if (chutePicGlace11 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger11(player, trigger) { chutePicGlace11 = true; }

        //12
        function physicAllowPicGlace12(trigger, pics) {
            if (chutePicGlace12 == true) { trigger.destroy(); setTimeout(function () { pics.body.setAllowGravity(true); }, 500); }
        }

        function detectTrigger12(player, trigger) { chutePicGlace12 = true; }

        // MONSTRES

        // POUR LES MONSTRES TOURNES A GAUCHE
        function toucheMobGauche(player, monstresLeft) { // au contact du joueur
            if (player.body.touching.right || player.body.touching.left || player.body.touching.up) { // si touché sur les côtés
                if (invincibleOn == false) { // verifie que player n'est pas invulnérable
                    health -= 1; // enlève 1 PV
                    this.cameras.main.shake(100, 0.02, false, null); // mouvement de caméra pour blessure
                    gestionLife(); // change l'UI de vie

                    invincible(); // active la frame d'invulnérabilité
                    setTimeout(finInvicible, 700); // stop la frame d'invulnérabilité à 0.7 sec 
                }
            }
            else if (player.body.touching.down) { // si touché depuis le haut
                monstresLeft.disableBody(true, true); // détruit le monstre
                player.setVelocityY(-speedMoveY); // rebond du joueur
            }
        }

        // POUR LES MONSTRES TOURNES A GAUCHE (même logique)
        function toucheMobDroite(player, monstresRight) {
            if (player.body.touching.right || player.body.touching.left || player.body.touching.up) {
                if (invincibleOn == false) {

                    health -= 1;
                    this.cameras.main.shake(100, 0.02, false, null);
                    gestionLife();

                    invincible();
                    setTimeout(finInvicible, 700);
                }
            }
            else if (player.body.touching.down) {
                monstresRight.disableBody(true, true);
                player.setVelocityY(-210);
            }
        }

        // INVINCIBILITE SI TOUCHE MONSTRE

        // REND INVINCIBLE
        function invincible() {
            invincibleOn = true;

            // animation invincible
            playerInvisible();
        }

        // FIN INVINCIBLE
        function finInvicible() {
            invincibleOn = false;
        }

        // ANIMATION - FRAME D'INVINCIBILITE

        // ANIMATION - FRAME D'INVINCIBILITE (PART 1 - INVISIBLE)
        function playerInvisible() {
            player.visible = false;
            setTimeout(playerVisible, 100);
        }

        // ANIMATION - FRAME D'INVINCIBILITE (PART 2 - VISIBLE)
        function playerVisible() {
            if (frameInvincible < 3) { // tant que frameInvincible n'a pas dépassé 3, exécute
                player.visible = true;
                setTimeout(playerInvisible, 100);
                frameInvincible += 1; // ajoute +1 jusqu'à 3 (durée de la frame d'invulnérabilité)
            }
            else {
                player.visible = true; // remet visible
                frameInvincible = 0; // remet à zéro
            }
        }


        // Change l'interface et déclenche la mort si 0 PV
        function gestionLife() {
            if (health == 4) {
                lifeUI.setTexture('lifeFull');
            }
            if (health == 3) {
                lifeUI.setTexture('life1');
            }
            if (health == 2) {
                lifeUI.setTexture('life2');
            }
            if (health == 1) {
                lifeUI.setTexture('life3');
            }
            if (health == 0) {
                lifeUI.setTexture('lifeDead');
                killPlayer();
            }
        }

        // MORT DU JOUEUR
        function killPlayer() {
            gameOver = true;
            player.setTint(0xff0000); //perso en rouge
            player.anims.play('turn'); // tourné vers nous
            lifeUI.setTexture('lifeDead'); // UI "mort"
            this.physics.pause();
        }

// RESTART LE JEU (NE FONCTIONNE PAS)
        /*function respawn(){
            if (gameOver == true){

        setTimeout(function () {

            this.scene.restart();
        }, 1000);
            }
        }*/
</script>

    <br>
        <br>
            <br>

                <div style="text-align:center;">
                    <img src="assets/logo.png">
                </div>