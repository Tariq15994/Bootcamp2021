// import { TodoItem } from "./TodoItem";
// type ItemCounts = {
//     total: number,
//     incomplete: number
// }
// export class TodoCollection {

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

import { TodoItem } from "./TodoItem";

type ItemCounts = {
    total: number,
    incomplete: number
}

export class TodoCollection {
    private nextId: number = 1;
    protected itemMap = new Map<number, TodoItem>();


    constructor(public userName: string, public todoItems: TodoItem[] = []) {
        todoItems.forEach(item => this.itemMap.set(item.taskId, item));

    }
    addTodo(task: string): number {
        while (this.getTodoById(this.nextId)) {
            this.nextId++;
        }
        this.itemMap.set(this.nextId, new TodoItem(this.nextId, task));
        return this.nextId;
    }
    getTodoById(id: number): TodoItem {
        //return this.todoItems.find(item => item.id === id);
        return this.itemMap.get(id);
    }
    getTodoItems(includeComplete: boolean): TodoItem[] {
        return [...this.itemMap.values()]
            .filter(item => includeComplete || !item.complete);
    }
    markComplete(id: number, complete: boolean) {
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
        })
    }
    getItemCounts(): ItemCounts {
        return {
            total: this.itemMap.size,
            incomplete: this.getTodoItems(false).length
        };
    }
}
