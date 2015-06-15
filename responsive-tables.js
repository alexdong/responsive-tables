$(document).ready(function() {
  var switched = false;
  var updateTables = function() {
    // If the code supports `always-on`, do not rely on window width.
    if ($('table.responsive.always-on').length > 0) {
      $("table.responsive.always-on").each(function(i, element) {
          splitTable($(element));
        });
    } else {
      if (($(window).width() < 767) && !switched ){
        switched = true;
        $("table.responsive").each(function(i, element) {
          splitTable($(element));
        });
        return true;
      }
      else if (switched && ($(window).width() > 767)) {
        switched = false;
        $("table.responsive").each(function(i, element) {
          unsplitTable($(element));
        });
      }
    }

  };

  $(window).load(updateTables);
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", updateTables);


  function splitTable(original)
  {
    var cols = original.data('columns'),
        selector = ':first-child';
    if (typeof cols !== 'undefined') selector = ':lt(' + cols + ')';

    original.wrap("<div class='table-wrapper' />");
    var copy = original.clone();
    copy.removeClass("responsive");

    original.closest(".table-wrapper").append(copy);
    copy.wrap("<div class='pinned' />");
    original.wrap("<div class='scrollable' />");

    copy.find('tr').find("td:not(" + selector + "), th:not(" + selector + ")").addClass('hide');
    original.find('tr').find('td' + selector + ', th' + selector).addClass('hide');

    setCellHeights(original, copy);
  }

  function unsplitTable(original) {
    original.closest(".table-wrapper").find(".hide").removeClass('hide');
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
  }

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });

    });

    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  }

});
