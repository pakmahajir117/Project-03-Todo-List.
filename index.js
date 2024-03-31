#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from "chalk";
import * as fs from 'fs';
class TodoApp {
    todoList = [];
    filePath = 'todos.json';
    constructor() {
        this.loadTodos();
    }
    loadTodos() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.todoList = JSON.parse(data);
        }
        catch (error) {
            this.todoList = [];
        }
    }
    saveTodos() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.todoList), 'utf-8');
    }
    async showMenu() {
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: (chalk.green.bgRed('Select an option:')),
                choices: ['Add Todo', 'Mark Todo as Done', 'List Todos', 'Exit'],
            },
        ]);
        switch (choice) {
            case 'Add Todo':
                await this.addTodo();
                break;
            case (chalk.blue.bgGreen('Mark Todo as Done')):
                await this.markTodoAsDone();
                break;
            case 'List Todos':
                this.listTodos();
                break;
            case 'Exit':
                console.log(chalk.yellow.bgWhite('Goodbye!'));
                process.exit(0);
                break;
        }
    }
    async addTodo() {
        const { todoText } = await inquirer.prompt([
            {
                type: 'input',
                name: 'todoText',
                message: (chalk.red.bgWhite('Enter your new Todo:')),
            },
        ]);
        this.todoList.push({ text: todoText, done: false });
        this.saveTodos();
        console.log('Todo added!');
        this.showMenu();
    }
    async markTodoAsDone() {
        const { todoIndex } = await inquirer.prompt([
            {
                type: 'list',
                name: 'todoIndex',
                message: (chalk.green.yellow('Select a Todo to mark as done:')),
                choices: this.todoList.map((todo, index) => ({
                    name: todo.text,
                    value: index,
                })),
            },
        ]);
        this.todoList[todoIndex].done = true;
        this.saveTodos();
        console.log(chalk.black.bgGreen('Todo marked as done!'));
        this.showMenu();
    }
    listTodos() {
        console.log('Todo List:');
        this.todoList.forEach((todo, index) => {
            console.log(`${index + 1}. [${todo.done ? 'x' : ' '}] ${todo.text}`);
        });
        this.showMenu();
    }
}
const app = new TodoApp();
app.showMenu();
/////////////// *The End* //////////////////////////
