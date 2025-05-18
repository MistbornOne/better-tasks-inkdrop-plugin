'use babel';

import BetterTasksMessageDialog from './better-tasks-message-dialog';

module.exports = {

  activate() {
    inkdrop.components.registerClass(BetterTasksMessageDialog);
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'BetterTasksMessageDialog'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'BetterTasksMessageDialog'
    )
    inkdrop.components.deleteClass(BetterTasksMessageDialog);
  }

};
