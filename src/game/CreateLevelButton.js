import TextButton from "./TextButton";
import {CREATE_LEVEL_BUTTON_LABEL} from "../constants/texts";
import layoutStore from '../store/layout-store';
import gameStore from "../store/game-store";
import {reaction} from "mobx";
import {customLevelMatrixFromCanvasData} from "../utils/data";

class CreateLevelButton extends TextButton {
    constructor(app) {
        super(
            CREATE_LEVEL_BUTTON_LABEL,
            {
                x: layoutStore.createLevelButtonX,
                y: layoutStore.createLevelButtonY,
                width: layoutStore.createLevelButtonWidth,
            },
            () => {
                app.renderer.plugins.interaction.autoPreventDefault = false;

                const input = document.createElement('input');
                input.style = 'position: absolute; top: -100px; left: -100px; z-index: -1;';
                input.type = 'file';
                input.accept = 'image/jpeg, image/png';
                document.body.appendChild(input);
                input.addEventListener('change', e => {
                    gameStore.alertMessage = 'Загрузка...';

                    const image = new Image();
                    image.onload = () => {
                        app.renderer.plugins.interaction.autoPreventDefault = true;

                        let dw, dh;
                        if (image.height > image.width) {
                            dw = Math.floor((layoutStore.customLevelSize * image.width) / image.height);
                            dh = layoutStore.customLevelSize;
                        } else {
                            dw = layoutStore.customLevelSize;
                            dh = Math.floor((layoutStore.customLevelSize * image.height) / image.width);
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = dw;
                        canvas.height = dh;
                        const context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0, dw, dh);
                        const imageData = context.getImageData(0, 0, dw, dh);

                        // const levelMatrix = withBenchmark(customLevelMatrixFromCanvasData, [imageData.data, dw, dh]);
                        const levelMatrix = customLevelMatrixFromCanvasData(imageData.data, dw, dh);
                        gameStore.addLevel(levelMatrix);
                    }
                    image.src = URL.createObjectURL(e.target.files[0]);
                });
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