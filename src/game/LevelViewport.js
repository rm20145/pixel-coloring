import {Viewport} from "pixi-viewport";
import layoutStore from '../store/layout-store';
import gameStore from '../store/game-store';
import {greyscale} from "../utils/colors";
import {reaction} from "mobx";
import * as PIXI from 'pixi.js'
import {ACCENT_COLOR, MAIN_COLOR} from "../constants/colors";

const DRAG_TIMEOUT = 200;
const NUMBERS_PADDING = 150;

class LevelViewport {

    _graphics = [];
    _textTextures = {};

    _viewport;
    _graphicsContainer;
    _numbersContainer;
    component;

    constructor(app) {
        this.component = new PIXI.Container();
        this.component.x = layoutStore.appPadding;
        this.component.y = layoutStore.appPadding;

        this._viewport = new Viewport({
            screenWidth: layoutStore.viewportWidth,
            screenHeight: layoutStore.viewportHeight,
            worldWidth: layoutStore.worldWidth,
            worldHeight: layoutStore.worldHeight,
            interaction: app.renderer.plugins.interaction,
            disableOnContextMenu: true,
        });
        this._viewport
            .drag()
            .pinch()
            .wheel();

        this._graphicsContainer = new PIXI.Container();
        this._graphicsContainer.interactive = true;
        this._graphicsContainer.buttonMode = true;

        this._numbersContainer = new PIXI.Container();

        this._viewport.addChild(this._graphicsContainer);
        this._viewport.addChild(this._numbersContainer);
        this.component.addChild(this._viewport);

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(layoutStore.borderWidth, ACCENT_COLOR);
        graphics.drawRect(0, 0, layoutStore.viewportWidth, layoutStore.viewportHeight);
        graphics.endFill();

        this._viewport.mask = new PIXI.Graphics();
        this._viewport.mask.beginFill(MAIN_COLOR);
        this._viewport.mask.drawRect(
            layoutStore.borderWidth,
            layoutStore.borderWidth,
            layoutStore.viewportWidth - layoutStore.borderWidth,
            layoutStore.viewportHeight - layoutStore.borderWidth
        );

        this.component.addChild(graphics);
        this.component.addChild(this._viewport.mask);

        this.render();
        this.initEvents();
    }

    initEvents() {
        let drag = false;
        this._graphicsContainer.on('pointerdown', event => {
            const point = event.data.getLocalPosition(this._graphicsContainer);
            const pointI = Math.floor(point.y / layoutStore.colorButtonSize);
            const pointJ = Math.floor(point.x / layoutStore.colorButtonSize);

            if (!gameStore.currentLevelProgress.matrix[pointI][pointJ]
                && gameStore.currentColorId === gameStore.currentLevel.matrix[pointI][pointJ]) {

                gameStore.updateCurrentLevelProgress(pointI, pointJ, 1);

                const graphicsIndex = Math.floor((pointI * gameStore.currentLevel.matrix[0].length + pointJ) / layoutStore.pixelsPerGraphics);
                this.renderGraphics(graphicsIndex);
                this.renderNumbers();

                event.stopPropagation();
                drag = true;
            }
        });
        this._graphicsContainer.on('pointermove', event => {
            if (drag) {
                const point = event.data.getLocalPosition(this._graphicsContainer);
                const pointI = Math.floor(point.y / layoutStore.colorButtonSize);
                const pointJ = Math.floor(point.x / layoutStore.colorButtonSize);

                if (!gameStore.currentLevelProgress.matrix[pointI][pointJ]
                    && gameStore.currentColorId === gameStore.currentLevel.matrix[pointI][pointJ]) {

                    gameStore.updateCurrentLevelProgress(pointI, pointJ, 1);

                    const graphicsIndex = Math.floor((pointI * gameStore.currentLevel.matrix[0].length + pointJ) / layoutStore.pixelsPerGraphics);
                    this.renderGraphics(graphicsIndex);
                    this.renderNumbers();
                }
            }
        });
        this._graphicsContainer.on('pointerup', event => {
            drag = false;
        });

        let updateTimout;
        this._viewport.on('moved-end', () => {
            updateTimout && clearInterval(updateTimout);
            updateTimout = setTimeout(this.renderNumbers.bind(this), DRAG_TIMEOUT);
        });

        reaction(
            () => gameStore.currentLevelId,
            this.render.bind(this),
        );
    }

    render() {
        this._graphics = [];
        this._textTextures = {};
        this._graphicsContainer.removeChildren();
        this._numbersContainer.removeChildren();

        this.buildTextTextures();

        const matrix = gameStore.currentLevel.matrix;
        const graphicsCount = Math.ceil((matrix.length * matrix[0].length) / layoutStore.pixelsPerGraphics);
        for (let i = 0; i < graphicsCount; i++) {
            const graphics = new PIXI.Graphics();
            this._graphics.push(graphics);
            this._graphicsContainer.addChild(graphics);

            this.renderGraphics(i);
        }
        this.renderNumbers();

        gameStore.alertMessage = '';
    }

    renderGraphics(graphicsIndex) {
        const graphics = this._graphics[graphicsIndex];
        graphics.clear();

        const pixelsCount = gameStore.currentLevelPixelsCount;
        const updateStart = graphicsIndex * layoutStore.pixelsPerGraphics;
        const updateEnd = updateStart + layoutStore.pixelsPerGraphics;

        const matrix = gameStore.currentLevel.matrix;
        const progress = gameStore.currentLevelProgress.matrix;
        const colors = gameStore.currentLevelColorsMap;
        const rowLength = gameStore.currentLevelRowLength;

        for (let k = updateStart; k < updateEnd; k++) {
            if (k === pixelsCount) {
                break;
            }

            const i = Math.floor(k / rowLength);
            const j = k % rowLength;

            const color = colors[matrix[i][j]].color;

            graphics.beginFill(progress[i][j] ? color : greyscale(color));
            graphics.drawRect(
                j * layoutStore.colorButtonSize,
                i * layoutStore.colorButtonSize,
                layoutStore.colorButtonSize,
                layoutStore.colorButtonSize
            );
            graphics.endFill();
        }
    }

    renderNumbers() {
        this._numbersContainer.removeChildren();

        const bounds = this._viewport.getVisibleBounds();

        const x = bounds.x - NUMBERS_PADDING;
        const y = bounds.y - NUMBERS_PADDING;
        const width = bounds.width + 2 * NUMBERS_PADDING;
        const height = bounds.width + 2 * NUMBERS_PADDING;

        const fieldWidth = gameStore.currentLevel.matrix[0].length * layoutStore.colorButtonSize;
        const fieldHeight = gameStore.currentLevel.matrix.length * layoutStore.colorButtonSize;
        const rW = x > 0 ? Math.min(fieldWidth - x, width) : Math.min(width + x, fieldWidth);
        const rH = y > 0 ? Math.min(fieldHeight - y, height) : Math.min(height + y, fieldHeight);

        if (rW > 0 && rH > 0 && width < 1000 && height < 1000) {
            const rX = x < 0 ? 0 : x;
            const rY = y < 0 ? 0 : y;
            const nI = Math.floor(rY / layoutStore.colorButtonSize);
            const nJ = Math.floor(rX / layoutStore.colorButtonSize);
            const nIc = nI + Math.ceil(rH / layoutStore.colorButtonSize);
            const nJc = nJ + Math.ceil(rW / layoutStore.colorButtonSize);

            for (let i = nI; i < nIc; i++) {
                for (let j = nJ; j < nJc; j++) {
                    if (gameStore.currentLevelProgress.matrix[i][j]) {
                        continue;
                    }
                    const colorId = gameStore.currentLevel.matrix[i][j];
                    const sprite = new PIXI.Sprite(this._textTextures[colorId]);
                    sprite.x = j * layoutStore.colorButtonSize;
                    sprite.y = i * layoutStore.colorButtonSize;
                    this._numbersContainer.addChild(sprite);
                }
            }
        }
    }

    buildTextTextures() {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = layoutStore.colorButtonSize * gameStore.currentLevel.colors.length;
        textureCanvas.height = layoutStore.colorButtonSize;
        const textureCtx = textureCanvas.getContext('2d');

        textureCtx.font = 'bold 18px sans-serif';
        textureCtx.lineWidth = 3;
        textureCtx.strokeStyle = 'black';
        textureCtx.fillStyle = 'white';
        textureCtx.textAlign = 'center';
        textureCtx.textBaseline = 'middle';
        const offset = layoutStore.colorButtonSize / 2;
        for (let i = 0; i < gameStore.currentLevel.colors.length; i++) {
            let label = gameStore.currentLevel.colors[i].label;
            textureCtx.strokeText(label, layoutStore.colorButtonSize * i + offset, layoutStore.colorButtonSize - offset + 2);
            textureCtx.fillText(label, layoutStore.colorButtonSize * i + offset, layoutStore.colorButtonSize - offset + 2);
        }
        const baseTexture = new PIXI.BaseTexture.from(textureCanvas);
        for (let i = 0; i < gameStore.currentLevel.colors.length; i++) {
            this._textTextures[gameStore.currentLevel.colors[i].id] =
                new PIXI.Texture(
                    baseTexture,
                    new PIXI.Rectangle(
                        i * layoutStore.colorButtonSize,
                        0,
                        layoutStore.colorButtonSize,
                        layoutStore.colorButtonSize
                    )
                );
        }
    }
}

export default LevelViewport;