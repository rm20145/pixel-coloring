export const withBenchmark = (callable, args = [], time = true, memory = true) => {
    let startTime;
    let startMemory;
    if (time) {
        startTime = performance.now();
    }
    if (memory) {
        startMemory = window.performance.memory.totalJSHeapSize;
    }

    console.log(callable.name, ...args);
    const result = callable(...args);

    if (time) {
        console.log((performance.now() - startTime) + ' ms');
    }
    if (memory) {
        console.log(window.performance.memory.totalJSHeapSize - startMemory);
    }

    return result;
};