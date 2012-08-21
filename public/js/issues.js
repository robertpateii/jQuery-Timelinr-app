$(function () {
    issues.load();
});

var issues = (function ($) {
  "use strict";
  var module = {};

  // hides the loading image and shows the content
  function showContent() {
    $("#timelineLoading").fadeOut(function () {
      $("#timeline").fadeIn();
    });
  }

  // engages the timeline plugin and then runs showContent()
  function engageTimelinr() {
    $().timelinr({
      orientation: 'vertical',
      arrowKeys: 'true', // only works if #prev and #next exist because it calls .click on them!
      autoPlay: 'false',
      autoPlayPause: 10000
    });
    showContent();
  }

  function sortIssues(issuesArray) {
    // using this function instead of sorting issues directly will keep unsortedIssues unsorted and avoid timing issues. 
    issuesArray.sort(compareDates);
    return issuesArray;

    function compareDates(a, b) {
      // will sort them in descending, newest to oldest.
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    }
  }

  function newDate(dateString) {
    var myDate = new Date(Date.parse(dateString));
    return myDate;
  }

  function getDisplayDate(date) {
    var display = "";
    var displayArray;
    // gets the human readable string, looks like this: Wed Jul 28 1993
    display = date.toDateString();
    // I just want the date, not the weekday, so split it up and recombine.
    displayArray = display.split(" ");
    display = displayArray[1] + " " + displayArray[2] + ", " + displayArray[3];
    return display;
  }

  // PUBLIC: adds the images and text programmatically from the data source
  // DEPENDS ON: unsorted.js 
  module.load = function () {
    $.getJSON('/js/unsorted.json', function (json) {
      var unsortedIssues = json.unsortedIssues;
      // before you sort these, you need to convert the date strings to actual date objects. 
      for (var i = 0; i < unsortedIssues.length; i++) {
        var dateString = unsortedIssues[i].date;
        unsortedIssues[i].date = newDate(dateString);
      }
      var sortedIssues = sortIssues(unsortedIssues);
      var i;
      var displayDate;
      for (i = 0; i < sortedIssues.length; i++) {
        displayDate = getDisplayDate(sortedIssues[i].date);
        $("#dates").append("<li><a href='#" + displayDate + "'>" + displayDate + "</a></li>");
        $("#issues").append(
                "<li id='" + displayDate + "'>" +
                "<img src='images/" + sortedIssues[i].photo + "' class='photo' />" +
                "<h1>" + displayDate + "</h1>" +
                "<p>" + sortedIssues[i].text + "</p>" +
                "</li>"
            );
      }
      engageTimelinr();
    });

  };

  return module;
} (jQuery));
