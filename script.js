// ---------------- USER AUTH SECTION ----------------

// SIGNUP
function signup() {
  let username = document.getElementById("signupUsername").value;
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;

  if (username === "" || email === "" || password === "") {
    alert("All fields are required!");
    return;
  }

  let userData = { username, email, password };
  localStorage.setItem("userAccount", JSON.stringify(userData));

  alert("Account Created Successfully!");
  window.location.href = "index.html";
}

// LOGIN
function login() {
  let username = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  let storedUser = JSON.parse(localStorage.getItem("userAccount"));

  if (!storedUser) {
    alert("No account found! Please create account first.");
    return;
  }

  if (username === storedUser.username && password === storedUser.password) {
    localStorage.setItem("loggedIn", "true");
    alert("Login Successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Username or Password!");
  }
}

// RESET PASSWORD
function resetPassword() {
  let email = document.getElementById("resetEmail").value;
  let newPassword = document.getElementById("resetPassword").value;

  let storedUser = JSON.parse(localStorage.getItem("userAccount"));

  if (!storedUser) {
    alert("No account exists! Please signup first.");
    return;
  }

  if (email === storedUser.email) {
    storedUser.password = newPassword;
    localStorage.setItem("userAccount", JSON.stringify(storedUser));
    alert("Password Reset Successful!");
    window.location.href = "index.html";
  } else {
    alert("Email not found!");
  }
}

// CHECK LOGIN
function checkLogin() {
  if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please Login First!");
    window.location.href = "index.html";
  }
}

// LOGOUT
function logout() {
  localStorage.setItem("loggedIn", "false");
  alert("Logged out!");
  window.location.href = "index.html";
}

// ---------------- TEAM MANAGEMENT SECTION ----------------

// Load Team Data
function loadTeamData() {
  let leader = localStorage.getItem("teamLeader") || "Not Set";
  let members = JSON.parse(localStorage.getItem("teamMembers")) || [];

  let leaderText = document.getElementById("currentLeader");
  if (leaderText) leaderText.innerText = leader;

  let memberList = document.getElementById("memberList");
  if (!memberList) return;

  memberList.innerHTML = "";

  members.forEach((member, index) => {
    memberList.innerHTML += `
      <li style="margin-bottom:10px;">
        <b>${member}</b>
        <br><br>
        <button onclick="editTeamMember(${index})">Edit</button>
        <button style="background:red;color:white;margin-left:10px;"
        onclick="deleteTeamMember(${index})">Delete</button>
      </li>
    `;
  });
}

// Set Team Leader
function setTeamLeader() {
  let leaderName = document.getElementById("leaderName").value;

  if (leaderName === "") {
    alert("Enter leader name!");
    return;
  }

  localStorage.setItem("teamLeader", leaderName);
  alert("Team Leader Saved!");

  document.getElementById("leaderName").value = "";
  loadTeamData();
}

// Edit Team Leader
function editTeamLeader() {
  let leader = localStorage.getItem("teamLeader");

  if (!leader) {
    alert("No leader set yet!");
    return;
  }

  let newLeader = prompt("Enter new leader name:", leader);

  if (newLeader === null) return;
  if (newLeader.trim() === "") {
    alert("Leader name cannot be empty!");
    return;
  }

  localStorage.setItem("teamLeader", newLeader.trim());
  alert("Team Leader Updated Successfully!");

  loadTeamData();
}

// Delete Team Leader
function deleteTeamLeader() {
  localStorage.removeItem("teamLeader");
  alert("Team Leader Deleted!");
  loadTeamData();
}

// Add Team Member
function addTeamMember() {
  let memberName = document.getElementById("memberName").value;

  if (memberName === "") {
    alert("Enter member name!");
    return;
  }

  let members = JSON.parse(localStorage.getItem("teamMembers")) || [];
  members.push(memberName);

  localStorage.setItem("teamMembers", JSON.stringify(members));

  alert("Team Member Added!");
  document.getElementById("memberName").value = "";

  loadTeamData();
}

// Edit Team Member
function editTeamMember(index) {
  let members = JSON.parse(localStorage.getItem("teamMembers")) || [];

  let newName = prompt("Enter new member name:", members[index]);

  if (newName === null) return;
  if (newName.trim() === "") {
    alert("Name cannot be empty!");
    return;
  }

  members[index] = newName.trim();
  localStorage.setItem("teamMembers", JSON.stringify(members));

  alert("Member Updated Successfully!");
  loadTeamData();
}

// Delete Team Member
function deleteTeamMember(index) {
  let members = JSON.parse(localStorage.getItem("teamMembers")) || [];

  members.splice(index, 1);
  localStorage.setItem("teamMembers", JSON.stringify(members));

  alert("Team Member Deleted!");
  loadTeamData();
}

// Load Members in Dropdown
function loadTeamMembersDropdown() {
  let leader = localStorage.getItem("teamLeader");
  let members = JSON.parse(localStorage.getItem("teamMembers")) || [];

  let dropdown = document.getElementById("assignedTo");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">-- Assign To --</option>`;

  if (leader) {
    dropdown.innerHTML += `<option value="${leader} (Leader)">${leader} (Leader)</option>`;
  }

  members.forEach(member => {
    dropdown.innerHTML += `<option value="${member}">${member}</option>`;
  });
}

// ---------------- SPRINT HISTORY SECTION ----------------

// CREATE SPRINT
function createSprint() {
  let sprintName = document.getElementById("sprintName").value;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;

  if (sprintName === "" || startDate === "" || endDate === "") {
    alert("Fill all sprint fields!");
    return;
  }

  let sprints = JSON.parse(localStorage.getItem("sprints")) || [];

  let newSprint = {
    id: Date.now(),
    sprintName: sprintName,
    startDate: startDate,
    endDate: endDate,
    status: "Active"
  };

  sprints.forEach(s => (s.status = "Completed"));

  sprints.push(newSprint);

  localStorage.setItem("sprints", JSON.stringify(sprints));
  localStorage.setItem("activeSprintId", newSprint.id);

  alert("Sprint Created Successfully!");

  loadSprintHistory();
  loadActiveSprint();
  displayTasks();
  loadKanban();
  loadAnalytics();
}

// LOAD ACTIVE SPRINT
function loadActiveSprint() {
  let sprints = JSON.parse(localStorage.getItem("sprints")) || [];
  let activeId = localStorage.getItem("activeSprintId");

  let activeSprint = sprints.find(s => s.id == activeId);

  if (activeSprint) {
    document.getElementById("activeSprint").innerHTML =
      `<b>${activeSprint.sprintName}</b> (${activeSprint.startDate} to ${activeSprint.endDate})`;
  } else {
    document.getElementById("activeSprint").innerText = "No Sprint Created";
  }
}

// LOAD SPRINT HISTORY
function loadSprintHistory() {
  let sprints = JSON.parse(localStorage.getItem("sprints")) || [];
  let sprintHistory = document.getElementById("sprintHistory");

  if (!sprintHistory) return;

  sprintHistory.innerHTML = "";

  sprints.forEach(sprint => {
    sprintHistory.innerHTML += `
      <li style="margin-bottom:10px;">
        <b>${sprint.sprintName}</b> (${sprint.startDate} to ${sprint.endDate})
        - <b>${sprint.status}</b>
        <br><br>
        <button onclick="setActiveSprint(${sprint.id})">Set Active</button>
        <button style="background:red;color:white;" onclick="deleteSprint(${sprint.id})">Delete Sprint</button>
      </li>
    `;
  });
}

// SET ACTIVE SPRINT
function setActiveSprint(id) {
  let sprints = JSON.parse(localStorage.getItem("sprints")) || [];

  sprints.forEach(s => {
    if (s.id == id) s.status = "Active";
    else s.status = "Completed";
  });

  localStorage.setItem("sprints", JSON.stringify(sprints));
  localStorage.setItem("activeSprintId", id);

  alert("Sprint Activated Successfully!");

  loadSprintHistory();
  loadActiveSprint();
  displayTasks();
  loadKanban();
  loadAnalytics();
}

// DELETE SPRINT
function deleteSprint(id) {
  let sprints = JSON.parse(localStorage.getItem("sprints")) || [];
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  sprints = sprints.filter(s => s.id != id);
  tasks = tasks.filter(t => t.sprintId != id);

  localStorage.setItem("sprints", JSON.stringify(sprints));
  localStorage.setItem("tasks", JSON.stringify(tasks));

  let activeId = localStorage.getItem("activeSprintId");
  if (activeId == id) {
    localStorage.removeItem("activeSprintId");
  }

  alert("Sprint Deleted Successfully!");

  loadSprintHistory();
  loadActiveSprint();
  displayTasks();
  loadKanban();
  loadAnalytics();
}

// ---------------- TASK SECTION ----------------

// ADD TASK
function addTask() {
  let taskName = document.getElementById("taskName").value;
  let assignedTo = document.getElementById("assignedTo").value;
  let activeSprintId = localStorage.getItem("activeSprintId");

  if (!activeSprintId) {
    alert("Create Sprint First!");
    return;
  }

  if (taskName === "") {
    alert("Enter task name!");
    return;
  }

  if (assignedTo === "") {
    alert("Please assign task to a team member!");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let newTask = {
    id: Date.now(),
    sprintId: activeSprintId,
    name: taskName,
    assignedTo: assignedTo,
    status: "To Do"
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskName").value = "";
  alert("Task Added Successfully!");

  displayTasks();
  loadKanban();
  loadAnalytics();
}

// DISPLAY TASKS
function displayTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let activeSprintId = localStorage.getItem("activeSprintId");

  let taskList = document.getElementById("taskList");
  if (!taskList) return;

  taskList.innerHTML = "";

  let sprintTasks = tasks.filter(t => t.sprintId == activeSprintId);

  sprintTasks.forEach(task => {
    taskList.innerHTML += `
      <li style="margin-bottom:8px;">
        <b>${task.name}</b> | Assigned To: <b>${task.assignedTo}</b> | Status: <b>${task.status}</b>
        <button style="background:red;color:white;margin-left:10px;"
        onclick="deleteTask(${task.id})">Delete</button>
      </li>
    `;
  });
}

// DELETE TASK
function deleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = tasks.filter(t => t.id != taskId);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  alert("Task Deleted Successfully!");

  displayTasks();
  loadKanban();
  loadAnalytics();
}

// ---------------- KANBAN SECTION ----------------

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, newStatus) {
  ev.preventDefault();
  let id = ev.dataTransfer.getData("text");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let task = tasks.find(t => t.id == id);

  if (task) {
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  loadKanban();
  loadAnalytics();
}

// LOAD KANBAN
function loadKanban() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let activeSprintId = localStorage.getItem("activeSprintId");

  if (!document.getElementById("todo")) return;

  document.getElementById("todo").innerHTML = "";
  document.getElementById("progress").innerHTML = "";
  document.getElementById("done").innerHTML = "";

  let sprintTasks = tasks.filter(t => t.sprintId == activeSprintId);

  sprintTasks.forEach(task => {
    let div = document.createElement("div");
    div.className = "task";
    div.id = task.id;
    div.draggable = true;
    div.ondragstart = drag;

    div.innerHTML = `
      <b>${task.name}</b><br>
      <small>👤 ${task.assignedTo}</small>
    `;

    if (task.status === "To Do") document.getElementById("todo").appendChild(div);
    if (task.status === "In Progress") document.getElementById("progress").appendChild(div);
    if (task.status === "Done") document.getElementById("done").appendChild(div);
  });
}

// ---------------- ANALYTICS SECTION ----------------

let burndownChartInstance = null;
let performanceChartInstance = null;

function loadAnalytics() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let activeSprintId = localStorage.getItem("activeSprintId");

  if (!activeSprintId) return;

  let sprintTasks = tasks.filter(t => t.sprintId == activeSprintId);

  let todo = sprintTasks.filter(t => t.status === "To Do").length;
  let progress = sprintTasks.filter(t => t.status === "In Progress").length;
  let done = sprintTasks.filter(t => t.status === "Done").length;

  if (document.getElementById("todoCount"))
    document.getElementById("todoCount").innerText = todo;

  if (document.getElementById("progressCount"))
    document.getElementById("progressCount").innerText = progress;

  if (document.getElementById("doneCount"))
    document.getElementById("doneCount").innerText = done;

  // MEMBER PERFORMANCE
  let members = {};

  sprintTasks.forEach(task => {
    if (!members[task.assignedTo]) {
      members[task.assignedTo] = { total: 0, todo: 0, progress: 0, done: 0 };
    }

    members[task.assignedTo].total++;

    if (task.status === "To Do") members[task.assignedTo].todo++;
    if (task.status === "In Progress") members[task.assignedTo].progress++;
    if (task.status === "Done") members[task.assignedTo].done++;
  });

  let performanceTable = document.getElementById("memberPerformance");
  if (performanceTable) {
    performanceTable.innerHTML = "";

    for (let member in members) {
      performanceTable.innerHTML += `
        <tr>
          <td>${member}</td>
          <td>${members[member].total}</td>
          <td>${members[member].todo}</td>
          <td>${members[member].progress}</td>
          <td>${members[member].done}</td>
        </tr>
      `;
    }
  }

  // PERFORMANCE BAR CHART
  let memberNames = [];
  let memberDoneTasks = [];

  for (let member in members) {
    memberNames.push(member);
    memberDoneTasks.push(members[member].done);
  }

  let perfCanvas = document.getElementById("performanceChart");
  if (perfCanvas) {
    let perfCtx = perfCanvas.getContext("2d");

    if (performanceChartInstance) performanceChartInstance.destroy();

    performanceChartInstance = new Chart(perfCtx, {
      type: "bar",
      data: {
        labels: memberNames,
        datasets: [
          {
            label: "Done Tasks",
            data: memberDoneTasks,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // BURNDOWN CHART
  let totalTasks = sprintTasks.length;
  let days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

  let ideal = [];
  for (let i = 0; i < days.length; i++) {
    ideal.push(totalTasks - (totalTasks / (days.length - 1)) * i);
  }

  let actual = [];
  let completedPerDay = done / (days.length - 1);

  for (let i = 0; i < days.length; i++) {
    actual.push(totalTasks - completedPerDay * i);
  }

  ideal = ideal.map(x => Math.round(x));
  actual = actual.map(x => Math.round(x));

  let canvas = document.getElementById("burndownChart");
  if (!canvas) return;

  let ctx = canvas.getContext("2d");

  if (burndownChartInstance) burndownChartInstance.destroy();

  burndownChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "Ideal Remaining Work",
          data: ideal,
          borderWidth: 2,
          tension: 0.3
        },
        {
          label: "Actual Remaining Work",
          data: actual,
          borderWidth: 2,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
