'use strict';

(function () {
  'use strict';

  /**
  * [Model holds the "component's" state]
  */

  var Model = {
    new: function _new() {
      var m = Object.create(Model);
      m.show = false;
      m.expanded = false;
      m.observers = [];
      return m;
    },
    addObserver: function addObserver(observer) {
      this.observers.push(observer);
    },
    notify: function notify() {
      var _this = this;

      this.observers.forEach(function (observer) {
        return observer.update(_this);
      });
    },
    checkScrollTop: function checkScrollTop(scrollTop) {
      if (scrollTop > 300) this.show = true;else this.show = false;
      this.notify();
    },
    toggleExpanded: function toggleExpanded() {
      this.expanded = !this.expanded;
      this.notify();
    }
  };

  /**
  * [Renders model to the DOM]
  */
  var View = {
    new: function _new() {
      // Create new object that delegates to View
      var v = Object.create(View);

      // Get sections (elements with 'data-rowname' attribute)
      v.$sections = $('[data-rowname]');

      // Construct and append html
      $('body').append('<div id="pagenav"><div id="logo"></div><div id=\'current-row\'></div></div>');
      $('#pagenav').append('<div id="top" class="item">top</div>');
      v.$sections.each(function (_, element) {
        return $('#pagenav').append('<div class=\'item\'>' + $(element).attr('data-rowname') + '</div>');
      });

      // Get references
      v.$pagenav = $('#pagenav');
      v.$logo = $('#pagenav #logo');
      v.$top = $('#pagenav #top');
      v.$currentRow = $('#pagenav #current-row');
      v.$items = $('#pagenav .item:not(#top)');

      // Return new object
      return v;
    },
    attachEventHandlers: function attachEventHandlers() {
      var _this2 = this;

      $(window).on('touchmove', function () {
        return _this2.onScroll($(window).scrollTop());
      });
      $(window).scroll(function () {
        return _this2.onScroll($(window).scrollTop());
      });
      this.$items.on('click', this.onItemClick);
      this.$top.on('click', this.onTopClick);
      this.$pagenav.on('click', this.onPagenavClick);
      this.$logo.on('click', this.onLogoClick);
    },
    scrollTo: function scrollTo(event) {
      var $section = $('[data-rowname="' + $(event.target).html() + '"]');
      $section.velocity("scroll", { duration: 1000, offset: -39, easing: "easeOut" })
    },
    scrollToTop: function scrollToTop() {
      $('body').velocity("scroll", { duration: 1000, easing: "easeOut" })
    },
    nearestRowname: function nearestRowname() {
      return $(this.$pagenav).nearest('[data-rowname]:not(#pagenav #item)', { directionConstraints: 'bottom' }).attr('data-rowname');
    },
    setCurrent: function setCurrent(index, item) {
      var $item = $(item);
      if ($item.html() === this.nearestRowname()) {
        $item.addClass('current');
      } else {
        $item.removeClass('current');
      }
    },
    triggerOverlayMenu: function () {
      $('a.overlay-menu-link.menu-bars-link').trigger('click')
    },
    update: function update(model) {
      // For small screen sizes
      if (model.expanded) {
        this.$pagenav.addClass('expanded');
        this.$pagenav.find('#current-row').html('close');
      } else {
        this.$pagenav.removeClass('expanded');
        this.$pagenav.find('#current-row').html('menu');
      }

      // Set #current-row to the nearest section (Mobile)
      this.$currentRow.html(this.nearestRowname());
      // On large screen sizes add the class ''
      this.$items.each(this.setCurrent.bind(this));

      // Hide when at top of page
      if (!model.show) this.$pagenav.addClass('hidden');else this.$pagenav.removeClass('hidden');
    }
};

/**
 * [App connects model and view]
 */
var App = {
  new: function _new() {
    var a = Object.create(App);
    a.model = Model.new();
    a.view = View.new();

    // Event handlers
    a.view.onScroll = a.model.checkScrollTop.bind(a.model);
    a.view.onTouch = a.model.checkScrollTop.bind(a.model);
    a.view.onItemClick = a.view.scrollTo.bind(a.view);
    a.view.onTopClick = a.view.scrollToTop.bind(a.view);
    a.view.onPagenavClick = a.model.toggleExpanded.bind(a.model);
    a.view.onLogoClick = _ => a.view.triggerOverlayMenu()

    a.model.addObserver(a.view);
    a.view.attachEventHandlers();

    // Initial update
    a.view.update(a.model);

    // Return new object
    return a;
  }
};

// When $ is undefined, make a reference to jQuery
window.$ = jQuery;

// Create a new object that delegates to App
$(function () {
  console.log(App.new());
});
})();
