import * as PIXI from 'pixi.js'
import {PANEL_LABEL} from "../constants/fonts";
import {BORDER_WIDTH, PANEL_BODY_OFFSET, PANEL_PADDING} from "../constants/dimensions";
import {ACCENT_COLOR, MAIN_COLOR} from "../constants/colors";

class Panel {

    component;
    body;

    constructor(label, rect) {
        this.component = new PIXI.Container();
        this.component.x = rect.x;
        this.component.y = rect.y;

        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(BORDER_WIDTH, ACCENT_COLOR);
        this.graphics.beginFill(MAIN_COLOR);
        this.graphics.drawRect(0, 0, rect.width, rect.height);
        this.graphics.endFill();
        this.component.addChild(this.graphics);

        this.body = new PIXI.Container();
        this.body.x = PANEL_PADDING;
        this.body.y = PANEL_BODY_OFFSET;
        this.component.addChild(this.body);

        const labelText = new PIXI.Text(label, PANEL_LABEL);
        labelText.x = PANEL_PADDING;
        labelText.y = PANEL_PADDING;
        this.component.addChild(labelText);
    }
}

export default Panel;