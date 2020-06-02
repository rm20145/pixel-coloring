import * as PIXI from 'pixi.js'
import {ALERT_MESSAGE} from "../constants/fonts";
import gameStore from '../store/game-store';
import {reaction} from "mobx";

class Alert {

    component;

    constructor() {
        this.component = new PIXI.Container();
        this.component.x = 10;
        this.component.y = 10;

        const text = new PIXI.Text(gameStore.alertMessage, ALERT_MESSAGE);
        this.component.addChild(text);

        reaction(
            () => gameStore.alertMessage,
            message => text.text = message
        );
    }
}

export default Alert;