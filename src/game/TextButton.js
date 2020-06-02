import * as PIXI from 'pixi.js'
import layoutStore from '../store/layout-store';
import {TEXT_BUTTON_LABEL} from "../constants/fonts";
import {ACCENT_COLOR, MAIN_COLOR, SECOND_COLOR} from "../constants/colors";

const DEFAULT_RECT = {
    x: 0,
    y: 0,
    height: layoutStore.textButtonHeight,
    width: layoutStore.textButtonWidth,
};
const DEFAULT_OPTIONS = {
    paddingX: layoutStore.textButtonPaddingX,
    paddingY: layoutStore.textButtonPaddingY,
    font: TEXT_BUTTON_LABEL,
    borderWidth: layoutStore.borderWidth,
    borderColor: ACCENT_COLOR,
    activeBorderColor: SECOND_COLOR,
    backgroundColor: MAIN_COLOR,
};

class TextButton {

    _active;
    _labelText;
    _backgroundColor;
    _rect;
    _options;
    _graphics;
    _disabled;
    _onClick;

    component;

    constructor(label, rect, onClick, active = false, options = {}, disabled = false) {
        this._active = active;
        this._disabled = disabled;
        this._onClick = onClick;
        this._rect = {...DEFAULT_RECT, ...rect};
        this._options = {...DEFAULT_OPTIONS, ...options};
        this._backgroundColor = this._options.backgroundColor;

        this.component = new PIXI.Container();
        this.component.x = this._rect.x;
        this.component.y = this._rect.y;

        this._graphics = new PIXI.Graphics();
        this.component.addChild(this._graphics);

        if (label) {
            this._labelText = new PIXI.Text(label, this._options.font);
            this._labelText.x = this._options.paddingX;
            this._labelText.y = this._options.paddingY;
            this.component.addChild(this._labelText);
        }

        this.component.interactive = true;
        this.component.buttonMode = true;
        this.component.hitArea = new PIXI.Rectangle(0, 0, this._rect.width, this._rect.height);
        this.component.on('pointerdown', this.handleClick.bind(this));

        this.render();
    }

    handleClick() {
        !this._disabled && this._onClick(this);
    }

    render() {
        this._graphics.clear();
        this._graphics.lineStyle(
            this._options.borderWidth,
            this._active ? this._options.activeBorderColor : this._options.borderColor,
            this._disabled ? .5 : 1,
            0
        );
        this._graphics.beginFill(this._backgroundColor);
        this._graphics.drawRect(0, 0, this._rect.width, this._rect.height);
        this._graphics.endFill();

        if (this._labelText) {
            this._labelText.alpha = this._disabled ? .5 : 1;
        }
    }

    set active(value) {
        this._active = value;
        this.render();
    }
    set disabled(value) {
        this._disabled = value;
        this.render();
    }
    set label(value) {
        if (this._labelText) {
            this._labelText.text = value;
        }
    }
    set backgroundColor(value) {
        this._backgroundColor = value;
        this.render();
    }
}

export default TextButton;