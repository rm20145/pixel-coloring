import TextButton from "./TextButton";
import {AFTER_SAVE_MESSAGE, SAVE_GAME_BUTTON_LABEL} from "../constants/texts";
import layoutStore from '../store/layout-store';
import gameStore from '../store/game-store';

class SaveGameButton extends TextButton {
    constructor() {
        super(SAVE_GAME_BUTTON_LABEL, {
            x: layoutStore.saveGameButtonX,
            y: layoutStore.saveGameButtonY,
            width: layoutStore.saveGameButtonWidth,
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