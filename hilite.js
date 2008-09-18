(function($) {
  /**
   * Highlight a DOM element with a list of keywords.
   */
  $.fn.hilite = function(to_watch) { 
    var index        = {},
        search_event = $.browser.safari ? 'search' : 'keyup';
  
    // Setup index
    this.each(function() {
      var elem    = $(this),
          content = $.trim(elem.html().toLowerCase());
      elem.data('restore', elem.html());
      index[content] = elem;
    });
  
    $(to_watch).bind(search_event, function() {
      var search = $(this).val().toLowerCase();

      $.each(index, function(key, elem) {
        elem.html(elem.data('restore'));

        if (search.length <= 0)
          elem.show();
        else if (key.indexOf(search) > 0)
          elem.html(hiliteHTML(elem.html(), search)).show();
        else
          elem.hide();
      });
    });
    
    return this;
  
    /**
     * Highlight a HTML string with a list of keywords.
     */
    function hiliteHTML(html, query) {
      var re = new Array();
      for (var i = 0; i < query.length; i ++) {
        query[i] = query[i].toLowerCase();
        re.push(query[i]);
      }

      re = new RegExp('('+re.join("|")+')', "gi");

      var subs = '<span class="highlight">$1</span>';

      var last = 0;
      var tag = '<';
      var skip = false;
      var skipre = new RegExp('^(script|style|textarea)', 'gi');
      var part = null;
      var result = '';

      while (last >= 0) {
        var pos = html.indexOf(tag, last);
        if (pos < 0) {
          part = html.substring(last);
        last = -1;
        } else {
          part = html.substring(last, pos);
          last = pos+1;
        }

        if (tag == '<') {
          if (!skip)
            part = part.replace(re, subs);
          else
            skip = false;
        } else if (part.match(skipre)) {
          skip = true;
        }

        result += part + (pos < 0 ? '' : tag);
        tag = tag == '<' ? '>' : '<';
      }

      return result;
    };
  };
})(jQuery);