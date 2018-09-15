'use babel';

import HindiView from './hindi-view';
import { CompositeDisposable } from 'atom';
import { Point } from 'atom';
import { convert_word_to_hindi, convert_digit_to_hindi } from './convert_to_hindi';

export default {

  hindiView: null,
  modalPanel: null,
  subscriptions: null,

  // Editors on which Hindi editing is enabled
  enabled_editors: new Map(),

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

    // We have a digit. Handle separately
    if (/\d/.test(event.text)) {
      event.cancel();
      let editor = atom.workspace.getActiveTextEditor();
      if (!editor)
        return;
      editor.insertText(convert_digit_to_hindi(event.text));
    }

    // Trigger word replacement only if we see a non-word character
    if (/[\w']/.test(event.text)) {
      return;
    }

    // Current line of the cursor position. This is the candidate text for
    // editing
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor)
      return;
    // If we have multiple cursors, it will be too complicated. Return
    if (editor.getCursorBufferPositions().length > 1)
      return;
    let cur_pos = editor.getCursorBufferPosition();
    let line_begin_pos = new Point(cur_pos.row, 0);
    let candidate_range = [line_begin_pos, cur_pos];
    let candidate_text = editor.getTextInBufferRange(candidate_range);

    // Get the last word
    let word = candidate_text.split(/[^\w']/).slice(-1)[0];

    if (word == '')
      return;

    // Convert to Hindi
    hindi_word = convert_word_to_hindi(word);

    // Replace the word
    for (i = 0; i < word.length; ++i) {
      editor.backspace();
    }
    editor.insertText(hindi_word);

    // If inserted text was a full stop, convert it to hindi danda
    if (event.text == '.') {
      event.cancel();
      editor.insertText('।')
    }
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      // See whether to add or delete editor;
      if (this.enabled_editors.get(editor.id) != undefined) {
        this.enabled_editors.get(editor.id).dispose();
        this.enabled_editors.delete(editor.id)
      }
      else {
        let disposable =
          editor.onWillInsertText((event) => this.will_insert_text(event));
        this.enabled_editors.set(editor.id, disposable);
      }
    }
  }

};
