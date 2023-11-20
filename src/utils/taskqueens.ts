export class TaskQueens {
  _taskQueens: (() => void)[];
  _taskStatus: string;
  constructor() {
    this._taskQueens = [];
    this._taskStatus = 'pendding';
  }
  push(task: () => void) {
    this._taskQueens.push(task);
  }

  start = () => {
    return new Promise((resolve) => {
      if (this._taskStatus === 'pendding') {
        while (this._taskQueens.length > 0) {
          this._taskStatus = 'running';
          const taskfn = this._taskQueens.shift();
          taskfn();
          if (this._taskQueens.length === 0) {
            this._taskStatus = 'pendding';
            resolve(true);
          }
        }
      }
    });
  };
}

// class SqlSelect {
//   taskQueens: TaskQueens;

//   state: {
//     status: string;
//     history: [];
//     result: [];
//     queryDuration: number;
//   };

//   private update: () => void;
//   constructor(update) {
//     this.state = {
//       status: '',
//       history: [],
//       result: [],
//       queryDuration: 0,
//     };
//     this.taskQueens = new TaskQueens();
//     this.update = update;
//   }

//   setState = (newState) => {
//     const taskFn = () => {
//       this.state = Object.assign(this.state, newState);
//     };
//     this.taskQueens.push(taskFn);
//     queueMicrotask(() => {
//       this.taskQueens.start().then(() => {
//         this.update();
//       });
//     });
//   };

//   getState = (key) => {
//     if (key) {
//       return this.state[key];
//     }
//     return this.state;
//   };
// }