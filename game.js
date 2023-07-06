import Level from "./src/scenes/level.js";
import Preload from "./src/scenes/preload.js";
import GameOver from "./src/scenes/gameOver.js";
import MainScreen from "./src/scenes/mainScreen.js";

const WIDTH = 600;
const HEIGHT = 400;
const ZOOM_FACTOR = -3;

const SHARED_CONFIG = {
    mode: Phaser.Scale.FIT,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
}

const Scenes = [Preload, Level, MainScreen, GameOver] // on liste les scènes
const createScene = Scene => new Scene(SHARED_CONFIG) // on crée une scène qui possède les configs
const initScenes = () => Scenes.map(createScene) // crée une scène pour chaque élément de la map. Lance la 1ere scène automatiquement

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 600,
        height: 400
    },
    scene: initScenes()
}

new Phaser.Game(config);