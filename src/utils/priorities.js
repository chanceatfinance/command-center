// "Warmest Action" algorithm — surfaces THE one thing Chance should do right now
export function scoreTask(task) {
  if (task.status !== "open") return -1;
  let score = 0;

  // Category urgency
  if (task.category === "urgent") score += 1000;

  // Priority
  if (task.priority === "high") score += 100;
  else if (task.priority === "medium") score += 50;
  else score += 10;

  // Revenue-generating beats admin
  if (task.subcategory === "mortgage") score += 30;

  // Due date urgency
  if (task.dueDate) {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    if (task.dueDate < today) score += 500; // overdue
    else if (task.dueDate === today) score += 200; // due today
    else if (task.dueDate === tomorrow) score += 100; // due tomorrow
  }

  // Stale nudge — open > 3 days
  const age = (Date.now() - new Date(task.createdAt).getTime()) / 86400000;
  if (age > 3) score += 20;

  return score;
}

export function getWarmestActions(tasks, count = 3) {
  return tasks
    .filter(t => t.status === "open")
    .map(t => ({ ...t, _score: scoreTask(t) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, count);
}
