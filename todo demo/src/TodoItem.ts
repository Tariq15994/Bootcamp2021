export class TodoItem{
    public constructor(public taskId : number , public task: string ,public complete: boolean =false){

    }   
    printDetails():void{
        // console.log(`The ID is : ${this.taskId } \n Task is : ${this.task} \n completed ${this.complete} `)
        console.log(`${this.taskId } \n${this.task}\n${this.complete} `);
        
    }
}

// export class TodoItem {
//     constructor(public id:number,
//        public task:string, 
//        public complete:boolean = false){
   
//        }
//        public printDetails(): void{
//            console.log(`${this.id} \t ${this.task} \t ${this.complete}`)
//        }
//    }