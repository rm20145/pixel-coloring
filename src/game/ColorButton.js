import TextButton from "./TextButton";
import {COLOR_BUTTON_LABEL} from "../constants/fonts";
import layoutStore from '../store/layout-store';

const DEFAULT_RECT = {
    x: 0,
    y: 0,
    height: layoutStore.colorButtonSize,
    width: layoutStore.colorButtonSize,
};
const DEFAULT_OPTIONS = {
    paddingX: 0,
    paddingY: layoutStore.colorButtonPaddingY,
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
        this._labelText.position.set(layoutStore.colorButtonSize / 2, layoutStore.colorButtonSize / 2);
    }
}

export default ColorButton;