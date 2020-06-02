import {action, computed, observable} from "mobx";

class LayoutStore {
    @observable layoutType = 'desktop';
    @observable levelsPanelButtonsMargin = 10;
    @observable levelsPanelMobileColumns = 3;
    @observable panelPadding = 10;
    @observable textButtonHeight = 40;
    @observable textButtonWidth = 40;
    @observable textButtonPaddingX = 10;
    @observable textButtonPaddingY = 10;
    @observable borderWidth = 2;
    @observable colorButtonSize = 32;
    @observable colorButtonPaddingY = 3;
    @observable customLevelSize = 500;
    @observable pixelsPerGraphics = 50 * 50;

    @computed get appWidth() {
        return this.layoutType === 'desktop' ? 800 : window.innerWidth - this.appPadding * 2;
    }
    @computed get appHeight() {
        return this.layoutType === 'desktop' ? 600 : window.innerHeight - this.appPadding * 2;
    }
    @computed get appPadding() {
        return this.layoutType === 'desktop' ? 20 : 0;
    }
    @computed get panelBodyOffset() {
        return this.layoutType === 'desktop' ? 50 : 40;
    }
    @computed get levelsPanelWidth() {
        return this.layoutType === 'desktop' ? this.appWidth / 4 : this.appWidth - this.appPadding * 2;
    }
    @computed get levelsPanelHeight() {
        return this.layoutType === 'desktop'
            ? this.appHeight - this.appPadding * 4 - this.textButtonHeight * 2
            : 180;
    }
    @computed get colorsPanelY() {
        return this.layoutType === 'desktop'
            ? this.appHeight - this.appPadding - this.colorsPanelHeight
            : this.viewportHeight + this.appPadding * 2;
    }
    @computed get colorsPanelWidth() {
        return this.layoutType === 'desktop'
            ? this.appWidth - this.appPadding * 3 - this.levelsPanelWidth
            : this.appWidth - this.appPadding * 2;
    }
    @computed get colorsPanelHeight() {
        return this.layoutType === 'desktop'
            ? this.panelBodyOffset + this.colorButtonSize * 2 + this.panelPadding
            : this.panelBodyOffset + this.colorButtonSize * 3 + this.panelPadding;
    }
    @computed get colorsColumns() {
        return Math.floor((this.colorsPanelWidth - this.panelPadding * 2) / this.colorButtonSize);
    }
    @computed get levelsPanelX() {
        return this.appWidth - this.appPadding - this.levelsPanelWidth;
    }
    @computed get levelsPanelY() {
        return this.layoutType === 'desktop'
            ? this.appPadding * 3 + this.textButtonHeight * 2
            : this.appHeight - this.appPadding - this.levelsPanelHeight;
    }
    @computed get worldWidth() {
        return this.colorButtonSize * this.customLevelSize;
    }
    @computed get worldHeight() {
        return this.colorButtonSize * this.customLevelSize;
    }
    @computed get viewportWidth() {
        return this.colorsPanelWidth;
    }
    @computed get viewportHeight() {
        return this.layoutType === 'desktop'
            ? this.appHeight - this.appPadding * 3 - this.colorsPanelHeight
            : this.appHeight - this.appPadding * 5 - this.colorsPanelHeight - this.levelsPanelHeight - this.textButtonHeight;
    }
    @computed get saveGameButtonX() {
        return this.layoutType === 'desktop'
            ? this.levelsPanelX
            : this.appPadding;
    }
    @computed get saveGameButtonY() {
        return this.layoutType === 'desktop'
            ? this.appPadding
            : this.appPadding * 3 + this.viewportHeight + this.colorsPanelHeight;
    }
    @computed get saveGameButtonWidth() {
        return this.layoutType === 'desktop'
            ? this.levelsPanelWidth
            : (this.appWidth - 3 * this.appPadding) / 2;
    }
    @computed get createLevelButtonY() {
        return this.layoutType === 'desktop'
            ? this.appPadding * 2 + this.textButtonHeight
            : this.saveGameButtonY;
    }
    @computed get createLevelButtonX() {
        return this.layoutType === 'desktop'
            ? this.levelsPanelX
            : this.saveGameButtonX + this.saveGameButtonWidth + this.appPadding;
    }
    @computed get createLevelButtonWidth() {
        return this.layoutType === 'desktop'
            ? this.levelsPanelWidth
            : this.saveGameButtonWidth;
    }


    @action init() {
        if (window.innerWidth <= 768) {
            this.layoutType = 'mobile';
        }
    }
}

export default new LayoutStore();