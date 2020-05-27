import Panel from "./Panel";
import {
    APP_HEIGHT,
    APP_PADDING,
    LEVELS_PANEL_BUTTONS_MARGIN,
    LEVELS_PANEL_WIDTH, LEVELS_PANEL_X, LEVELS_PANEL_Y,
    PANEL_PADDING,
    TEXT_BUTTON_HEIGHT
} from "../constants/dimensions";
import {LEVELS_LABEL} from "../constants/texts";
import TextButton from "./TextButton";
import gameStore, {levelIsCustom} from '../store/game-store';
import {reaction} from "mobx";

class LevelsPanel extends Panel {

    constructor() {
        super(LEVELS_LABEL, {
            x: LEVELS_PANEL_X,
            y: LEVELS_PANEL_Y,
            width: LEVELS_PANEL_WIDTH,
            height: APP_HEIGHT - APP_PADDING * 4 - TEXT_BUTTON_HEIGHT * 2,
        });
        this.renderButtons();

        reaction(
            () => gameStore.levels.length,
            this.renderButtons.bind(this),
        );
        reaction(
            () => gameStore.progress.map(progress => progress.isComplete),
            this.renderButtons.bind(this),
        );
    }

    renderButtons() {
        this.body.removeChildren();
        for (const [index, level] of gameStore.levels.entries()) {
            const isCustom = levelIsCustom(level);
            const isCompleted = gameStore.levelIsComplete(level);

            const buttonWidth = isCustom
                ? LEVELS_PANEL_WIDTH - PANEL_PADDING * 3 - TEXT_BUTTON_HEIGHT
                : LEVELS_PANEL_WIDTH - PANEL_PADDING * 2;
            const button = new TextButton(
                `${level.name}${isCompleted ? ' ✔️' : ''}`,
                {
                    width: buttonWidth,
                    y: index * (TEXT_BUTTON_HEIGHT + LEVELS_PANEL_BUTTONS_MARGIN),
                },
                () => gameStore.setCurrentLevel(level.id),
                gameStore.currentLevelId === level.id
            );
            this.body.addChild(button.component);

            reaction(
                () => gameStore.currentLevelId,
                currentLevelId => button.active = level.id === currentLevelId
            )

            if (isCustom) {
                const removeButton = new TextButton(
                    '❌',
                    {
                        width: TEXT_BUTTON_HEIGHT,
                        x: LEVELS_PANEL_WIDTH - PANEL_PADDING * 2 - TEXT_BUTTON_HEIGHT,
                        y: index * (TEXT_BUTTON_HEIGHT + LEVELS_PANEL_BUTTONS_MARGIN),
                    },
                    () => gameStore.removeLevel(level.id),
                    false,
                    {
                        paddingX: 8,
                    },
                );
                this.body.addChild(removeButton.component);
            }
        }
    }
}

export default LevelsPanel;