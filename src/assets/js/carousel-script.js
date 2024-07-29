$(document).ready(function(){
  $('.owl-carousel-basic').owlCarousel({
    loop:true,      
    autoplay:false, 
    autoplayTimeout:3000,     
    nav:true,
    dots:false,
    responsive:{  
      0:{
        items:1
      },
      600:{
        items:3,
        /*nav:false,*/
      },
      1000:{
        items:6,
       /* margin:16*/
      }
    }
  })
});

$('#popular-carousl').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    nav: true,
    dots:false,
    responsive: {
        0: {
            items:1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 6,
        }
    }
})

/* #2 */
$('#Featured-carousl').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 6,
        }
    }
})

/* #3 */
$('#PopularAcademic-carousl').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 6,
        }
    }
})

/* #4 */
$('#FeaturedWellbeingPreRecorded-carousl').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 6,
        }
    }
})

/* #5 */
$('#PopularELTPreRecorded-carousl').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    autoplay: true,
    nav: true,
    dots: false,
    responsive: {
        0: {
            items: 1,
        },
        600: {
            items: 2,
        },
        1000: {
            items: 6,
        }
    }
})


// carousel resource page

$('#resource_caro').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    autoplay:false,
    dots:false,
    nav:true,
    responsive:{
        0:{
            items:3,
        },
        600:{
            items:6,
        },
        1000:{
            items:9,
        }
    }
})

// carousel pre recorded course page

$('#prerecorded_caro').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    autoplay:false,
    dots:false,
    nav:true,
    responsive:{
        0:{
            items:2,
        },
        600:{
            items:4,
        },
        1000:{
            items:6,
        }
    }
})
// carousel educator review page

$('#edu_review_caro').owlCarousel({
    loop:true,
    margin:30,
    responsiveClass:true,
    autoplay:false,
    dots:false,
    nav:true,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:2,
        },
        1000:{
            items:3,
        }
    }
})
    // scroll to section 

$(document).ready(function(){
	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();
	    var target = this.hash;
	    var $target = $(target);
	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        // window.location.hash = target;
	    });
	});
});

$(document).ready(function() {
    // grab the initial top offset of the navigation 
       var stickyNavTop = $('.enrolloncourse').offset().top;
       
       // our function that decides weather the navigation bar should have "fixed" css position or not.
       var stickyNav = function(){
        var scrollTop = $(window).scrollTop(); // our current vertical position from the top
             
        // if we've scrolled more than the navigation, change its position to fixed to stick to top,
        // otherwise change it back to relative
        if (scrollTop > stickyNavTop) { 
            $('.enrolloncourse').addClass('sticky');
        } else {
            $('.enrolloncourse').removeClass('sticky'); 
        }
    };

    stickyNav();
    // and run it again every time you scroll
    $(window).scroll(function() {
        stickyNav();
    });
});

// Add active class to the current button
$("#enrolloncourse_bot li a").click(function() {
    $(this).parent().addClass('selected').siblings().removeClass('selected');
    });

    