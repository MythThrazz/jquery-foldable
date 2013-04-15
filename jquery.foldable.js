/*
 *@author Marcin Dudek
 */

//    var defaultOptions = {
//        event: 'click', /* event which fires the folding effect */
//        hideText: 'Fold', /* folding button text */
//        showText: 'Unfold', /* unfolding button text */
//        titleWrapper: '<h2/>', /* folding block's wrapper element */
//        titleText: undefined, /* folding block's title */
//        titleSearchSelector: 'h1,h2,h3,h4,h5,h6', /* folding block's title selector */
//        defaultFold: false, /* if the blocks have to be folded initially */
//        showTime: 100, /* time of the animation showing the title of the folding block */
//        hideTime: 'fast', /* time of the animation hiding the title of the folding block */
//        animationTime: 'slow' /* animation time */
//    };

(function($, undefined) {

    var defaultOptions = {
        event: 'click', /* nazwa zdarzenia odpalającego zwijanie */
        hideText: 'Zwiń', /* tekst przycisku zwijającego */
        showText: 'Rozwiń', /* tekst przycisku rozwijającego */
        titleWrapper: '<h2/>', /* wrapper tytułu dla zwijalnego bloku */
        titleText: undefined, /* tekst tytułu zwijalnego bloku */
        titleSearchSelector: 'h1,h2,h3,h4,h5,h6', /* selektor tytułu dla zwijalnego bloku */
        defaultFold: false, /* czy bloki domyślnie zwinięte */
        showTime: 100, /* czas animacji pokazującej tytuł zwijalnego bloku */
        hideTime: 'fast', /* czas animacji ukrywającej tytuł zwijalnego bloku */
        animationTime: 'slow' /* czas animacji slide */
    };

    var api = {
        log: function() {
            console.log(this);
        },
        toggle: function() {
            return this.find('.foldable-row').trigger('mouseup.foldable');
        },
        showHide: function(object, options) {
            var hideTime, animationTime, showTime;
            if (options.quickHide)
            {
                hideTime = 0;
                showTime = 0;
                animationTime = 0;
            }
            else
            {
                hideTime = options.hideTime;
                showTime = options.showTime;
                animationTime = options.animationTime;
            }

            var $elementToFoldUnfold = $(object).siblings('.foldable-wrapper');
            var $btn = $(object).find('.foldable-button');
            var $title = $(object).find(options.titleSearchSelector);

            if (!$elementToFoldUnfold.is(':visible')) {
                $(object).addClass('unfolded');
                $(object).removeClass('folded');
                $title.hide(hideTime);
                $elementToFoldUnfold.slideDown(animationTime);
                $btn.text(options.hideText);
                $btn.addClass('on');
            } else {
                $(object).addClass('folded');
                $(object).removeClass('unfolded');
                $elementToFoldUnfold.slideUp(animationTime, function() {
                    $title.show(showTime);
                });
                $btn.text(options.showText);
                $btn.removeClass('on');
            }

            return false;
        },
        init: function(options) {

            var $this = $(this), data = $this.data('foldable');
            options = $.extend({}, defaultOptions, options || {});
            if (options.defaultFold)
            {
                var quickOptions = $.extend({quickHide: true}, options);
            }

            if (!data)
            {
                $(this).data('foldable', {
                    options: options
                });
            }

            return this.each(function() {
                var $foldableTitleText;
                var $foldable = this;
                var $foldableWrapper = $('<div class="foldable-wrapper" />');
                var $foldableRow = $('<div class="foldable-row unfolded" />');
                var $button = $('<span class="btn-small foldable-button pull-right on">' + options.hideText + '</button>');

                $($foldableRow).append($button);
                $($foldable).children().wrapAll($foldableWrapper);
                $($foldable).prepend($foldableRow);

                var $title = $($foldable).find(options.titleSearchSelector);
                if ($title.length > 0)
                {
                    $foldableTitleText = $($title[0]).text();
                }

                if (options.titleText)
                {
                    if (typeof options.titleText === 'function')
                    {
                        var test = options.titleText;
                        $foldableTitleText = test.apply($foldable);
                    }
                    else
                    {
                        $foldableTitleText = options.titleText;
                    }
                }

                if ($foldableTitleText)
                {
                    var $foldableTitle = $(options.titleWrapper, {
                        text: $foldableTitleText,
                        "class": 'foldable-title'
                    });

                    $($foldableTitle).hide();
                    $foldableRow.append($foldableTitle);
                }

                $foldableRow.on(options.event + '.foldable', function() {
                    api.showHide($foldableRow, options);
                });

                if (options.defaultFold)
                {
                    api.showHide($foldableRow, quickOptions);
                }
            });
        },
        destroy: function() {
            return this.each(function() {
                var $this = $(this),
                        data = $this.data('foldable');

                var options = data.options;

                var $foldableWrapper = $this.find('.foldable-wrapper');
                var $foldableRow = $this.find('.foldable-row');

                $foldableRow.find('.folded').trigger(options.event);

                $foldableWrapper.children().unwrap();
                $foldableRow.off('.foldable');
                $foldableRow.remove();

                $this.removeData('foldable');
            });
        }
    };
    $.fn.foldable = function(options) {
        // Method calling logic
        if (api[options]) {
            return api[options].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof options === 'object' || !options) {
            return api.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + options + ' does not exist on jQuery.foldable');
        }
    };
})(jQuery);