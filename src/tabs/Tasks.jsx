import { useState } from "react";
import { C, inputStyle, btnStyle, pillStyle } from "../styles/tokens";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { useApi, apiPost, apiPatch, apiDelete } from "../hooks/useApi";

const FILTERS = ["all", "business", "personal", "urgent"];
const PRIORITIES = ["high", "medium", "low"];
const CATEGORIES = [
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal" },
  { value: "urgent", label: "Urgent" },
];
const SUBCATEGORIES = {
  business: [
    { value: "mortgage", label: "Mortgage" },
    { value: "suites", label: "360 Suites" },
    { value: "referral", label: "Referral" },
  ],
  personal: [
    { value: "fitness", label: "Fitness" },
    { value: "family", label: "Family" },
    { value: "finance", label: "Finance" },
  ],
};

export default function Tasks() {
  const { data, refresh } = useApi("/api/tasks", 15000);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", category: "business", subcategory: "", priority: "medium", dueDate: "" });

  const tasks = data?.tasks || [];
  const filtered = filter === "all" ? tasks : tasks.filter(t => t.category === filter);
  const open = filtered.filter(t => t.status === "open");
  const done = filtered.filter(t => t.status === "done");

  // Sort: overdue first, then by priority, then by date
  open.sort((a, b) => {
    const pa = a.priority === "high" ? 3 : a.priority === "medium" ? 2 : 1;
    const pb = b.priority === "high" ? 3 : b.priority === "medium" ? 2 : 1;
    if (a.category === "urgent" && b.category !== "urgent") return -1;
    if (b.category === "urgent" && a.category !== "urgent") return 1;
    if (pa !== pb) return pb - pa;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    return 1;
  });

  async function addTask() {
    if (!newTask.text.trim()) return;
    await apiPost("/api/tasks", newTask);
    setNewTask({ text: "", category: "business", subcategory: "", priority: "medium", dueDate: "" });
    setShowAdd(false);
    refresh();
  }

  async function toggleDone(task) {
    const newStatus = task.status === "open" ? "done" : "open";
    await apiPatch(`/api/tasks/${task.id}`, { status: newStatus });
    refresh();
  }

  async function deleteTask(id) {
    await apiDelete(`/api/tasks/${id}`);
    refresh();
  }

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Tasks</h2>
        <button onClick={() => setShowAdd(true)} style={btnStyle()}>+ Add</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={pillStyle(filter === f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Open Tasks */}
      {open.length === 0 && done.length === 0 && (
        <EmptyState icon="✓" title="All clear" message="No tasks here. Add one to get started." />
      )}

      {open.map(task => (
        <Card key={task.id} style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {/* Checkbox */}
            <div onClick={() => toggleDone(task)} style={{
              width: 22, height: 22, borderRadius: 7,
              border: `2px solid ${task.priority === "high" ? C.red : task.priority === "medium" ? C.amber : C.txt3}`,
              flexShrink: 0, cursor: "pointer", marginTop: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{task.text}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <Badge text={task.category} type={task.category} />
                {task.subcategory && <Badge text={task.subcategory} type={task.subcategory} />}
                {task.dueDate && (
                  <span style={{
                    fontSize: 11,
                    color: task.dueDate < new Date().toISOString().slice(0, 10) ? C.red : C.txt3,
                  }}>
                    {task.dueDate < new Date().toISOString().slice(0, 10) ? "Overdue: " : "Due "}{task.dueDate}
                  </span>
                )}
              </div>
              {task.notes && <div style={{ fontSize: 12, color: C.txt3, marginTop: 4 }}>{task.notes}</div>}
            </div>
            <button onClick={() => deleteTask(task.id)} style={{
              background: "none", border: "none", color: C.txt3, cursor: "pointer", fontSize: 16, padding: 4,
            }}>×</button>
          </div>
        </Card>
      ))}

      {/* Done */}
      {done.length > 0 && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ fontSize: 13, color: C.txt3, cursor: "pointer", marginBottom: 8 }}>
            Done ({done.length})
          </summary>
          {done.map(task => (
            <Card key={task.id} style={{ padding: 12, marginBottom: 6, opacity: 0.5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div onClick={() => toggleDone(task)} style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: C.green, flexShrink: 0, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: C.bg, fontWeight: 700,
                }}>✓</div>
                <span style={{ fontSize: 14, textDecoration: "line-through" }}>{task.text}</span>
              </div>
            </Card>
          ))}
        </details>
      )}

      {/* Add Task Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Task">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            style={inputStyle}
            placeholder="What needs to get done?"
            value={newTask.text}
            onChange={e => setNewTask({ ...newTask, text: e.target.value })}
            autoFocus
            onKeyDown={e => e.key === "Enter" && addTask()}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ ...inputStyle, flex: 1 }}
              value={newTask.category}
              onChange={e => setNewTask({ ...newTask, category: e.target.value, subcategory: "" })}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {SUBCATEGORIES[newTask.category] && (
              <select
                style={{ ...inputStyle, flex: 1 }}
                value={newTask.subcategory}
                onChange={e => setNewTask({ ...newTask, subcategory: e.target.value })}
              >
                <option value="">Sub-category</option>
                {SUBCATEGORIES[newTask.category].map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select
              style={{ ...inputStyle, flex: 1 }}
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
            <input
              type="date"
              style={{ ...inputStyle, flex: 1 }}
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <button onClick={addTask} style={{ ...btnStyle(), width: "100%", padding: 14 }}>
            Add Task
          </button>
        </div>
      </Modal>
    </div>
  );
}
