"use strict";

const initLazyLoad = () => {
    const lazyItems = document.querySelectorAll('[data-lozad]');

    if (!lazyItems) return;

    lazyItems.forEach(item => {
        const lazyObserver = lozad(item);

        lazyObserver.observe();
    })
}

const initHeader = () => {
    const header = document.querySelector('.site-header');

    if (!header) return;

    setPaddingForPage();
    animateHeader();
    setScrollingHeader();

    function setScrollingHeader() {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;

            if (scrollTop > 0) {
                header.classList.add('is-scrolling');
            } else {
                header.classList.remove('is-scrolling');
            }
        })
    }

    function animateHeader() {
        let lastScrollTop;

        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop !== 0) {
                header.classList.add('is-scroll-down');
            } else {
                header.classList.remove('is-scroll-down');
            }

            lastScrollTop = scrollTop;
        })
    }

    function setPaddingForPage() {
        const page = document.querySelector('.page');

        if (!page) return;

        page.style.paddingTop = `${header.clientHeight - 1}px`;
    }
}

const initAdvertismentSlider = () => {
    const advertismentSliderNode = document.querySelector('.advertisments__slider');

    if (!advertismentSliderNode) return;

    const advertismentSiderPrev = advertismentSliderNode.closest('section').querySelector('.arrow--prev');
    const advertismentSiderNext = advertismentSliderNode.closest('section').querySelector('.arrow--next');

    const options = {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 24,
        speed: 1000,
        navigation: {
            prevEl: advertismentSiderPrev,
            nextEl: advertismentSiderNext,
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                centeredSlides: true,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 24
            },
            992: {
                slidesPerView: 3,
            }
        }
    }

    const advertismentsSlider = new Swiper(advertismentSliderNode, options);
}

const initEventsSlider = () => {
    const eventsSliderNode = document.querySelector('.events__slider');

    if (!eventsSliderNode) return;

    const eventsSiderPrev = eventsSliderNode.closest('section').querySelector('.arrow--prev');
    const eventsSiderNext = eventsSliderNode.closest('section').querySelector('.arrow--next');

    const options = {
        loop: true,
        slidesPerView: 2,
        spaceBetween: 24,
        speed: 1000,
        navigation: {
            prevEl: eventsSiderPrev,
            nextEl: eventsSiderNext,
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                centeredSlides: true,
                spaceBetween: 16
            },
            768: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 24
            },
        }
    }

    const eventsSlider = new Swiper(eventsSliderNode, options);
}

const initSelectors = () => {
    const selectors = document.querySelectorAll('.selector');

    if (!selectors) return;

    selectors.forEach(selector => {
        new Selector(selector);
    })
}

const observeStickyElements = () => {
    const stickyElements = document.querySelectorAll('[data-sticky]');
    const header = document.querySelector('.site-header');

    if (!header && !stickyElements) return;

    const observer = new MutationObserver(observeSticky);

    observer.observe(header, {
        attributes: true,
    });

    function observeSticky(mutations) {
        mutations.forEach(mutation => {
            if (header.classList.contains('is-scroll-down')) {
                stickyElements.forEach(element => {
                    element.style.top = ``;
                })
            } else {
                stickyElements.forEach(element => {
                    element.style.top = `${header.clientHeight + 24}px`;
                })
            }
        })
    }
}

const initTabs = () => {
    const tabsContainers = document.querySelectorAll('[data-tabs]');

    if (!tabsContainers);

    tabsContainers.forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('[data-tab]');
        const tabcontents = tabContainer.querySelectorAll('[data-tabcontent]');

        tabs.forEach(tab => {
            const tabValue = tab.dataset.tab;

            tab.addEventListener('click', () => {
                const tabTabcontent = findTabTabcontent(tabValue);

                removeActiveClasses(tabs);
                removeActiveClasses(tabcontents);

                tab.classList.add('is-active');
                tabTabcontent.classList.add('is-active');

                if (AOS) {
                    AOS.init();
                }
            })
        })


        function findTabTabcontent(value) {
            const tabTabcontent = Array.from(tabcontents).find(tabcontent => tabcontent.dataset.tabcontent === value);

            return tabTabcontent;
        }

        function removeActiveClasses(array) {
            array.forEach(item => item.classList.remove('is-active'));
        }
    })

}

function initPopups() {
    const overlay = document.querySelector(".overlay");

    if (!overlay) return;

    initCloseModalsOnClickOverlay();

    const popups = document.querySelectorAll("[data-popup]");
    const popupBtns = document.querySelectorAll("[data-popup-btn]");

    if (!popupBtns) return;

    popupBtns.forEach((btn) => {
        const popup = overlay.querySelector(`[data-popup=${btn.dataset.popupBtn}]`);

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(popup);
        });
    });

    popups.forEach((popup) => {
        const popupCloses = popup.querySelectorAll("[data-popup-close]");

        if (popupCloses) {
            popupCloses.forEach((close) => {
                close.addEventListener("click", (e) => {
                    closeModal(popup);
                });
            });
        }
    });

    function openModal(popup) {
        overlay.classList.remove("is-hidden");
        popup.classList.remove("is-hidden");
        document.body.classList.add("lock");
    }

    function closeModal(popup) {
        overlay.classList.add("is-hidden");
        popup.classList.add("is-hidden");
        document.body.classList.remove("lock");
    }

    function initCloseModalsOnClickOverlay() {
        const overlayChilds = Array.from(overlay.querySelectorAll("*"));

        overlay.addEventListener("click", (e) => {
            const { target } = e;

            if (!contains(overlayChilds, target)) {
                if (popups) {
                    popups.forEach((popup) => {
                        closeModal(popup);
                        refreshModal(popup);
                    });
                }
                document.body.classList.remove("lock");
                overlay.classList.remove("is-visible");
            }
        });
    }
}

const initAos = () => {
    if (AOS) {
        AOS.init();
    }
}

const initBurgerMenu = () => {
    const burger = document.querySelector(".burger");
    const header = document.querySelector('.site-header');
    const headerPanel = header?.querySelector(".site-header__panel");

    if (!burger || !headerPanel || !header) return;

    if (window.matchMedia('(max-width: 1200ox)').matches) {
        setHeightHeaderPanel();
        setTopHeaderPanel();
    }

    burger.addEventListener("click", (e) => {
        header.classList.toggle('is-burger-open');
        burger.classList.toggle('is-active');
        headerPanel.classList.toggle("is-active");
        document.body.classList.toggle("lock");
    });

    function setHeightHeaderPanel() {
        headerPanel.style.height = `${window.innerHeight - header.clientHeight}px`;
    }

    function setTopHeaderPanel() {
        headerPanel.style.top = `${header.clientHeight}px`;
    }
}

function initPhoneMask() {
    [].forEach.call(document.querySelectorAll('[type="tel"]'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);

            var pos = this.selectionStart;

            if (pos < 3) event.preventDefault();

            var matrix = "+49 (_) ___-__-___-_",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });
}

const initAnchors = () => {
    const anchors = document.querySelectorAll('[data-anchor]')

    if (!anchors) return;

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()

            const blockID = anchor.getAttribute('href').substr(1)

            document.getElementById(blockID).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    })
}


window.addEventListener("DOMContentLoaded", (e) => {
    initAnchors();
    initBurgerMenu();
    initLazyLoad();
    initHeader();
    initAdvertismentSlider();
    initEventsSlider();
    initSelectors();
    initTabs();
    initPopups();
    initAos();
    initPhoneMask();
    observeStickyElements();
});
