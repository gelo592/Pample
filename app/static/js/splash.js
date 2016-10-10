$(document).ready(function() {
  $('#zoom-butt').click(function(e) {
    $('html, body').stop().animate({
      scrollTop: $('#zoom-anchor').offset().top
    }, 557);

    e.preventDefault();
  });
});