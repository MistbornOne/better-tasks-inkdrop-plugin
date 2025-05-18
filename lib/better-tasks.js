"use babel";

import BetterTasksMessageDialog from "./better-tasks-message-dialog";

module.exports = {
  dialog: null,

  activate() {
    inkdrop.components.registerClass(BetterTasksMessageDialog);
    inkdrop.layouts.addComponentToLayout("modal", "BetterTasksMessageDialog");

    this.sub = inkdrop.commands.add(document.body, {
      "better-tasks:insert": () => this.insertTask(),
      "better-tasks:edit": () => this.editTask(),
    });
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      "modal",
      "BetterTasksMessageDialog",
    );
    inkdrop.components.deleteClass(BetterTasksMessageDialog);

    if (this.sub) this.sub.dispose();
  },

  insertTask() {
    const dialog = window.betterTasksDialogInstance;

    if (!dialog) {
      console.error("BetterTasksMessageDialog not found in layout.");
      return;
    }

    dialog.show((taskData) => {
      if (!taskData || !taskData.description) return;

      const { description, dueDate, category, status } = taskData;

      const editor = inkdrop.getActiveEditor();
      if (!editor || editor.disposed) {
        console.warn("No valid editor found. Skipping insert.");
        return;
      }

      try {
        requestIdleCallback(() => {
          const formatted = `- [ ] ${description} | 📅 ${dueDate} | 🏷️ ${category} | ${status}`;
          const cm = editor?.cm;
          if (cm) {
            cm.replaceSelection(formatted + "\n");
          } else {
            console.warn("CodeMirror instance not available.");
          }
        });
      } catch (err) {
        console.error("Failed to insert task into editor:", err);
      }
    });
  },

  editTask() {
    const dialog = window.betterTasksDialogInstance;
    if (!dialog) {
      console.error("BetterTasks dialog instance not available.");
      return;
    }

    const editor = inkdrop.getActiveEditor();
    const cm = editor?.cm;
    const cursor = cm.getCursor();
    //const line = cm.getLine(cursor.line);
    const lineText = cm.getLine(cursor.line);
    console.log("Editing line:", JSON.stringify(lineText));

    const match = lineText
      .normalize("NFC")
      .replace(/\u200B|\uFE0F/g, "")
      .match(/^-\s\[\s?\]\s(.+?)\s\|\s📅\s(.+?)\s\|\s🏷\s(.+?)\s\|\s(.+)$/);

    if (!match) {
      console.warn("No properly formatted task found.");
      return;
    }

    const [, description, dueDate, category, status] = match;

    dialog.show((taskData) => {
      if (!taskData || !taskData.description) return;

      requestIdleCallback(() => {
        const updated = `- [ ] ${taskData.description} | 📅 ${taskData.dueDate} | 🏷️ ${taskData.category} | ${taskData.status}`;
        cm.replaceRange(
          updated,
          { line: cursor.line, ch: 0 },
          { line: cursor.line, ch: lineText.length },
        );
      });
    });

    requestIdleCallback(() => {
      dialog.setStateFromTask({ description, dueDate, category, status });
    });
  },
};
