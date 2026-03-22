const btnEl = document.getElementById("btn");
const appEl = document.getElementById("app");
const searchEl = document.getElementById("search");
const themeBtn = document.getElementById("themeToggle");

renderNotes();


function renderNotes(filter = "") {
  const notes = getNotes();
  appEl.innerHTML = "";

  notes
    .filter(note =>
      note.title.toLowerCase().includes(filter) ||
      note.content.toLowerCase().includes(filter)
    )
    .sort((a, b) => b.pinned - a.pinned)
    .forEach(note => {
      const el = createNoteEl(note);
      appEl.appendChild(el);
    });

  appEl.appendChild(btnEl);
}

function createNoteEl(note) {
  const container = document.createElement("div");
  container.classList.add("note-container");

  const title = document.createElement("input");
  title.value = note.title;
  title.placeholder = "Title";
  title.classList.add("form-control", "note-title");

  const textarea = document.createElement("textarea");
  textarea.value = note.content;
  textarea.classList.add("form-control", "note");

  const color = document.createElement("input");
  color.type = "color";
  color.value = note.color;
  color.classList.add("form-control", "form-control-color");

  textarea.style.background = note.color;

  const actions = document.createElement("div");
  actions.classList.add("d-flex", "justify-content-between", "mt-2");

  const pin = document.createElement("button");
  pin.className = "btn btn-warning btn-sm";
  pin.innerText = note.pinned ? "📌 Pinned" : "Pin";

  const del = document.createElement("button");
  del.className = "btn btn-danger btn-sm";
  del.innerText = "Delete";

  actions.append(pin, del);
  container.append(title, textarea, color, actions);

  
  del.addEventListener("click", () => {
    if (confirm("Delete note?")) deleteNote(note.id);
  });

  // update
  title.addEventListener("input", () => updateNote(note.id, title.value, textarea.value, color.value, note.pinned));
  textarea.addEventListener("input", () => updateNote(note.id, title.value, textarea.value, color.value, note.pinned));

  // color
  color.addEventListener("input", () => {
    textarea.style.background = color.value;
    updateNote(note.id, title.value, textarea.value, color.value, note.pinned);
  });

  
  pin.addEventListener("click", () => {
    const notes = getNotes();
    const target = notes.find(n => n.id === note.id);

    target.pinned = !target.pinned;

    saveNote(notes);
    renderNotes();
  });

  return container;
}

// add note
function addNote() {
  const notes = getNotes();

  notes.push({
    id: Date.now(),
    title: "",
    content: "",
    color: "#ffffff",
    pinned: false
  });

  saveNote(notes);
  renderNotes();
}

// update
function updateNote(id, title, content, color, pinned) {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);

  note.title = title;
  note.content = content;
  note.color = color;
  note.pinned = pinned;

  saveNote(notes);
}

// delete
function deleteNote(id) {
  const notes = getNotes().filter(n => n.id !== id);
  saveNote(notes);
  renderNotes();
}

// storage
function getNotes() {
  return JSON.parse(localStorage.getItem("note-app") || "[]");
}

function saveNote(notes) {
  localStorage.setItem("note-app", JSON.stringify(notes));
}

// events
btnEl.addEventListener("click", addNote);

searchEl.addEventListener("input", (e) => {
  renderNotes(e.target.value.toLowerCase());
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// export
function exportNotes() {
  const data = JSON.stringify(getNotes());
  const blob = new Blob([data], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}