const teams = [
  "LCK-1", "LCK-2", "LCK-3",
  "LPL-1", "LPL-2", "LPL-3",
  "LEC-1", "LEC-2", "LEC-3",
  "LTA-1", "LTA-2", "LTA-3",
  "LCP-1", "LCP-2", "LCP-3",
  "LCK-4", "LPL-4"
];

const poolButtons = {
  3: document.getElementById("btn-3"),
  4: document.getElementById("btn-4")
};

const poolContainer = document.getElementById("pools");
const teamList = document.getElementById("team-list");

function createPoolBoxes(count) {
  poolContainer.innerHTML = "";

  for (let i = 1; i <= count; i++) {
    const box = document.createElement("div");
    box.classList.add("pool-box");
    box.dataset.pool = `Pool ${i}`;
    box.innerHTML = `<strong>Pool ${i}</strong>`;
    box.addEventListener("dragover", e => e.preventDefault());
    box.addEventListener("drop", handleDropIntoPool);
    poolContainer.appendChild(box);
  }
}

function createTeamTags() {
  teamList.innerHTML = "";
  teamList.addEventListener("dragover", e => e.preventDefault());
  teamList.addEventListener("drop", handleDropIntoTeamList);

  teams.forEach(team => {
    const tag = createDraggableTeamTag(team);
    teamList.appendChild(tag);
  });
}

function createDraggableTeamTag(name) {
  const tag = document.createElement("div");
  tag.classList.add("team-tag");
  tag.draggable = true;
  tag.textContent = name;
  tag.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", name);
  });
  return tag;
}

function handleDropIntoPool(e) {
  const teamName = e.dataTransfer.getData("text/plain");
  if (!teamName) return;

  // Prevent duplicate
  const alreadyHere = Array.from(e.currentTarget.children).some(
    el => el.textContent === teamName
  );
  if (alreadyHere) return;

  removeTeamFromEverywhere(teamName);
  const tag = createDraggableTeamTag(teamName);
  e.currentTarget.appendChild(tag);
}

function handleDropIntoTeamList(e) {
  const teamName = e.dataTransfer.getData("text/plain");
  if (!teamName) return;

  const alreadyHere = Array.from(teamList.children).some(
    el => el.textContent === teamName
  );
  if (alreadyHere) return;

  removeTeamFromEverywhere(teamName);
  const tag = createDraggableTeamTag(teamName);
  teamList.appendChild(tag);
}

function removeTeamFromEverywhere(name, handleConflict = true) {
  // Remove from team list
  Array.from(teamList.children).forEach(child => {
    if (child.textContent === name) {
      teamList.removeChild(child);
    }
  });

  // Remove from pool boxes
  document.querySelectorAll(".pool-box").forEach(pool => {
    Array.from(pool.children).forEach(child => {
      if (child.textContent === name) {
        pool.removeChild(child);
      }
    });
  });

  // Handle LCK-4 / LPL-4 conflict: keep the other one visible
  if (handleConflict) {
    let twin = null;
    if (name === "LCK-4") twin = "LPL-4";
    else if (name === "LPL-4") twin = "LCK-4";

    if (twin) {
      removeTeamFromEverywhere(twin, false);
      const tag = createDraggableTeamTag(twin);
      teamList.appendChild(tag);
    }
  }
}

// Init buttons
poolButtons[3].addEventListener("click", () => {
  createPoolBoxes(3);
  createTeamTags();
});

poolButtons[4].addEventListener("click", () => {
  createPoolBoxes(4);
  createTeamTags();
});
