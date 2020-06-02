import * as PIXI from 'pixi.js'
import layoutStore from '../store/layout-store';
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
        layoutStore.init();
        gameStore.init();
        this.createApp(container);
    }

    createApp(container) {
        const app = new PIXI.Application({
            width: layoutStore.appWidth,
            height: layoutStore.appHeight,
            backgroundColor: MAIN_COLOR,
        });

        app.view.style.borderWidth = layoutStore.borderWidth + 'px';
        app.view.style.borderColor = hexToCss(ACCENT_COLOR);
        app.view.style.borderStyle = 'solid';
        container.current.appendChild(app.view);

        app.stage.addChild(new LevelViewport(app).component);
        app.stage.addChild(new SaveGameButton().component);
        app.stage.addChild(new CreateLevelButton(app).component);
        app.stage.addChild(new LevelsPanel().component);
        app.stage.addChild(new ColorsPanel().component);
        app.stage.addChild(new Alert().component);
    }
}

export default new Game();