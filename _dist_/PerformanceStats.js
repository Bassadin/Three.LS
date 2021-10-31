import Stats from "../web_modules/stats-js.js";
export default class PerformanceStats {
  constructor() {
    this.statsReference = new Stats();
    if (PerformanceStats._instance) {
      throw new Error("Use Singleton.instance instead of new.");
    }
    this.statsReference.showPanel(0);
    this.statsReference.dom.style.removeProperty("left");
    this.statsReference.dom.style.setProperty("right", "0");
    document.body.appendChild(this.statsReference.dom);
    PerformanceStats._instance = this;
  }
  static get instance() {
    return PerformanceStats._instance ?? (PerformanceStats._instance = new PerformanceStats());
  }
  update() {
    this.statsReference.update();
  }
}
//# sourceMappingURL=PerformanceStats.js.map
