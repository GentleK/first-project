let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".tab-type div");
let tabFilter = "tab-all";
let underLine = document.getElementById("tab-underline");
addButton.addEventListener("click", addTask);
let goBackButton = document.getElementById("go-back");
goBackButton.addEventListener("click", ()=>{
    document.location.href = "../index.html";
});

taskInput.addEventListener("keypress", (event)=>{
    if (event.key === "Enter") {
        addTask();
    }
});

let taskList = [];
for( let inx=1; inx < tabs.length; inx++ ){
    tabs[inx].addEventListener("click", (event)=>{
        filter(event);
    })
}

function filter(event){
    if( event ){
        underLine.style.width = event.target.offsetWidth + "px";
        underLine.style.left = event.target.offsetLeft + "px";
        underLine.style.top = event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
    }
    tabFilter = event.target.id;
    render(tabFilter);
}

function addTask() {
    let task = {
        id:'_' + Math.random().toString(36).substr(2, 16),
        taskContent:taskInput.value,
        isComplete:false
    }
    taskList.push(task);
    taskInput.value = "";
    render(tabFilter);
}


function toggleComplete(id){
    for( let inx=0; inx < taskList.length; inx++ ){
        if( taskList[inx].id == id ){
            taskList[inx].isComplete = !taskList[inx].isComplete;
            break;
        }
    }
    render(tabFilter);
}

function deleteTask(inx){
    taskList.splice(inx,1);
    render(tabFilter);
}

function render(tabFilter){
    let resultHtml = "";

    for( let inx=0; inx < taskList.length; inx++ ){
        let taskContentClass = "task";
        let taskCheckButtonClass = "fa fa-check";
        if( taskList[inx].isComplete ){
            if( tabFilter == "tab-not-done" ){
                continue;
            }
            taskContentClass = "task task-done";
            taskCheckButtonClass = "fas fa-undo-alt";
        }else{
            if( tabFilter == "tab-done" ){
                continue;
            }
        }

        resultHtml += `<div class="${taskContentClass}">
                <span>${taskList[inx].taskContent}</span>
                <div class="button-box">
                    <button onclick="toggleComplete('${taskList[inx].id}')"><i class="${taskCheckButtonClass}"></i></button>
                    <button onclick="deleteTask('${inx}')"><i class="fa fa-trash"></i></button>
                </div>
            </div>`;
    }

    document.getElementById("task-board").innerHTML = resultHtml;
}