"use babel";

import BetterTasksMessageDialog from "./better-tasks-message-dialog";

module.exports = {
  dialog: null,

  activate() {
    inkdrop.components.registerClass(BetterTasksMessageDialog);
    inkdrop.layouts.addComponentToLayout("modal", "BetterTasksMessageDialog");

    this.sub = inkdrop.commands.add(document.body, {
      "better-tasks:insert": () => this.insertTask(),
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
};
