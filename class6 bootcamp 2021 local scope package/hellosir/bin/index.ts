#!/usr/bin/env node 


import { Greeting } from "../lib/greeting";



console.log(process.argv)
let name = process.argv.splice(2)[0]
let message = Greeting(name);
console.log(message);