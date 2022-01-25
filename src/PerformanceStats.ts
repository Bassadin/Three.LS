import Stats from 'stats-js';

// Performance Stats Singleton
export default class PerformanceStats {
    private static _instance?: PerformanceStats;
    private statsReference: Stats = new Stats();

    private constructor() {
        //Fallback if new keyword is used
        if (PerformanceStats._instance) {
            throw new Error('Use Singleton.instance instead of new.');
        }

        this.statsReference.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.statsReference.dom.style.removeProperty('left');
        this.statsReference.dom.style.setProperty('right', '0');
        document.body.appendChild(this.statsReference.dom);

        PerformanceStats._instance = this;
    }

    // Generate a new instance if none is present, otherwise return the existing one
    static get instance() {
        return PerformanceStats._instance ?? (PerformanceStats._instance = new PerformanceStats());
    }

    // Forward the update call to the stats object
    public update() {
        this.statsReference.update();
    }
}
