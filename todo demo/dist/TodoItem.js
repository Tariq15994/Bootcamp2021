"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItem = void 0;
class TodoItem {
    constructor(taskId, task, complete = false) {
        this.taskId = taskId;
        this.task = task;
        this.complete = complete;
    }
    printDetails() {
        // console.log(`The ID is : ${this.taskId } \n Task is : ${this.task} \n completed ${this.complete} `)
        console.log(`${this.taskId} \n${this.task}\n${this.complete} `);
    }
}
exports.TodoItem = TodoItem;
// export class TodoItem {
//     constructor(public id:number,
//        public task:string, 
//        public complete:boolean = false){
//        }
//        public printDetails(): void{
//            console.log(`${this.id} \t ${this.task} \t ${this.complete}`)
//        }
//    }
