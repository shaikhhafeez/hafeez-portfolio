  // SCRIPT.JS — UI Logic & Interactions
  //  Muhammad Hafeez Portfolio

  //  This file handles all non-animation JavaScript:
  //  — Mobile sidebar open/close
  //  — Body scroll lock while sidebar is open
  //  — Navbar scroll shadow + active link highlighting
  //  — Cursor glow tracker
  //  — Smooth scroll (polyfill helper)
  //  — Contact form submission handler
  //  — Keyboard accessibility (Escape key closes sidebar)

document.addEventListener("DOMContentLoaded", () => {

    //  ELEMENT REFERENCES  Grab everything once at the top — cleaner than repeatedquerySelector calls scattered through the file.

  const hamburger      = document.getElementById("hamburger");
  const sidebar        = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const sidebarClose   = document.getElementById("sidebarClose");
  const navbar         = document.getElementById("navbar");
  const cursorGlow     = document.querySelector(".cursor-glow");
  const contactForm    = document.getElementById("contactForm");
  const formSuccess    = document.getElementById("formSuccess");
  const navLinks       = document.querySelectorAll(".nav-links a");
  const sidebarLinks   = document.querySelectorAll("[data-close-sidebar]");
  const sections       = document.querySelectorAll("section[id]");


    //  MOBILE SIDEBAR — open / close / overlay

  // Open the sidebar drawer
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
    document.body.classList.add("sidebar-open");     // locks body scroll

    // Update ARIA attributes for screen readers
    hamburger.setAttribute("aria-expanded", "true");
    sidebar.removeAttribute("aria-hidden");
    hamburger.classList.add("open");

    // Move focus into the sidebar for keyboard users
    sidebarClose.focus();
  }

  // Close the sidebar drawer
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
    document.body.classList.remove("sidebar-open");   // unlocks body scroll

    // Reset ARIA
    hamburger.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("open");

    // Return focus to hamburger so keyboard users aren't lost
    hamburger.focus();
  }

  // Toggle via hamburger button
  hamburger.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("open");
    isOpen ? closeSidebar() : openSidebar();
  });

  // Close via X button inside sidebar
  sidebarClose.addEventListener("click", closeSidebar);

  // Close when tapping the dim overlay behind the sidebar
  sidebarOverlay.addEventListener("click", closeSidebar);

  // Close when any sidebar nav link is clicked (auto-navigate)
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Close on Escape key — important for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });


  /* ===========================================================
     NAVBAR — scroll shadow + active section highlighting
  =========================================================== */

  // Add/remove scrolled class for box-shadow on scroll
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Highlight the nav link matching the currently visible section.
  // Uses IntersectionObserver for performance — no scroll event math.
  function initActiveNavHighlight() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            // Remove active from all links
            navLinks.forEach((a) => a.classList.remove("active"));

            // Add active to the matching link
            const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add("active");

            // Also update sidebar links to keep them in sync
            document.querySelectorAll(`.sidebar-link[href="#${id}"]`).forEach((l) => {
              document.querySelectorAll(".sidebar-link").forEach((sl) => sl.classList.remove("active"));
              l.classList.add("active");
            });
          }
        });
      },
      {
        // Section is "active" when its top half is visible
        rootMargin: "-40% 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Attach scroll listener (passive for performance)
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  // Run once on load so navbar state is correct if page was scrolled
  handleNavbarScroll();

  // Init active highlighting
  initActiveNavHighlight();


  /* ===========================================================
     CURSOR GLOW — follows the mouse pointer
     Only works on devices with a fine pointer (desktop)
  =========================================================== */

  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    // Use requestAnimationFrame for silky-smooth movement
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Apply position on animation frame to avoid layout thrashing
    function updateGlow() {
      cursorGlow.style.left = mouseX + "px";
      cursorGlow.style.top  = mouseY + "px";
      requestAnimationFrame(updateGlow);
    }

    requestAnimationFrame(updateGlow);
  }


    //  CONTACT FORM — validation + submit feedback
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic HTML5 validation check
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Simulate form submission (replace with real endpoint / Formspree / etc.)
      const submitBtn = contactForm.querySelector("[type='submit']");

      // Disable button and show loading state
      submitBtn.disabled    = true;
      submitBtn.textContent = "Sending…";

      // Fake async delay — remove this and replace with fetch() to your endpoint
      setTimeout(() => {
        // Show success message
        if (formSuccess) {
          formSuccess.classList.add("visible");
        }

        // Reset form fields
        contactForm.reset();

        // Re-enable button
        submitBtn.disabled    = false;
        submitBtn.textContent = "Send Project Request";

        // Auto-hide the success message after 6 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.classList.remove("visible");
        }, 6000);
      }, 900);
    });
  }


    //  BUTTON PRESS EFFECT — tactile scale-down on mousedown Adds a satisfying "click" feel to all buttons

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.96)";
    });

    btn.addEventListener("mouseup",   () => { btn.style.transform = ""; });
    btn.addEventListener("mouseleave",() => { btn.style.transform = ""; });
  });

    //  LOG — confirm script loaded cleanly

  console.log("[script.js] ✦ UI interactions initialized");

}); // end DOMContentLoaded

/* ============================================================
   Automation Preview GSAP Animation
============================================================ */

window.addEventListener("load", () => {
  if (typeof gsap === "undefined") return;

  const automationSection = document.querySelector(".automation-preview");
  const flowCards = document.querySelectorAll(".flow-card");
  const miniTags = document.querySelectorAll(".automation-mini-tags span");

  if (!automationSection) return;

  // gsap.from(".automation-preview", {
  //   opacity: 0,
  //   y: 70,
  //   scale: 0.96,
  //   duration: 1,
  //   ease: "power3.out",
  //   scrollTrigger: {
  //     trigger: ".automation-preview",
  //     start: "top 82%",
  //   },
  // });

  gsap.from(".automation-preview-head > *", {
    opacity: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.14,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".automation-preview",
      start: "top 78%",
    },
  });

  gsap.from(".automation-preview-text", {
    opacity: 0,
    y: 22,
    duration: 0.8,
    delay: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".automation-preview",
      start: "top 76%",
    },
  });

  gsap.from(flowCards, {
    opacity: 0,
    y: 55,
    scale: 0.92,
    rotateX: 8,
    duration: 0.85,
    stagger: 0.13,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: ".automation-flow",
      start: "top 82%",
    },
  });

  gsap.from(miniTags, {
    opacity: 0,
    y: 18,
    duration: 0.65,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".automation-mini-tags",
      start: "top 90%",
    },
  });
});
