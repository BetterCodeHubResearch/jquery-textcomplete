+function ($) {
  'use strict';

  function Input () {}

  $.extend(Input.prototype, {
    // Public properties
    // -----------------

    id:        null, // Identity.
    completer: null, // Completer object which creates it.
    el:        null, // Textarea element.
    $el:       null, // jQuery object of the textarea.
    option:    null,

    // Public methods
    // --------------

    initialize: function (element, completer, option) {
      this.el        = element;
      this.$el       = $(element);
      this.id        = completer.id + this.constructor.name;
      this.completer = completer;
      this.option    = option;

      this._bindEvents();
    },

    destroy: function () {
      this.$el.off('.' + this.id); // Remove all event handlers.
      this.$el = this.el = this.completer = null;
    },

    // Returns the caret's relative coordinates from body's left top corner.
    //
    // FIXME: Calculate the left top corner of `this.option.appendTo` element.
    getCaretPosition: function () {
      var position = this._getCaretRelativePosition();
      var offset = this.$el.offset();
      position.top += offset.top;
      position.left += offset.left;
      return position;
    },

    // Focus on the element.
    focus: function () {
      this.$el.focus();
    },

    // Private methods
    // ---------------

    _bindEvents: function () {
      this.$el.on('keyup.' + this.id, $.proxy(this._onKeyup, this));
    },

    _onKeyup: function (e) {
      if (this._skipSearch(e)) { return; }
      this.completer.trigger(this._getTextFromHeadToCaret(), true);
    },

    // Suppress searching if it returns true.
    _skipSearch: function (clickEvent) {
      switch (clickEvent.keyCode) {
        case 40: // DOWN
        case 38: // UP
          return true;
      }
      if (clickEvent.ctrlKey) switch (clickEvent.keyCode) {
        case 78: // Ctrl-N
        case 80: // Ctrl-P
          return true;
      }
    }
  });

  $.fn.textcomplete.Input = Input;
}(jQuery);
