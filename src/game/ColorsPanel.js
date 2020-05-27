import Panel from "./Panel";
import {
    APP_HEIGHT,
    APP_PADDING,
    COLOR_BUTTON_SIZE, COLORS_COLUMNS,
    COLORS_PANEL_HEIGHT, COLORS_PANEL_WIDTH,
} from "../constants/dimensions";
import {COLORS_LABEL} from "../constants/texts";
import ColorButton from "./ColorButton";
import gameStore from '../store/game-store';
import {reaction} from "mobx";

class ColorsPanel extends Panel {

    constructor() {
        super(COLORS_LABEL, {
            x: APP_PADDING,
            y: APP_HEIGHT - APP_PADDING - COLORS_PANEL_HEIGHT,
            width: COLORS_PANEL_WIDTH,
            height: COLORS_PANEL_HEIGHT,
        });
        this.renderButtons();

        reaction(
            () => gameStore.currentLevelId,
            this.renderButtons.bind(this),
        );
    }

    renderButtons() {
        this.body.removeChildren();
        const colors = gameStore.currentLevel.colors;

        const rows = Math.ceil(colors.length / COLORS_COLUMNS);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < COLORS_COLUMNS; j++) {
                const index = i * COLORS_COLUMNS + j;
                const color = colors[index];
                const button = new ColorButton(
                    color.label,
                    {
                        x: j * COLOR_BUTTON_SIZE,
                        y: i * COLOR_BUTTON_SIZE,
                    },
                    () => gameStore.setCurrentColor(color.id),
                    gameStore.currentColorId === color.id,
                    {
                        backgroundColor: color.color,
                    },
                );
                this.body.addChild(button.component);

                reaction(
                    () => gameStore.currentColorId,
                    currentColorId => button.active = color.id === currentColorId
                )

                if (index === colors.length - 1) {
                    break;
                }
            }
        }
    }
}

export default ColorsPanel;