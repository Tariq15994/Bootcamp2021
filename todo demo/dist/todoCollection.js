"use strict";
// import { TodoItem } from "./TodoItem";
// type ItemCounts = {
//     total: number,
//     incomplete: number
// }
// export class TodoCollection {
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoCollection = void 0;
//     private nextId: number = 1;
//     private itemMap = new Map<number, TodoItem>();
//     constructor(public userName: string, public todoItems: TodoItem[] = []) {
//         todoItems.forEach(item => this.itemMap.set(item.taskId, item));
//     }
//     // public addTodo(item: string): number {
//     //     this.todoItems.push(new TodoItem(this.nextId, item, false));
//     //     this.itemMap.set(this.nextId, new TodoItem(this.nextId, item));
//     //     return this.nextId++;
//     // }
//     addTodo(task: string): number {
//         while (this.getTodoById(this.nextId)) {
//             this.nextId++;
//         }
//         this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
//         return this.nextId++;
// }
//     public printAll(): void {
//         this.todoItems.forEach((item) => item.printDetails());
//     }
//     public getTodoById(id: number): TodoItem {
//         return this.itemMap.get(id);  // 
//     }
//     getTodoItems(includeComplete: boolean): TodoItem[] {
//         return [...this.itemMap.values()]
//             .filter(item => includeComplete || !item.complete);
//     }
//     markComplete(id: number, complete: boolean) {
//         const todoItem = this.getTodoById(id);
//         if (todoItem) {
//             todoItem.complete = complete;
//         }}
//     // public taskDone(id: number): void{
//     //     let item:TodoItem = this.items.find((item) => item.taskId === id);
//     //     item.complete = true;
//     // }
//     removeComplete() {
//         this.itemMap.forEach(item => {
//             if (item.complete) {
//                 this.itemMap.delete(item.taskId);
//             }
//         })}
//     getItemCounts(): ItemCounts {
//         return {
//             total: this.itemMap.size,
//             incomplete: this.getTodoItems(false).length
//         }}}
const TodoItem_1 = require("./TodoItem");
class TodoCollection {
    constructor(userName, todoItems = []) {
        this.userName = userName;
        this.todoItems = todoItems;
        this.nextId = 1;
        this.itemMap = new Map();
        todoItems.forEach(item => this.itemMap.set(item.taskId, item));
    }
    addTodo(task) {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem_1.TodoItem(this.nextId, task));
        return this.nextId;
    }
    getTodoById(id) {
        //return this.todoItems.find(item => item.id === id);
        return this.itemMap.get(id);
    }
    getTodoItems(includeComplete) {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }
    markComplete(id, complete) {
        const todoItem = this.getTodoById(id);
        if (todoItem) {
            todoItem.complete = complete;
        }
    }
    removeComplete() {
        this.itemMap.forEach(item => {
            if (item.complete) {
                this.itemMap.delete(item.taskId);
            }
        });
    }
    getItemCounts() {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
exports.TodoCollection = TodoCollection;
