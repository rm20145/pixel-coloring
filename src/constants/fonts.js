import {ALERT_MESSAGE_STROKE, COLOR_BUTTON_LABEL_COLOR, COLOR_BUTTON_LABEL_STROKE} from "./colors";
import {hexToCss} from "../utils/colors";

export const PANEL_LABEL = {
    fontSize: 20,
    fontWeight: 'bold',
};
export const TEXT_BUTTON_LABEL = {
    fontSize: 18,
};
export const COLOR_BUTTON_LABEL = {
    fontSize: 18,
    fontWeight: 'bold',
    fill: hexToCss(COLOR_BUTTON_LABEL_COLOR),
    stroke: hexToCss(COLOR_BUTTON_LABEL_STROKE),
    strokeThickness: 3,
    align: 'center',
};
export const ALERT_MESSAGE = {
    fontSize: 20,
    fontWeight: 'bold',
    stroke: hexToCss(ALERT_MESSAGE_STROKE),
    strokeThickness: 3,
};