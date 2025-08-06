class Scheduler {
  constructor(delay = [1000, 3000]) {
    this.isRunning = false;
    this.tasks = [];
    this.delay = delay;
  }

  add(task) {
    this.tasks.push(() => {
      return new Promise((resolve) => {
        task();
        setTimeout(() => {
          resolve();
        }, this.delay[0] + Math.random() * (this.delay[1] - this.delay[0]));
      });
    });
    this.run();
  }

  async run() {
    if (this.tasks.length === 0 || this.isRunning) {
      this.isRunning = false;
      return;
    }
    this.isRunning = true;
    const task = this.tasks.shift();
    await task();
    await this.run();
  }
}

export default Scheduler;
