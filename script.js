/* =============================================================
   HAYYAT PETROLEUM — Main Script (jQuery)
   Slider · Smooth Scroll · Scroll Animations · Navigation
   ============================================================= */

$(document).ready(function () {

  /* ===========================================================
     1. HERO IMAGE SLIDER (auto-scroll + dots)
     =========================================================== */
  const $slides    = $('#heroSlider .slide');
  const $dotsWrap  = $('#sliderDots');
  let currentSlide = 0;
  let slideTimer;
  const SLIDE_INTERVAL = 6000; // ms between slides

  // Build dot indicators
  $slides.each(function (i) {
    $dotsWrap.append(
      '<button class="slider-dot' + (i === 0 ? ' active' : '') +
      '" data-index="' + i + '" aria-label="Go to slide ' + (i + 1) + '"></button>'
    );
  });

  const $dots = $dotsWrap.find('.slider-dot');

  /**
   * Transition to a given slide index.
   * @param {number} index - target slide index
   */
  function goToSlide(index) {
    if (index === currentSlide) return;

    // Fade out current slide content for a smooth refresh
    $slides.eq(currentSlide).removeClass('active');
    currentSlide = index;
    $slides.eq(currentSlide).addClass('active');

    // Update dots
    $dots.removeClass('active');
    $dots.eq(currentSlide).addClass('active');
  }

  /** Advance to next slide (loops). */
  function nextSlide() {
    var next = (currentSlide + 1) % $slides.length;
    goToSlide(next);
  }

  /** Start auto-scroll timer. */
  function startAutoSlide() {
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  /** Reset timer (e.g. after manual navigation). */
  function resetAutoSlide() {
    clearInterval(slideTimer);
    startAutoSlide();
  }

  // Dot click handler
  $dots.on('click', function () {
    goToSlide($(this).data('index'));
    resetAutoSlide();
  });

  // Kick off auto-scroll
  startAutoSlide();

  /* ===========================================================
     2. STICKY NAVBAR
     =========================================================== */
  const $navbar = $('#navbar');

  function handleNavbarScroll() {
    if ($(window).scrollTop() > 80) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }
  }
  // Initial check + listen
  handleNavbarScroll();
  $(window).on('scroll', handleNavbarScroll);

  /* ===========================================================
     3. MOBILE NAV TOGGLE
     =========================================================== */
  const $navToggle = $('#navToggle');
  const $navLinks  = $('#navLinks');

  $navToggle.on('click', function () {
    $(this).toggleClass('open');
    $navLinks.toggleClass('open');
  });

  // Close mobile menu when a nav link is clicked
  $navLinks.on('click', '.nav-link', function () {
    $navToggle.removeClass('open');
    $navLinks.removeClass('open');
  });

  /* ===========================================================
     4. SMOOTH SCROLL NAVIGATION
     =========================================================== */
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    var target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').stop().animate(
        { scrollTop: target.offset().top - 70 },
        800,
        'swing'
      );
    }
  });

  /* ===========================================================
     5. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
     =========================================================== */
  const $sections  = $('section[id]');
  const $navAnchors = $('.nav-link');

  function highlightNav() {
    var scrollPos = $(window).scrollTop() + 120;

    $sections.each(function () {
      var $sec = $(this);
      var top  = $sec.offset().top;
      var bot  = top + $sec.outerHeight();

      if (scrollPos >= top && scrollPos < bot) {
        var id = $sec.attr('id');
        $navAnchors.removeClass('active');
        $navAnchors.filter('[href="#' + id + '"]').addClass('active');
      }
    });
  }
  $(window).on('scroll', highlightNav);

  /* ===========================================================
     6. SCROLL-BASED FADE / SLIDE ANIMATIONS
     =========================================================== */
  var $animElements = $('.animate-on-scroll');

  function revealOnScroll() {
    var windowBottom = $(window).scrollTop() + $(window).height();

    $animElements.each(function () {
      var $el   = $(this);
      var elTop = $el.offset().top;
      var delay = $el.data('delay') || 0;

      if (windowBottom > elTop + 60) {
        setTimeout(function () {
          $el.addClass('visible');
        }, delay);
      }
    });
  }

  // Run once on load and then on every scroll
  revealOnScroll();
  $(window).on('scroll', revealOnScroll);

  /* ===========================================================
     7. COUNTER ANIMATION (About section stats)
     =========================================================== */
  var countersTriggered = false;

  function animateCounters() {
    if (countersTriggered) return;

    var $stats = $('.about-stats');
    if (!$stats.length) return;

    var statsTop     = $stats.offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > statsTop + 40) {
      countersTriggered = true;

      $('.stat-number').each(function () {
        var $num   = $(this);
        var target = parseInt($num.data('target'), 10);

        $({ count: 0 }).animate({ count: target }, {
          duration: 2000,
          easing: 'swing',
          step: function () {
            $num.text(Math.floor(this.count));
          },
          complete: function () {
            $num.text(target);
          }
        });
      });
    }
  }

  $(window).on('scroll', animateCounters);
  animateCounters(); // in case already in view

  /* ===========================================================
     8. BACK TO TOP BUTTON
     =========================================================== */
  var $backToTop = $('#backToTop');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 500) {
      $backToTop.addClass('visible');
    } else {
      $backToTop.removeClass('visible');
    }
  });

  $backToTop.on('click', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 700, 'swing');
  });

  /* ===========================================================
     9. CONTACT FORM (simple client-side handler)
     =========================================================== */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    var $btn = $(this).find('button[type="submit"]');
    var originalText = $btn.html();

    // Visual feedback
    $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...');
    $btn.prop('disabled', true);

    // Simulate send (replace with real AJAX in production)
    setTimeout(function () {
      $btn.html('<i class="fa-solid fa-check"></i> Message Sent!');
      $btn.css({ background: '#27ae60', color: '#fff' });

      // Reset after 3 seconds
      setTimeout(function () {
        $btn.html(originalText).css({ background: '', color: '' });
        $btn.prop('disabled', false);
        $('#contactForm')[0].reset();
      }, 3000);
    }, 1500);
  });

});
