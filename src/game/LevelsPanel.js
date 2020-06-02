import Panel from "./Panel";
import layoutStore from '../store/layout-store';
import {LEVELS_LABEL} from "../constants/texts";
import TextButton from "./TextButton";
import gameStore, {levelIsCustom} from '../store/game-store';
import {reaction} from "mobx";

class LevelsPanel extends Panel {

    constructor() {
        super(LEVELS_LABEL, {
            x: layoutStore.levelsPanelX,
            y: layoutStore.levelsPanelY,
            width: layoutStore.levelsPanelWidth,
            height: layoutStore.levelsPanelHeight,
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

            let buttonWidth;
            if (layoutStore.layoutType === 'desktop') {
                buttonWidth = isCustom
                    ? layoutStore.levelsPanelWidth - layoutStore.panelPadding * 3 - layoutStore.textButtonHeight
                    : layoutStore.levelsPanelWidth - layoutStore.panelPadding * 2;
            } else {
                buttonWidth = layoutStore.levelsPanelWidth - layoutStore.panelPadding * 2;
                buttonWidth /= layoutStore.levelsPanelMobileColumns;
                if (isCustom) {
                    buttonWidth -= layoutStore.textButtonHeight;
                }
            }

            const x = layoutStore.layoutType === 'desktop'
                ? 0
                : Math.floor(index / layoutStore.levelsPanelMobileColumns) * ((layoutStore.levelsPanelWidth - layoutStore.panelPadding * 2) / layoutStore.levelsPanelMobileColumns);
            const y = layoutStore.layoutType === 'desktop'
                ? index * (layoutStore.textButtonHeight + layoutStore.levelsPanelButtonsMargin)
                : (index % layoutStore.levelsPanelMobileColumns) * layoutStore.textButtonHeight;

            const label = layoutStore.layoutType === 'mobile' && level.abbr
                ? `${level.abbr}${isCompleted ? ' ✔️' : ''}`
                : `${level.name}${isCompleted ? ' ✔️' : ''}`;

            const button = new TextButton(
                label,
                {
                    width: buttonWidth,
                    x,
                    y,
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
                const x = layoutStore.layoutType === 'desktop'
                    ? layoutStore.levelsPanelWidth - layoutStore.panelPadding * 2 - layoutStore.textButtonHeight
                    : Math.floor(index / layoutStore.levelsPanelMobileColumns)
                        * ((layoutStore.levelsPanelWidth - layoutStore.panelPadding * 2) / layoutStore.levelsPanelMobileColumns)
                        + buttonWidth;
                const y = layoutStore.layoutType === 'desktop'
                    ? index * (layoutStore.textButtonHeight + layoutStore.levelsPanelButtonsMargin)
                    : (index % layoutStore.levelsPanelMobileColumns) * layoutStore.textButtonHeight;

                const removeButton = new TextButton(
                    '❌',
                    {
                        width: layoutStore.textButtonHeight,
                        x,
                        y,
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