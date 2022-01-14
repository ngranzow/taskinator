var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var taskToDoEl = document.querySelector("#tasks-to-do");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        createTaskEl(taskDataObj);
    }
    
    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    }
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId +"']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var createTaskActions = function(taskId) {
        var actionContainerEl = document.createElement("div");
        actionContainerEl.className = "task-actions";

        // create edit button
        var editButtonEl = document.createElement("button");
        editButtonEl.textContent = "Edit";
        editButtonEl.className = "btn edit-btn";
        editButtonEl.setAttribute("data-task-id", taskId);

        actionContainerEl.appendChild(editButtonEl);

        // create delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        deleteButtonEl.className = "btn delete-btn";
        deleteButtonEl.setAttribute("data-task-id", taskId);

        actionContainerEl.appendChild(deleteButtonEl);

        // create status select
        var statusSelectEl = document.createElement("select");
        statusSelectEl.className = "select-status";
        statusSelectEl.setAttribute("name", "status-change");
        statusSelectEl.setAttribute("data-task-id", taskId);

        actionContainerEl.appendChild(statusSelectEl);

        var statusChoices = ["To Do", "In Progress", "Completed"];

        for (var i = 0; i < statusChoices.length; i++) {
            var statusOptionEl = document.createElement("option");
            statusOptionEl.textContent = statusChoices[i];
            statusOptionEl.setAttribute("value", statusChoices[i]);

            statusSelectEl.appendChild(statusOptionEl);
        }

        return actionContainerEl;
    };

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // increase task counter for next unique id
    taskIdCounter++;

    saveTasks();
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {

    // edit button was clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

pageContentEl.addEventListener("click", taskButtonHandler);

// edit task function
var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

// delete task function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updateTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updateTaskArr.push(tasks[i]);
        }
    }

    tasks = updateTaskArr;

    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and conver to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        taskToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        taskInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };

    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

pageContentEl.addEventListener("change", taskStatusChangeHandler);