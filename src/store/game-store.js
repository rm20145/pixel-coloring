import {action, computed, observable} from "mobx";
import levels from "../data/levels";
import {unzipBinaryMatrix, zeroMatrix, zipBinaryMatrix} from "../utils/data";
import {v4 as uuidv4} from 'uuid';
import customLevelColors from '../data/custom-level-colors';

const MAX_LEVELS = 7;
const STORAGE_KEY = 'coloringGame';

export const levelIsCustom = level => !Boolean(levels.find(item => item.id === level.id));
const makeEmptyProgress = level => ({
    levelId: level.id,
    isComplete: false,
    matrix: zeroMatrix(level.matrix.length, level.matrix[0].length),
});
const checkProgressMatrix = matrix => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (!matrix[i][j]) {
                return false;
            }
        }
    }
    return true;
};

class GameStore {
    @observable levels = [];
    @observable currentLevelId = null;
    @observable currentColorId = null;
    @observable progress = [];
    @observable alertMessage = '';
    @observable nextCustomLevelNumber = 1;

    @action init() {
        const storageString = localStorage.getItem(STORAGE_KEY);
        const storageData = storageString ? JSON.parse(storageString) : null;

        this.levels = [...levels];
        if (storageData) {
            this.levels = [...this.levels, ...storageData.customLevels];
            this.progress = storageData.progress.map(levelProgress => ({
                ...levelProgress,
                matrix: unzipBinaryMatrix(levelProgress.matrix),
            }));
            this.nextCustomLevelNumber = storageData.nextCustomLevelNumber;
        } else {
            this.progress = levels.map(makeEmptyProgress);
        }

        this.currentLevelId = this.levels[0].id;
    }
    @action saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            customLevels: this.levels.filter(levelIsCustom),
            progress: this.progress.map(levelProgress => ({
                ...levelProgress,
                matrix: zipBinaryMatrix(levelProgress.matrix),
            })),
            nextCustomLevelNumber: this.nextCustomLevelNumber,
        }));
    }
    @action addLevel(matrix) {
        const level = {
            id: uuidv4(),
            name: `Уровень ${this.nextCustomLevelNumber}`,
            abbr: `Ур. ${this.nextCustomLevelNumber}`,
            matrix,
            colors: [...customLevelColors],
        };

        this.levels.push(level);
        this.progress.push(makeEmptyProgress(level));
        this.nextCustomLevelNumber++;

        this.setCurrentLevel(level.id);
    }
    @action removeLevel(id) {
        this.levels = this.levels.filter(level => level.id !== id);
        this.progress = this.progress.filter(progress => progress.levelId !== id);
        this.currentLevelId === id && this.setCurrentLevel(this.levels[0].id);
    }
    @action setCurrentLevel(id) {
        this.currentLevelId = id;
        this.setCurrentColor(null);
    }
    @action setCurrentColor(id) {
        this.currentColorId = id;
    }
    @action updateCurrentLevelProgress(i, j, value = 1) {
        this.currentLevelProgress.matrix[i][j] = value;
        if (checkProgressMatrix(this.currentLevelProgress.matrix)) {
            this.currentLevelProgress.isComplete = true;
        }
    }

    @computed get canAddLevel() {
        return this.levels.length < MAX_LEVELS;
    }
    @computed get currentLevel() {
        return this.levels.find(level => level.id === this.currentLevelId);
    }
    @computed get currentLevelProgress() {
        return this.getLevelProgress(this.currentLevel);
    }
    @computed get currentLevelPixelsCount() {
        return this.currentLevel.matrix.length * this.currentLevel.matrix[0].length;
    }
    @computed get currentLevelRowLength() {
        return this.currentLevel.matrix[0].length;
    }
    @computed get currentLevelColorsMap() {
        return this.currentLevel.colors.reduce((colors, color) => ({
            ...colors,
            [color.id]: color,
        }), {});
    }

    getLevelProgress(level) {
        return this.progress.find(progress => progress.levelId === level.id);
    }
    levelIsComplete(level) {
        return this.getLevelProgress(level).isComplete;
    }
}

export default new GameStore();