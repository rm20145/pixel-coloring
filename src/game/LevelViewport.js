import {Viewport} from "pixi-viewport";
import {
    APP_HEIGHT,
    APP_WIDTH,
    COLOR_BUTTON_SIZE,
    FIELD_BUTTONS_BORDER_WIDTH,
    WORLD_HEIGHT,
    WORLD_WIDTH
} from "../constants/dimensions";
import gameStore from '../store/game-store';
import ColorButton from "./ColorButton";
import {greyscale} from "../utils/colors";
import {reaction} from "mobx";

class LevelViewport {

    component;

    constructor(app) {
        this.component = new Viewport({
            screenWidth: APP_WIDTH,
            screenHeight: APP_HEIGHT,
            worldWidth: WORLD_WIDTH,
            worldHeight: WORLD_HEIGHT,
            interaction: app.renderer.plugins.interaction,
        });
        this.component
            .drag()
            .pinch()
            .wheel()
            .decelerate();

        this.render();

        reaction(
            () => gameStore.currentLevelId,
            this.render.bind(this),
        );
    }

    render() {
        this.component.removeChildren();
        const matrix = gameStore.currentLevel.matrix;
        const colors = gameStore.currentLevel.colors;
        const progressMatrix = gameStore.currentLevelProgress.matrix;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const color = colors.find(({id}) => id === matrix[i][j]);
                const button = new ColorButton(
                    progressMatrix[i][j] ? '' : color.label,
                    {
                        x: j * COLOR_BUTTON_SIZE,
                        y: i * COLOR_BUTTON_SIZE,
                    },
                    () => gameStore.currentColorId === color.id && gameStore.updateCurrentLevelProgress(i, j),
                    false,
                    {
                        backgroundColor: progressMatrix[i][j] ? color.color : greyscale(color.color),
                        borderWidth: FIELD_BUTTONS_BORDER_WIDTH,
                    },
                );
                this.component.addChild(button.component);

                reaction(
                    () => progressMatrix[i][j],
                    completed => {
                        if (completed) {
                            button.backgroundColor = color.color;
                            button.label = '';
                        }
                    }
                );
            }
        }
    }
}

export default LevelViewport;