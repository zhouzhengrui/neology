// iScroll
function isPassive() {
    var supportsPassiveOption = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassiveOption = true;
            }
        }));
    } catch (e) {}
    return supportsPassiveOption;
}

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, isPassive() ? {
    capture: false,
    passive: false
} : false);

var mainScroll;
var bottomModalScroll;

function loaded() {

    mainScroll = new IScroll('.main', {
        scrollbars: 'custom',
        fadeScrollbars: true,
        shrinkScrollbars: 'scale',
        preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|IMG)$/ },
        click: true,
        tap: true
    });

    if (document.querySelector(".bottom-modal-scroll")) {
        bottomModalScroll = new IScroll('.bottom-modal-scroll', {
            scrollbars: 'custom',
            fadeScrollbars: true,
            shrinkScrollbars: 'scale',
            click: true
        });
    }

}

// role swiper
var roleTab = new Swiper('#role-tab', {
    effect: 'coverflow',
    coverflow: {
        rotate: 0,
        stretch: 0,
        depth: 0,
        modifier: 1,
        slideShadows: false
    },
    slidesPerView: 'auto',
    centeredSlides: true,
    setWrapperSize: true,
    initialSlide: 1,
    onlyExternal: true,
    slideTotapedSlide: true,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    onTap: function() {
        roleImage.slideTo(roleTab.clickedIndex)
    }
});

var roleImage = new Swiper('#role-image', {
    effect: 'coverflow',
    coverflow: {
        rotate: 0,
        stretch: -60,
        depth: 350,
        modifier: 1,
        slideShadows: true
    },
    slidesPerView: 'auto',
    centeredSlides: true,
    initialSlide: 1,
    slideTotapedSlide: true,
    lazyLoading: true,
    lazyLoadingInPrevNext: true
});

var roleInfo = new Swiper('#role-info', {
    initialSlide: 1,
    onlyExternal: true
});

roleTab.params.control = [roleInfo];

roleImage.params.control = [roleTab];

// waves
Waves.displayEffect();

// delayed spik
function delayedSpik() {

    // var href = [];
    // $("body").find("a.waves-effect").each(function(i) {
    //     href[i] = $(this).attr("href");
    //     $(this).attr("href", "javascript:;");
    //     $(this).bind("tap", function() {
    //         window.setTimeout(function() {
    //             location.href = href[i];
    //         }, 300);
    //     });
    // });

    var href = [];
    $("[data-href]").each(function(i) {
        href[i] = $(this).data('href');
        if ($(this).hasClass('waves-effect')) {
            $(this).bind("click", function() {
                window.setTimeout(function() {
                    location.href = href[i];
                }, 300);
            });
        } else {
            $(this).bind("tap", function() {
                location.href = href[i];
            });
        }
    });

};
delayedSpik();

// photo swipe
var photoSwipe = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i];
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0];
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl;
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};
        if (hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            shareEl: false,
            fullscreenEl: false,
            preloaderEl: false,
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top + pageYScroll,
                    w: rect.width
                };
            }
        };
        if (fromURL) {
            if (options.galleryPIDs) {
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if (isNaN(options.index)) {
            return;
        }
        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};
photoSwipe('.photo-swipe');

// toast
function toast(message, duration, position, align) {
    if (typeof(position) != "undefined" && position != "") {
        position = "toast-" + position;
    } else {
        position = "";
    }
    if (typeof(align) != "undefined" && align != "") {
        align = "align-" + align;
    } else {
        align = "";
    }
    duration = duration || 3000;
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.setAttribute("class", "toast " + position + " " + align);
    m.innerHTML = message;
    document.body.appendChild(m);
    setTimeout(function() {
        m.setAttribute("class", "toast show " + position + " " + align);
        setTimeout(function() {
            m.setAttribute("class", "toast  " + position + " " + align);
            setTimeout(function() {
                document.body.removeChild(m);
            }, 300);
        }, duration);
    }, 100);
}

// jQuery
jQuery(document).ready(function($) {

    // swiper tab
    $(".tabbar-swiper .item").on('tap', function(e) {
        e.preventDefault();
        $(".tabbar-swiper .active").removeClass('active');
        $(this).addClass('active');
        tabbarSwiperContainer.slideTo($(this).index());
    });

    var tabbarSwiperContainer = new Swiper('.tabbar-swiper-container', {
        autoHeight: true,
        onSlideChangeStart: function() {
            $('.tabbar-swiper .active').removeClass('active');
            $('.tabbar-swiper .item').eq(tabbarSwiperContainer.activeIndex).addClass('active');
        }
    });

    // swiper overflow tab
    var tabbarOverflowSwiper = new Swiper('.tabbar-overflow-swiper', {
        slidesPerView: 3,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        onTap: function() {
            tabbarOverflowSwiperContainer.slideTo(tabbarOverflowSwiper.clickedIndex);
        }
    });

    var tabbarOverflowSwiperContainer = new Swiper('.tabbar-overflow-swiper-container', {
        onSlideChangeStart: function() {
            updateNavPosition();
        }
    });

    function updateNavPosition() {
        $('.tabbar-overflow-swiper .active').removeClass('active')
        var activeNav = $('.tabbar-overflow-swiper .swiper-slide').eq(tabbarOverflowSwiperContainer.activeIndex).addClass('active');
        if (!activeNav.hasClass('swiper-slide-visible')) {
            if (activeNav.index() > tabbarOverflowSwiper.activeIndex) {
                var thumbsPerNav = Math.floor(tabbarOverflowSwiper.width / activeNav.width()) - 1
                tabbarOverflowSwiper.slideTo(activeNav.index() - thumbsPerNav)
            } else {
                tabbarOverflowSwiper.slideTo(activeNav.index())
            }
        }
    };

    // 链接嵌套 fix
    $('.list-button-group .button').on("tap", function(e) {
        e.stopPropagation();
    });

    // searchbar
    $('.searchbar .search').focus(function() {
        $('.searchbar .icon-search').addClass('focus');
        $(this).blur(function() {
            $('.searchbar .icon-search').removeClass('focus');
        })
    })

    // button
    $('.button').on('tap', function() {
        $(this).removeClass('active').addClass('active');
        var set = setTimeout(function() {
            $('.button').removeClass('active');
        }, 100)
    });

    // button wave
    $('.button-wave').on("tap", function() {
        $(this).removeClass('wave').addClass('wave');
        var set = setTimeout(function() {
            $('.button-wave').removeClass('wave');
        }, 500)
    });

    // label
    $('.label-cancel').on('tap', function() {
        $(this).removeClass('active').addClass('active');
        var set = setTimeout(function() {
            $('.label-cancel').removeClass('active');
        }, 100)
    });

    // image lazyload
    $('img.lazyload').lazyload({
        container: $('.scroller'),
        threshold: 200,
        effect: 'fadeIn'
    });

    // radio
    $('label.item').on('tap', function() {
        $(this).siblings(':radio').prop('checked', false);
        $(this).find(':radio').prop('checked', true);
    });

    // fly
    var resetOffset = function() {
        var offset = $("#cart").offset();
        if (offset == null) {
            return;
        }
        if ($(window).height() < offset.top) {
            offset.top = $("#cart").offset().top - $(document).scrollTop();
        }
        return offset;
    }
    var offset = resetOffset();
    window.onresize = function() {
        offset = resetOffset(offset);
    }
    $(".add-cart").on('tap', function(event) {
        var flag = false;
        var addCart = $(this);
        var flyer = $('<div class="flyer"></div>');
        flyer.fly({
            speed: 1.2,
            start: {
                left: event.clientX - 25,
                top: event.clientY - 25
            },
            end: {
                left: offset.left + 12,
                top: offset.top + 12,
                width: 0,
                height: 0
            },
            onEnd: function() {
                var i = parseInt($("#cart-badge").html());
                $("#cart-badge").html(i + 1);
                $("#cart-badge").addClass('animated bounceIn').one('webkitAnimationEnd animationend', function() {
                    $(this).removeClass('animated bounceIn');
                });
            }
        });
    });

});
