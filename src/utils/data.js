import {findNearest, hexFromRgb} from "./colors";
import customLevelColors from "../data/custom-level-colors";

export const zeroMatrix = (n, m) => {
    const matrix = [];
    for (let i = 0; i < n; i++) {
        matrix.push([]);
        for (let j = 0; j < m; j++) {
            matrix[i].push(0);
        }
    }
    return matrix;
};
export const customLevelMatrixFromCanvasData = (data, dw, dh) => {
    const matrix = [];
    for (let i = 0; i < dh; i++) {
        matrix.push([]);
        for (let j = 0; j < dw; j++) {
            const dataIndex = (i * dw + j) * 4;
            const rgb = {
                r: data[dataIndex],
                g: data[dataIndex + 1],
                b: data[dataIndex + 2],
                a: data[dataIndex + 3]
            };
            const nearestCustomColor = findNearest(customLevelColors, hexFromRgb(rgb));

            matrix[i].push(nearestCustomColor.id);
        }
    }

    return matrix;
};
export const zipBinaryMatrix = matrix => {
    const result = {
        rows: matrix.length,
        columns: matrix[0].length,
        data: [],
    };

    let prevItem = 0;
    let count = 0;
    for (const row of matrix) {
        for (const item of row) {
            if (item !== prevItem) {
                result.data.push(count);
                prevItem = item;
                count = 1;
            } else {
                count++;
            }
        }
    }
    result.data.push(count);

    return result;
};
export const unzipBinaryMatrix = zipped => {
    const matrix = zeroMatrix(zipped.rows, zipped.columns);

    let currentIndex = 0;
    for (let i = 0; i < zipped.data.length; i++) {
        const currentItem = i % 2;
        for (let j = 0; j < zipped.data[i]; j++) {
            matrix[Math.floor(currentIndex / zipped.columns)][currentIndex % zipped.columns] = currentItem;
            currentIndex++;
        }
    }

    return matrix;
};
