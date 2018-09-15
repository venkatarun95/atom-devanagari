'use babel';

import HindiView from './hindi-view';
import { CompositeDisposable } from 'atom';
import { Point } from 'atom';

export default {

  hindiView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.hindiView = new HindiView(state.hindiViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.hindiView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'hindi:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.hindiView.destroy();
  },

  serialize() {
    return {
      hindiViewState: this.hindiView.serialize()
    };
  },

  will_insert_text(event) {
    // See if we should trigger any changes
    if (event.text.length > 1)
      return;
    if (!/\W/.test(event.text)) {
      return;
    }

    // Current line of the cursor position. This is the candidate text for
    // editing
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor)
      return;
    let cur_pos = editor.getCursorBufferPosition();
    let line_begin_pos = new Point(cur_pos.row, 0);
    let candidate_range = [line_begin_pos, cur_pos];
    let candidate_text = editor.getTextInBufferRange(candidate_range);

    // Get the last word
    let word = candidate_text.split(/\W/).slice(-1);

    console.log(word);
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      console.log("Adding editor");
      editor.insertText("Toggle World");
      editor.onWillInsertText((event) => this.will_insert_text(event));
    }

    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
