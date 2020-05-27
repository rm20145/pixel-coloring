import TextButton from "./TextButton";
import {
    COLOR_BUTTON_PADDING_Y,
    COLOR_BUTTON_SIZE,
} from "../constants/dimensions";
import {COLOR_BUTTON_LABEL} from "../constants/fonts";

const DEFAULT_RECT = {
    x: 0,
    y: 0,
    height: COLOR_BUTTON_SIZE,
    width: COLOR_BUTTON_SIZE,
};
const DEFAULT_OPTIONS = {
    paddingX: 0,
    paddingY: COLOR_BUTTON_PADDING_Y,
    font: COLOR_BUTTON_LABEL,
};

class ColorButton extends TextButton {
    constructor(label, rect, onClick, active = false, options = {}) {
        super(
            label,
            {...DEFAULT_RECT, ...rect},
            onClick,
            active,
            {...DEFAULT_OPTIONS, ...options}
        );
        this._labelText.anchor.set(.5, .5);
        this._labelText.position.set(COLOR_BUTTON_SIZE / 2, COLOR_BUTTON_SIZE / 2);
    }
}

export default ColorButton;