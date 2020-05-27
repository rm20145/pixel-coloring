import TextButton from "./TextButton";
import {AFTER_SAVE_MESSAGE, SAVE_GAME_BUTTON_LABEL} from "../constants/texts";
import {APP_PADDING, LEVELS_PANEL_WIDTH, LEVELS_PANEL_X} from "../constants/dimensions";
import gameStore from '../store/game-store';

class SaveGameButton extends TextButton {
    constructor() {
        super(SAVE_GAME_BUTTON_LABEL, {
            x: LEVELS_PANEL_X,
            y: APP_PADDING,
            width: LEVELS_PANEL_WIDTH,
        }, () => {
            gameStore.saveToStorage();
            gameStore.alertMessage = AFTER_SAVE_MESSAGE;
            setTimeout(() => {
                gameStore.alertMessage = '';
            }, 2000);
        });
    }
}

export default SaveGameButton;