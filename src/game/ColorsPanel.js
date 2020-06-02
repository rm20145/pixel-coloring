import Panel from "./Panel";
import layoutStore from '../store/layout-store';
import {COLORS_LABEL} from "../constants/texts";
import ColorButton from "./ColorButton";
import gameStore from '../store/game-store';
import {reaction} from "mobx";

class ColorsPanel extends Panel {

    constructor() {
        super(COLORS_LABEL, {
            x: layoutStore.appPadding,
            y: layoutStore.colorsPanelY,
            width: layoutStore.colorsPanelWidth,
            height: layoutStore.colorsPanelHeight,
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

        const rows = Math.ceil(colors.length / layoutStore.colorsColumns);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < layoutStore.colorsColumns; j++) {
                const index = i * layoutStore.colorsColumns + j;
                const color = colors[index];
                const button = new ColorButton(
                    color.label,
                    {
                        x: j * layoutStore.colorButtonSize,
                        y: i * layoutStore.colorButtonSize,
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