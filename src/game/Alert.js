import * as PIXI from 'pixi.js'
import {APP_PADDING} from "../constants/dimensions";
import {ALERT_MESSAGE} from "../constants/fonts";
import gameStore from '../store/game-store';
import {reaction} from "mobx";

class Alert {

    component;

    constructor() {
        this.component = new PIXI.Container();
        this.component.x = APP_PADDING;
        this.component.y = APP_PADDING;

        const text = new PIXI.Text(gameStore.alertMessage, ALERT_MESSAGE);
        this.component.addChild(text);

        reaction(
            () => gameStore.alertMessage,
            message => text.text = message
        );
    }
}

export default Alert;