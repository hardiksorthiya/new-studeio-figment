// swipe slider


    // HERO SLIDER
    var menu = [];
    jQuery('.swiper-slide').each( function(index){
        menu.push( jQuery(this).find('.slide-inner').attr("data-text") );
    });
    var interleaveOffset = 0.5;
    var swiperOptions = {
        loop: true,
        speed: 1000,
        parallax: true,
        autoplay: {
            delay: 6500,
            disableOnInteraction: false,
        },
        watchSlidesProgress: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        on: {
            progress: function() {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    var slideProgress = swiper.slides[i].progress;
                    var innerOffset = swiper.width * interleaveOffset;
                    var innerTranslate = slideProgress * innerOffset;
                    swiper.slides[i].querySelector(".slide-inner").style.transform =
                    "translate3d(" + innerTranslate + "px, 0, 0)";
                }      
            },

            touchStart: function() {
              var swiper = this;
              for (var i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].style.transition = "";
              }
            },

            setTransition: function(speed) {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    swiper.slides[i].style.transition = speed + "ms";
                    swiper.slides[i].querySelector(".slide-inner").style.transition =
                    speed + "ms";
                }
            }
        }
    };

    var swiper = new Swiper(".swiper-container", swiperOptions);

    // DATA BACKGROUND IMAGE
    var sliderBgSetting = $(".slide-bg-image");
    sliderBgSetting.each(function(indx){
        if ($(this).attr("data-background")){
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });





    // cursor

    const cursor = document.querySelector("#cursor");
    const cursorBorder = document.querySelector("#cursor-border");
    const cursorPos = { x: 0, y: 0 };
    const cursorBorderPos = { x: 0, y: 0 };
    
    document.addEventListener("mousemove", (e) => {
      cursorPos.x = e.clientX;
      cursorPos.y = e.clientY;
    
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    
    requestAnimationFrame(function loop() {
      const easting = 8;
      cursorBorderPos.x += (cursorPos.x - cursorBorderPos.x) / easting;
      cursorBorderPos.y += (cursorPos.y - cursorBorderPos.y) / easting;
    
      cursorBorder.style.transform = `translate(${cursorBorderPos.x}px, ${cursorBorderPos.y}px)`;
      requestAnimationFrame(loop);
    });
    
    document.querySelectorAll("[data-cursor]").forEach((item) => {
      item.addEventListener("mouseover", (e) => {
        if (item.dataset.cursor === "pointer") {
          cursorBorder.style.backgroundColor = "rgba(255, 255, 255, .6)";
          cursorBorder.style.setProperty("--size", "30px");
        }
        if (item.dataset.cursor === "pointer2") {
          cursorBorder.style.backgroundColor = "white";
          cursorBorder.style.mixBlendMode = "difference";
          cursorBorder.style.setProperty("--size", "80px");
        }
        if (item.dataset.cursor === "pointer3") {
          cursorBorder.style.backgroundColor = "black";
      cursorBorder.classList.add('drag-pointer');
      cursorBorder.style.setProperty("--size", "60px");
        }
        if (item.dataset.cursor === "pointer4") {
          cursor.style.backgroundColor = "white";
          cursorBorder.style.border = "1px solid white";
      cursorBorder.style.setProperty("--size", "60px");
        }
      });
      item.addEventListener("mouseout", (e) => {
        cursorBorder.style.backgroundColor = "unset";
        cursor.style.backgroundColor = "unset";
        cursorBorder.style.border = "unset";
        cursorBorder.style.mixBlendMode = "unset";
        cursorBorder.style.setProperty("--size", "50px");
        cursorBorder.classList.remove('drag-pointer');
      });
    });
    



    // about carousle

    class Carousel {
      element = null;
      buttonDisabled = false;
      nav = null;
      items = [];
      size = 3; // number of items to show
      gap = 100; // in px
      activeClass = true;
      itemProps = {
        width: 10,
        left: 0
      };
    
      constructor(element) {
        this.element = element;
        this.items = document.querySelectorAll(".carousel__item");
        this.nav = element.parentElement.querySelectorAll(".carousel__nav__item");
        this.init();
      }
    
      async init() {
        await this.setMinItems();
    
        this.itemProps.width = await this.getSize();
        this.element.style.height = this.items[0].clientHeight + "px";
    
        // Add event listener to buttons
        for (let i = 0; i < this.nav.length; i++) {
          let currentNavElement = this.nav[i];
          this.nav[i].addEventListener("click", () =>
            this.moveHandler(currentNavElement)
          );
        }
    
        // update nodelist
        this.nav = this.element.parentElement.querySelector(".carousel__nav");
        await this.build();
      }
    
      async setMinItems() {
        const minItems = this.size + 2;
        if (this.items.length < minItems) {
          let currentLength = this.items.length;
          for (let i = 0; i < currentLength; i++) {
            let clonedItem = this.items[i].cloneNode(true);
            this.element.append(clonedItem);
          }
          this.items = document.querySelectorAll(".carousel__item");
        }
      }
    
      async getSize() {
        let totalSpacing = this.gap * (this.size - 1); // no need to space for last element
        let width = this.element.clientWidth - totalSpacing; // width without scrollbar
        width = width / this.size;
    
        return width;
      }
    
      async build() {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].style.width = this.itemProps.width + "px";
          // (i - 1) so we start with second item and get clean animation (hides shifting)
          this.items[i].style.left =
            (this.itemProps.width + this.gap) * (i - 1) + "px";
        }
        if (this.activeClass) {
          this.setActiveClass();
        }
    
        this.toString(this.items);
      }
    
      async move(pos) {
        let item = 0;
    
        // Assign cloned item
        if (pos === "next") {
          item = this.items[0];
        } else {
          item = this.items[this.items.length - 1];
        }
    
        let clonedItem = item.cloneNode(true);
    
        if (pos === "next") {
          this.element.append(clonedItem);
        } else {
          this.element.prepend(clonedItem);
        }
        item.remove();
        // Since NodeList and static update it
        this.items = document.querySelectorAll(".carousel__item");
      }
    
      async next() {
        this.move("next");
        this.build();
      }
    
      async prev() {
        this.move("prev");
        this.build();
      }
    
      async setActiveClass() {
        let mean = Math.round(this.size / 2);
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].classList.remove("carousel__item--active");
          if (i === mean) {
            this.items[i].classList.add("carousel__item--active");
          }
        }
      }
    
      async moveHandler(element) {
        if (!this.buttonDisabled) {
          // Disabled button to prevent spam clicking
          this.buttonDisabled = true;
          let direction = element.getAttribute("data-direction");
          if (direction === "next") {
            this.next();
          } else {
            this.prev();
          }
          setTimeout(() => (this.buttonDisabled = false), 800);
        }
      }
    }
    
    const element = document.querySelector(".carousel");
    new Carousel(element);



    // carosule in work

    $('.owl-carousel').owlCarousel({
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      loop: true,
      margin: 50,
      responsiveClass: true,
      nav: true,
      loop: true,
      stagePadding: 100,
      responsive: {
        0: {
          items: 1
        },
        568: {
          items: 2
        },
        600: {
          items: 3
        },
        1000: {
          items: 3
        }
      }
    })
    $(document).ready(function() {
      $('.popup-youtube').magnificPopup({
        disableOn: 320,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: true
      });
    });
    $('.item').magnificPopup({
      delegate: 'a',
    });





    // page transition



    function delay(n) {
      n = n || 2000;
      return new Promise((done) => {
          setTimeout(() => {
              done();
          }, n);
      });
  }
  
  function pageTransition() {
      var tl = gsap.timeline();
      tl.to(".loading-screen", {
          duration: 1.2,
          width: "100%",
          left: "0%",
          ease: "Expo.easeInOut",
      });
  
      tl.to(".loading-screen", {
          duration: 1,
          width: "100%",
          left: "100%",
          ease: "Expo.easeInOut",
          delay: 0.3,
      });
      tl.set(".loading-screen", { left: "-100%" });
  }
  
  function contentAnimation() {
      var tl = gsap.timeline();
      tl.from(".animate-this", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 0.2 });
  }
  
  $(function () {
      barba.init({
          sync: true,
  
          transitions: [
              {
                  async leave(data) {
                      const done = this.async();
  
                      pageTransition();
                      await delay(1000);
                      done();
                  },
  
                  async enter(data) {
                      contentAnimation();
                  },
  
                  async once(data) {
                      contentAnimation();
                  },
              },
          ],
      });
  });
  