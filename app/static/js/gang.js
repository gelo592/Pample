(function(){
  function attachListeners() {
    $(".pamplite").click(changeStory);
    $(".blurb-click").click(showHidePeen);
  }

  function changeStory(e) {
    var well = e.currentTarget.dataset["well"];
    var parent = $("#"+well).parent();
    var mofo = parent[0].id;

    if(!$(parent).hasClass("in")) {
      $("#"+well).siblings().addClass("hidden");
      $("#"+well).removeClass("hidden");
      $("#"+mofo+"-click").click();
    }
    else {
      if(!$("#"+well).hasClass("hidden")) {
        $("#"+mofo+"-click").click();
      }
      else {
        // hide other carets
        $(e.currentTarget).siblings().children(".pamp-caret").addClass("hidden");
        // hide other blurbs
        $("#"+well).siblings().addClass("hidden");

        // show this caret
        $(e.currentTarget).children(".pamp-caret").removeClass("hidden");
        // show this blurb
        $("#"+well).removeClass("hidden");
      }
    }
    if(well === "lisa-well") {
      var audio = document.getElementById("audio");
      audio.play();
    }
  }

  function showHidePeen(e) {
    var collapse = $(e.currentTarget).attr("href");

    // opening
    if(!$(collapse).hasClass("in")) {
      $(e.currentTarget).siblings().each(function(i, e) {
        if(!$("#"+e.dataset["well"]).hasClass('hidden')) {
          $(e).children(".pamp-caret").removeClass("hidden");
        }
      });
      e.currentTarget.innerHTML = "no info";
    }
    // closing
    else {
      $(e.currentTarget).siblings().each(function(i, e) {
        $(e).children(".pamp-caret").addClass("hidden");
      });
      e.currentTarget.innerHTML = "mo info";
    }
  }

  attachListeners();
})();