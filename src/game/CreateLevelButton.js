import TextButton from "./TextButton";
import {CREATE_LEVEL_BUTTON_LABEL} from "../constants/texts";
import {
    APP_PADDING,
    CUSTOM_LEVEL_SIZE,
    LEVELS_PANEL_WIDTH,
    LEVELS_PANEL_X,
    TEXT_BUTTON_HEIGHT
} from "../constants/dimensions";
import gameStore from "../store/game-store";
import {reaction} from "mobx";
import {customLevelMatrixFromCanvasData} from "../utils/data";

class CreateLevelButton extends TextButton {
    constructor() {
        super(
            CREATE_LEVEL_BUTTON_LABEL,
            {
                x: LEVELS_PANEL_X,
                y: APP_PADDING * 2 + TEXT_BUTTON_HEIGHT,
                width: LEVELS_PANEL_WIDTH,
            },
            () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg, image/png';
                input.onchange = e => {
                    const context = document.createElement('canvas').getContext('2d');
                    const image = new Image();
                    image.onload = () => {
                        let dw, dh;
                        if (image.height > image.width) {
                            dw = Math.floor((CUSTOM_LEVEL_SIZE * image.width) / image.height);
                            dh = CUSTOM_LEVEL_SIZE;
                        } else {
                            dw = CUSTOM_LEVEL_SIZE;
                            dh = Math.floor((CUSTOM_LEVEL_SIZE * image.height) / image.width);
                        }
                        context.drawImage(image, 0, 0, dw, dh);
                        const imageData = context.getImageData(0, 0, dw, dh);

                        gameStore.addLevel(customLevelMatrixFromCanvasData(imageData.data, dw, dh));
                    }
                    image.src = URL.createObjectURL(e.target.files[0]);
                }
                input.click();
            },
            false,
            {},
            !gameStore.canAddLevel
        );
        reaction(
            () => gameStore.canAddLevel,
            canAddLevel => this.disabled = !canAddLevel
        );
    }
}

export default CreateLevelButton;