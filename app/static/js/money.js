$(function() {
  var goals = [
    {
      percent: 13,
      src: 'static/img/topramen.png'
    },
    {
      percent: 27,
      src: 'static/img/cheap-sush.png'
    },
    {
      percent: 40,
      src: 'static/img/delish-ram.png'
    },
    {
      percent: 55,
      src: 'static/img/fancy-sush.png'
    },
    {
      percent: 69,
      src: 'static/img/japan-ramen.png'
    },
    {
      percent: 81,
      src: 'static/img/jiro.png'
    },
    {
      percent: 100,
      src: 'static/img/sushlyfe.png'
    }
  ];

  $(".goal-left").click({direction: -1}, changeGoal);
  $(".goal-right").click({direction: 1}, changeGoal);

  function changeGoal(e) {
    var position = $(".progress-bar").data('position');
    var newPos = position + e.data.direction;

    if(newPos < 0 || newPos >= goals.length) {
      return;
    }
    else if(newPos == goals.length - 1) {
      $(".star-six").addClass("full");
    }

    $(".progress-bar").data('position', newPos);
    $(".progress-bar").attr('aria-valuenow', goals[newPos].percent);
    var newWidth = goals[newPos].percent + '%';
    $(".progress-bar").css("width", newWidth);
    $(".example-image").attr("src", goals[newPos].src);
  }
});