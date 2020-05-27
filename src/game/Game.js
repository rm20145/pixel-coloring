import * as PIXI from 'pixi.js'
import {
    APP_HEIGHT,
    APP_WIDTH,
    BORDER_WIDTH,
} from "../constants/dimensions";
import {ACCENT_COLOR, MAIN_COLOR} from "../constants/colors";
import LevelsPanel from "./LevelsPanel";
import ColorsPanel from "./ColorsPanel";
import {hexToCss} from "../utils/colors";
import gameStore from "../store/game-store";
import LevelViewport from "./LevelViewport";
import CreateLevelButton from "./CreateLevelButton";
import SaveGameButton from "./SaveGameButton";
import Alert from "./Alert";

class Game {

    init(container) {
        gameStore.init();
        this.createApp(container);
    }

    createApp(container) {
        const app = new PIXI.Application({
            width: APP_WIDTH,
            height: APP_HEIGHT,
            backgroundColor: MAIN_COLOR,
        });

        app.view.style.borderWidth = BORDER_WIDTH + 'px';
        app.view.style.borderColor = hexToCss(ACCENT_COLOR);
        app.view.style.borderStyle = 'solid';
        container.current.appendChild(app.view);

        app.stage.addChild(new LevelViewport(app).component);
        app.stage.addChild(new SaveGameButton().component);
        app.stage.addChild(new CreateLevelButton().component);
        app.stage.addChild(new LevelsPanel().component);
        app.stage.addChild(new ColorsPanel().component);
        app.stage.addChild(new Alert().component);
    }
}

export default new Game();