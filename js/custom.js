//Problem space form
var outputID = document.getElementById("form_output");
$( "#probspace" ).submit(function( event ) {
  if ( $( "input:first" ).val()) {
    $( outputID ).text( "Thanks for your input" ).show();
    //return;
  }
  //$( outputID ).text( "Not valid!" ).show().fadeOut( 3000 );
  event.preventDefault();
});

//Archive page tabs
$('#myTabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

// Closes the sidebar menu
$("#menu-close").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Opens the sidebar menu
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
});

// Scrolls to the selected menu item on the page
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});
