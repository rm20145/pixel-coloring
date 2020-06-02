import * as PIXI from 'pixi.js'
import {PANEL_LABEL} from "../constants/fonts";
import layoutStore from '../store/layout-store';
import {ACCENT_COLOR, MAIN_COLOR} from "../constants/colors";

class Panel {

    component;
    body;

    constructor(label, rect) {
        this.component = new PIXI.Container();
        this.component.x = rect.x;
        this.component.y = rect.y;

        this.graphics = new PIXI.Graphics();
        this.graphics.lineStyle(layoutStore.borderWidth, ACCENT_COLOR);
        this.graphics.beginFill(MAIN_COLOR);
        this.graphics.drawRect(0, 0, rect.width, rect.height);
        this.graphics.endFill();
        this.component.addChild(this.graphics);

        this.body = new PIXI.Container();
        this.body.x = layoutStore.panelPadding;
        this.body.y = layoutStore.panelBodyOffset;
        this.component.addChild(this.body);

        const labelText = new PIXI.Text(label, PANEL_LABEL);
        labelText.x = layoutStore.panelPadding;
        labelText.y = layoutStore.panelPadding;
        this.component.addChild(labelText);
    }
}

export default Panel;