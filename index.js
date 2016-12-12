/**
 * 协议编译
 * 
 * Usage:
 * 
 * prototo dir
 */

/*
 * 流程：
 * 1. 读取 .rc 源文件
 * 2. 解析
 * 3. 解析配置文件
 * 4. 生成各模块代码
 */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

sys_dir = __dirname;
work_dir = process.cwd();
process.chdir(work_dir);

require('./util');
var loader = require('./loader');


if (!fs.existsSync('./project.json')) {
    console.log("cannot load file: ./project.json");
    process.exit(-1);
}

var project=JSON.parse(fs.readFileSync('./project.json','utf-8'));

var is_win = require('os').platform() == 'win32';
project.is_win = is_win;

var tasks = project.tasks;
var task_count = tasks.length;
var make_fails = [];

console.log("working dir: " + work_dir + ", task count: " + task_count + "\n");

console.file = "loader";
var source = loader.load(project.src);

function call_next() {
	if (tasks.length == 0) return make_success();
    
	var task = tasks.shift();

    console.log();
    console.file = "";
    console.log("Task: " + (task_count - tasks.length))

    console.file = task.driver;

    try {
        require('./modules/' + task.driver).make(project, source, task, call_next);
    } catch (e) {
        console.log(e);
        make_fails.push(task.driver);
        call_next();
    }
}

function make_success() {
    console.file = "";
	console.log();
    if (make_fails.length == 0) {
        console.log("make success!");
    } else {
        console.log("make fail:");
        console.log(make_fails);
    }
}

call_next();