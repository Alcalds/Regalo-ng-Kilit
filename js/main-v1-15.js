/* =========================================================
   RNK FOUNDATION — HOMEPAGE V2 + HERO CONCEPT C
   Mobile navigation + Editorial Chapters hero
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");


/* ---------------------------------------------------------
   FLOATING HEADER — COMPACT AFTER INITIAL SCROLL
   Keeps the header visually aligned while reducing overlap
   with long-form content below the hero.
   --------------------------------------------------------- */

const siteHeader = document.getElementById("siteHeader");
let headerScrollTicking = false;
let lastHeaderScrollY = window.scrollY;

function syncHeaderScrollState() {
  if (!siteHeader) return;

  const currentY = window.scrollY;
  const delta = currentY - lastHeaderScrollY;
  const menuIsOpen = document.body.classList.contains("menu-open");

  siteHeader.classList.toggle("is-scrolled", currentY > 44);

  // Keep the navigation visible near the top and whenever the mobile menu is open.
  if (currentY < 110 || menuIsOpen) {
    siteHeader.classList.remove("is-hidden");
  } else if (delta > 6) {
    // Scrolling down: let photography and long-form sections use the full viewport.
    siteHeader.classList.add("is-hidden");
  } else if (delta < -6) {
    // Scrolling up: reveal the compact navigation immediately.
    siteHeader.classList.remove("is-hidden");
  }

  lastHeaderScrollY = currentY;
  headerScrollTicking = false;
}

if (siteHeader) {
  syncHeaderScrollState();
  window.addEventListener(
    "scroll",
    () => {
      if (headerScrollTicking) return;
      headerScrollTicking = true;
      window.requestAnimationFrame(syncHeaderScrollState);
    },
    { passive: true }
  );
}

/* ---------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------- */

function openMobileMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.classList.add("is-active");
  mobileNav.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  mobileNav.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeMobileMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.classList.remove("is-active");
  mobileNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileNav.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
    }
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

/* ---------------------------------------------------------
   HERO CONCEPT C — EDITORIAL CHAPTERS
   Quiet editorial interaction:
   - full-bleed authentic photography
   - one highlighted line of the approved tagline
   - one changing supporting sentence
   - a restrained four-chapter rail
   - slow autoplay, paused when the visitor engages
   --------------------------------------------------------- */

const editorialHero = document.querySelector(".editorial-hero");
const editorialMedia = document.getElementById("editorialMedia");
const editorialFrames = Array.from(document.querySelectorAll("[data-editorial-frame]"));
const editorialChapters = Array.from(document.querySelectorAll("[data-editorial-target]"));
const editorialLines = Array.from(document.querySelectorAll("[data-editorial-line]"));
const editorialDescription = document.getElementById("editorialDescription");

const EDITORIAL_SCENES = [
  {
    description: "Protecting habitat and biodiversity is the starting point for a healthier Calamianes."
  },
  {
    description: "Regenerative agriculture links healthier soil with nutritious food and resilient local production."
  },
  {
    description: "Across the Calamianes, conservation, tourism, livelihoods, and landscape stewardship move together."
  },
  {
    description: "Schools, young people, farmers, and communities turn conservation knowledge into shared local action."
  }
];

const EDITORIAL_INTERVAL = 9000;
let activeEditorialChapter = 0;
let editorialTimer = null;

function showEditorialChapter(index) {
  if (!editorialFrames.length) return;

  activeEditorialChapter = (index + editorialFrames.length) % editorialFrames.length;
  const scene = EDITORIAL_SCENES[activeEditorialChapter] || EDITORIAL_SCENES[0];

  editorialFrames.forEach((frame, frameIndex) => {
    const active = frameIndex === activeEditorialChapter;
    frame.classList.toggle("is-active", active);
    frame.setAttribute("aria-hidden", String(!active));
  });

  editorialChapters.forEach((chapter) => {
    const active = Number(chapter.dataset.editorialTarget) === activeEditorialChapter;
    chapter.classList.toggle("is-active", active);
    chapter.setAttribute("aria-pressed", String(active));
  });

  editorialLines.forEach((line) => {
    line.classList.toggle(
      "is-emphasized",
      Number(line.dataset.editorialLine) === activeEditorialChapter
    );
  });

  if (editorialHero) {
    editorialHero.dataset.chapter = String(activeEditorialChapter);
  }

  if (editorialDescription) {
    editorialDescription.classList.add("is-changing");
    window.setTimeout(() => {
      editorialDescription.textContent = scene.description;
      editorialDescription.classList.remove("is-changing");
    }, reducedMotionQuery.matches ? 0 : 140);
  }
}

function stopEditorialAutoplay() {
  if (!editorialTimer) return;
  window.clearInterval(editorialTimer);
  editorialTimer = null;
}

function startEditorialAutoplay() {
  stopEditorialAutoplay();
  if (reducedMotionQuery.matches || editorialFrames.length < 2) return;
  editorialTimer = window.setInterval(() => {
    showEditorialChapter(activeEditorialChapter + 1);
  }, EDITORIAL_INTERVAL);
}

if (editorialHero && editorialFrames.length) {
  showEditorialChapter(0);
  startEditorialAutoplay();

  editorialChapters.forEach((chapter) => {
    chapter.addEventListener("click", () => {
      showEditorialChapter(Number(chapter.dataset.editorialTarget));
      startEditorialAutoplay();
    });
  });

  editorialHero.addEventListener("mouseenter", stopEditorialAutoplay);
  editorialHero.addEventListener("mouseleave", startEditorialAutoplay);
  editorialHero.addEventListener("focusin", stopEditorialAutoplay);
  editorialHero.addEventListener("focusout", startEditorialAutoplay);

  editorialHero.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    if (!editorialHero.contains(document.activeElement)) return;
    event.preventDefault();
    showEditorialChapter(
      activeEditorialChapter + (event.key === "ArrowRight" ? 1 : -1)
    );
    startEditorialAutoplay();
  });

  const handleReducedMotionChange = () => {
    showEditorialChapter(0);
    startEditorialAutoplay();
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }
}

/* =========================================================
   HOMEPAGE V2 — BELOW-HERO ENHANCEMENTS
   ========================================================= */

const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

if (revealItems.length) {
  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const storyDialog = document.getElementById("storyDialog");
const storyDialogImage = document.getElementById("storyDialogImage");
const storyDialogClose = document.getElementById("storyDialogClose");
const scholarCards = Array.from(document.querySelectorAll(".scholar-card[data-full]"));

function closeStoryDialog() {
  if (storyDialog && storyDialog.open) storyDialog.close();
}

scholarCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!storyDialog || !storyDialogImage) return;
    storyDialogImage.src = card.dataset.full || "";
    storyDialogImage.alt = `Full testimonial poster of ${card.dataset.name || "RnK scholar"}`;
    if (typeof storyDialog.showModal === "function") storyDialog.showModal();
  });
});

if (storyDialogClose) storyDialogClose.addEventListener("click", closeStoryDialog);

if (storyDialog) {
  storyDialog.addEventListener("click", (event) => {
    if (event.target === storyDialog) closeStoryDialog();
  });
}


/* =========================================================
   V1.12 — CONTACT FORM PROTOTYPE BEHAVIOR
   No visitor data is stored by the VS Code prototype. Submitting opens the
   visitor's email application with the form content prefilled. The Wix Studio
   implementation should replace this handler with a native Wix Form.
   ========================================================= */

const inquiryForm = document.getElementById("inquiryForm");
const inquiryStatus = document.getElementById("inquiryStatus");

if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const requiredFields = Array.from(inquiryForm.querySelectorAll("[required]"));
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const invalid = !field.checkValidity();
      field.setAttribute("aria-invalid", String(invalid));
      if (invalid && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      if (inquiryStatus) inquiryStatus.textContent = "Please complete the required fields before sending your inquiry.";
      firstInvalid.focus();
      return;
    }

    const data = new FormData(inquiryForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const interest = String(data.get("interest") || "General Inquiry").trim();
    const message = String(data.get("message") || "").trim();

    const subject = `RnK website inquiry — ${interest}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Mobile: ${phone}` : "",
      organization ? `Organization / Affiliation: ${organization}` : "",
      `Interest: ${interest}`,
      "",
      message
    ].filter(Boolean).join("\n");

    if (inquiryStatus) inquiryStatus.textContent = "Your email application is being opened with this inquiry prepared for Regalo ng Kilit Foundation.";

    window.location.href = `mailto:regalongkilit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  inquiryForm.addEventListener("input", (event) => {
    const field = event.target;
    if (field && field.matches("input, select, textarea") && field.checkValidity()) {
      field.removeAttribute("aria-invalid");
    }
  });
}

/* =========================================================
   V1.14 — GET INVOLVED PARTICIPATION JOURNEY
   Path cards set the intended inquiry category, then take visitors to a
   short pathway explanation. "Start a conversation" buttons carry the same
   category into the contact form. Wix Studio equivalent: anchors + buttons
   + Wix Forms field preset/selection.
   ========================================================= */

const involvementRoutes = Array.from(document.querySelectorAll(".involvement-route[data-interest-target]"));
const inquiryRoutes = Array.from(document.querySelectorAll(".inquiry-route[data-interest-target]"));
const inquiryInterest = document.getElementById("inquiryInterest");
const inquiryName = document.getElementById("inquiryName");

function setInquiryInterest(interest) {
  if (!inquiryInterest || !interest) return false;
  const optionExists = Array.from(inquiryInterest.options).some(
    (option) => option.value === interest || option.textContent.trim() === interest
  );

  if (!optionExists) return false;
  inquiryInterest.value = interest;
  inquiryInterest.removeAttribute("aria-invalid");
  return true;
}

function highlightSelectedPath(interest) {
  document.querySelectorAll(".involvement-path").forEach((card) => {
    const route = card.querySelector("[data-interest-target]");
    card.classList.toggle("is-selected", Boolean(route && route.dataset.interestTarget === interest));
  });
}

involvementRoutes.forEach((link) => {
  link.addEventListener("click", () => {
    const interest = link.dataset.interestTarget || "";
    setInquiryInterest(interest);
    highlightSelectedPath(interest);
  });
});

if (inquiryRoutes.length && inquiryForm && inquiryInterest) {
  inquiryRoutes.forEach((button) => {
    button.addEventListener("click", () => {
      const interest = button.dataset.interestTarget || "";
      setInquiryInterest(interest);
      highlightSelectedPath(interest);

      if (inquiryStatus) {
        inquiryStatus.textContent = interest
          ? `${interest} selected. Add your contact details and message below.`
          : "Add your contact details and message below.";
      }

      inquiryForm.scrollIntoView({
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
        block: "center"
      });

      window.setTimeout(() => {
        if (inquiryName) inquiryName.focus({ preventScroll: true });
      }, reducedMotionQuery.matches ? 0 : 420);
    });
  });
}
