// SCRIPT.JS — UI Logic & Interactions
// Muhammad Hafeez Portfolio

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENT REFERENCES
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const sidebarClose = document.getElementById("sidebarClose");
  const navbar = document.getElementById("navbar");
  const cursorGlow = document.querySelector(".cursor-glow");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sidebarLinks = document.querySelectorAll("[data-close-sidebar]");
  const sections = document.querySelectorAll("section[id]");

  /* ===========================================================
     MOBILE SIDEBAR — open / close / overlay
  =========================================================== */

  function openSidebar() {
    if (!sidebar || !sidebarOverlay || !hamburger) return;

    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
    document.body.classList.add("sidebar-open");

    hamburger.setAttribute("aria-expanded", "true");
    sidebar.removeAttribute("aria-hidden");
    hamburger.classList.add("open");

    if (sidebarClose) sidebarClose.focus();
  }

  function closeSidebar() {
    if (!sidebar || !sidebarOverlay || !hamburger) return;

    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
    document.body.classList.remove("sidebar-open");

    hamburger.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("open");

    hamburger.focus();
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = sidebar && sidebar.classList.contains("open");
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("open")) {
      closeSidebar();
    }
  });

  /* ===========================================================
     NAVBAR — scroll shadow + active section highlighting
  =========================================================== */

  function handleNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  function initActiveNavHighlight() {
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navLinks.forEach((a) => a.classList.remove("active"));

            const activeLink = document.querySelector(
              `.nav-links a[href="#${id}"]`
            );

            if (activeLink) activeLink.classList.add("active");

            document.querySelectorAll(".sidebar-link").forEach((sl) => {
              sl.classList.remove("active");
            });

            document
              .querySelectorAll(`.sidebar-link[href="#${id}"]`)
              .forEach((l) => {
                l.classList.add("active");
              });
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });

  handleNavbarScroll();
  initActiveNavHighlight();

  /* ===========================================================
     CURSOR GLOW — follows the mouse pointer
  =========================================================== */

  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateGlow() {
      cursorGlow.style.left = mouseX + "px";
      cursorGlow.style.top = mouseY + "px";
      requestAnimationFrame(updateGlow);
    }

    requestAnimationFrame(updateGlow);
  }

  /* ===========================================================
     CONTACT FORM — Netlify Forms AJAX submit
     Page reload nahi hoga, data Netlify Forms main chala jayega
  =========================================================== */

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector("[type='submit']");
      const originalText = submitBtn
        ? submitBtn.textContent
        : "Send Project Request";

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        if (formSuccess) {
          formSuccess.classList.add("visible");
          formSuccess.innerHTML =
            "<span>✦</span> Thanks! Your request has been received. I'll be in touch soon.";
        }

        contactForm.reset();

        setTimeout(() => {
          if (formSuccess) formSuccess.classList.remove("visible");
        }, 6000);
      } catch (error) {
        if (formSuccess) {
          formSuccess.classList.add("visible");
          formSuccess.innerHTML =
            "<span>!</span> Something went wrong. Please try again or contact me on WhatsApp.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  /* ===========================================================
     BUTTON PRESS EFFECT
  =========================================================== */

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.96)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  console.log("[script.js] ✦ UI interactions initialized");
});
