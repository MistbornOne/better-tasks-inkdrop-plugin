"use babel";

import React from "react";
import { logger } from "inkdrop";

const { Dialog } = inkdrop.components.classes;

export default class BetterTasksMessageDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      description: "",
      dueDate: new Date().toLocaleDateString("en-US"),
      category: "General",
      status: "🆕 TODO",
      onSubmit: () => {},
    };

    window.betterTasksDialogInstance = this;
    window.betterTasksDialogInstance.setStateFromTask =
      this.setStateFromTask.bind(this);
  }

  setStateFromTask(task) {
    this.setState(task);
  }

  show = (onSubmit) => {
    logger.debug("Showing BetterTasks dialog");
    this.setState({
      visible: true,
      onSubmit,
    });
  };

  close = () => {
    this.setState({ visible: false });
  };

  handleSubmit = () => {
    const { description, dueDate, category, status, onSubmit } = this.state;
    onSubmit({ description, dueDate, category, status });
    this.close();
  };

  render() {
    const { visible, description, dueDate, category, status } = this.state;

    return (
      <Dialog visible={visible} onBackdropClick={this.close}>
        <Dialog.Title>Insert Better Task</Dialog.Title>
        <Dialog.Content>
          <div className="form-group">
            <label>Task Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="text"
              className="form-control"
              value={dueDate}
              onChange={(e) => this.setState({ dueDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => this.setState({ category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => this.setState({ status: e.target.value })}
            >
              <option>🆕 TODO</option>
              <option>🌱 In Progress</option>
              <option>🛑 Stalled</option>
              <option>🚫 Cancel</option>
              <option>✅ Done</option>
            </select>
          </div>
        </Dialog.Content>
        <Dialog.Actions>
          <button className="ui button" onClick={this.close}>
            Cancel
          </button>
          <button className="ui primary button" onClick={this.handleSubmit}>
            Insert Task
          </button>
        </Dialog.Actions>
      </Dialog>
    );
  }
}
