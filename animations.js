
// Wait for DOM to be fully ready before touching anything
document.addEventListener("DOMContentLoaded", () => {
 
  // -------------------------------------------------------
  // 1. GSAP + SCROLLTRIGGER SETUP
  // -------------------------------------------------------
 
  // If GSAP somehow didn't load (CDN failure, ad-blocker, etc.),
  // gracefully reveal everything and bail out early.
  if (typeof gsap === "undefined") {
    console.warn("[animations.js] GSAP not found — showing all elements without animation.");
    document.body.classList.add("no-gsap");
    return;
  }
 
  // Register the ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger);
 
  // Global defaults — keeps individual tweens cleaner
  gsap.defaults({
    ease: "power3.out",
    duration: 0.85,
  });
 
  // 2. HERO ENTRANCE SEQUENCE
  // Plays once on page load — staged reveal of each element
 
  const heroTimeline = gsap.timeline({ delay: 0.2 });
 
  // Eyebrow badge drops in first
  heroTimeline
    .from(".hero-eyebrow", {
      opacity: 0,
      y: 22,
      duration: 0.6,
    })
 
    // Heading follows with a slight vertical slide
    .from(".hero-heading", {
      opacity: 0,
      y: 36,
      duration: 0.8,
      ease: "power4.out",
    }, "-=0.3")
 
    // Subtext fades in underneath
    .from(".hero-subtext", {
      opacity: 0,
      y: 24,
      duration: 0.7,
    }, "-=0.5")
 
    // CTAs pop in side by side with a gentle stagger
    .from(".hero-actions .btn", {
      opacity: 0,
      y: 18,
      scale: 0.95,
      duration: 0.55,
      stagger: 0.1,
      ease: "back.out(1.4)",
    }, "-=0.4")
 
    // Social proof numbers fade up last
    .from(".proof-item, .proof-divider", {
      opacity: 0,
      y: 14,
      stagger: 0.08,
      duration: 0.5,
    }, "-=0.35")
 
    // Hero visual card sweeps in from the right with slight rotation
    .from(".hero-visual", {
      opacity: 0,
      x: 60,
      rotation: -2,
      duration: 1.0,
      ease: "power3.out",
    }, "<-=0.7");
 
  // -------------------------------------------------------
  // 3. MARQUEE TOOL CARDS — fade in after hero
  // -------------------------------------------------------
 
  gsap.from(".tool-card", {
    opacity: 0,
    y: 20,
    stagger: 0.05,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".stack-wrap",
      start: "top 85%",
    },
  });
 
 // -------------------------------------------------------
  // 4. SECTION REVEALS — .gs-reveal elements
  // -------------------------------------------------------
  document.querySelectorAll(".gs-reveal").forEach((el) => {
    // Force transform to 'none' via GSAP so the raw CSS transform doesn't clash
    gsap.set(el, { clearProps: "transform" });

    gsap.fromTo(el, 
      { opacity: 0, y: 30 }, // Starting point matching your CSS
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",   
          once: true,         
        },
      }
    );
  });
 
  // -------------------------------------------------------
  // 5. STAGGER GRIDS — .gs-stagger containers
  // -------------------------------------------------------
  document.querySelectorAll(".gs-stagger").forEach((container) => {
    const children = container.children;
    
    // Clear out hard CSS transforms on children before animating
    gsap.set(children, { clearProps: "transform" });

    gsap.fromTo(children,
      { opacity: 0, y: 25 }, // Starting point matching your CSS
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,         
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      }
    );
  });
  // -------------------------------------------------------
  // 6. PROJECT IMAGE PARALLAX
  // Images inside project cards drift slightly on scroll
  // for a premium depth effect
  // -------------------------------------------------------
 
  document.querySelectorAll(".project-image img").forEach((img) => {
    gsap.fromTo(img,
      { yPercent: -8 },   // starts slightly shifted up
      {
        yPercent: 8,      // ends slightly shifted down
        ease: "none",     // linear parallax feels natural
        scrollTrigger: {
          trigger: img.closest(".project-card"),
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,     // scrub ties animation to scroll position
        },
      }
    );
  });
 
  // -------------------------------------------------------
  // 7. SERVICE CARD HOVER TILT (3D micro-interaction)
  // Cards subtly tilt towards the cursor direction on hover
  // -------------------------------------------------------
 
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect   = card.getBoundingClientRect();
      const xRel   = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to +0.5
      const yRel   = (e.clientY - rect.top)  / rect.height - 0.5;
 
      gsap.to(card, {
        rotateY: xRel * 6,    // max ±3° horizontal tilt
        rotateX: -yRel * 4,   // max ±2° vertical tilt
        transformOrigin: "center center",
        duration: 0.4,
        ease: "power2.out",
      });
    });
 
    // Reset tilt when the cursor leaves
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
 
  // -------------------------------------------------------
  // 8. CTA SECTION ENTRANCE
  // The purple banner punches in with a scale-up effect
  // -------------------------------------------------------
 
  gsap.from(".cta", {
    opacity: 0,
    scale: 0.96,
    y: 40,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".cta",
      start: "top 80%",
      once: true,
    },
  });
 
  // CTA decorative blobs slowly drift for a living background feel
  gsap.to(".cta-blob--tl", {
    x: 30,
    y: 20,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
 
  gsap.to(".cta-blob--br", {
    x: -20,
    y: -30,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
 
  // -------------------------------------------------------
  // 9. PROCESS CARD NUMBER REVEAL
  // Step numbers scale in from small — satisfying entrance
  // -------------------------------------------------------
 
  document.querySelectorAll(".process-num").forEach((num, index) => {
    gsap.from(num, {
      opacity: 0,
      scale: 0.6,
      duration: 0.5,
      delay: index * 0.08,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: num.closest(".process-card"),
        start: "top 85%",
        once: true,
      },
    });
  });
 
  // -------------------------------------------------------
  // 10. BENEFIT STAT COUNTER ANIMATION
  // The big numbers (24/7, Less, More) animate on entry
  // -------------------------------------------------------
 
  document.querySelectorAll(".benefit-stat").forEach((stat) => {
    gsap.from(stat, {
      opacity: 0,
      y: 28,
      scale: 0.85,
      duration: 0.7,
      ease: "back.out(1.6)",
      scrollTrigger: {
        trigger: stat,
        start: "top 85%",
        once: true,
      },
    });
  });
 
  // -------------------------------------------------------
  // 11. ABOUT SECTION — image slides in from left, text from right
  // -------------------------------------------------------
 
  gsap.from(".about-image", {
    opacity: 0,
    x: -50,
    duration: 1.0,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 78%",
      once: true,
    },
  });
 
  gsap.from(".about-copy", {
    opacity: 0,
    x: 50,
    duration: 1.0,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 78%",
      once: true,
    },
  });
 
  // About specialty points stagger in
  gsap.from(".about-point", {
    opacity: 0,
    y: 16,
    scale: 0.97,
    stagger: 0.1,
    duration: 0.55,
    ease: "back.out(1.4)",
    scrollTrigger: {
      trigger: ".about-points",
      start: "top 85%",
      once: true,
    },
  });
 
  // -------------------------------------------------------
  // 12. CONTACT SECTION — form and box slide in from sides
  // -------------------------------------------------------
 
  gsap.from(".contact-form", {
    opacity: 0,
    x: -40,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-grid",
      start: "top 80%",
      once: true,
    },
  });
 
  gsap.from(".contact-box", {
    opacity: 0,
    x: 40,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-grid",
      start: "top 80%",
      once: true,
    },
  });
 
  // -------------------------------------------------------
  // 13. FOOTER ENTRANCE
  // -------------------------------------------------------
 
  gsap.from(".footer-inner > *", {
    opacity: 0,
    y: 18,
    stagger: 0.12,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "footer",
      start: "top 90%",
      once: true,
    },
  });
 
  // -------------------------------------------------------
  // 14. SECTION EYEBROWS — subtle scale-in on entry
  // -------------------------------------------------------
 
  document.querySelectorAll(".section .eyebrow").forEach((eyebrow) => {
    gsap.from(eyebrow, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: eyebrow,
        start: "top 88%",
        once: true,
      },
    });
  });
 
  // -------------------------------------------------------
  // Let the console know animations are fully initialized
  // -------------------------------------------------------
  console.log("[animations.js] ✦ GSAP animations initialized");
 
}); // end DOMContentLoaded
 



