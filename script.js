
/* =========================================
   THE AIRA COLLECTIVE
   Gallery and navigation
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* MOBILE NAVIGATION */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        mainNav.classList.contains("is-open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ACTUAL PROPERTY PHOTOGRAPHS
     Paths match the converted jpg assets.
  */

  const photoBase = "assets/TheRusticSuite/";

  const photos = [
    // Living room and shared spaces: 9
    { file: "living01.jpg", category: "living", label: "Living space" },
    { file: "living02.jpg", category: "living", label: "Living space" },
    { file: "living03.jpg", category: "living", label: "Living space" },
    { file: "living04.jpg", category: "living", label: "Living space" },
    { file: "living05.jpg", category: "living", label: "Living space" },
    { file: "living06.jpg", category: "living", label: "Living space" },
    { file: "living07.jpg", category: "living", label: "Living space" },
    { file: "living08.jpg", category: "living", label: "Living space" },
    { file: "living09.jpg", category: "living", label: "Living space" },

    // Bedrooms and other room interiors: 15
    { file: "room01.jpg", category: "rooms", label: "Room interior" },
    { file: "room02.jpg", category: "rooms", label: "Room interior" },
    { file: "room03.jpg", category: "rooms", label: "Room interior" },
    { file: "room04.jpg", category: "rooms", label: "Room interior" },
    { file: "room04(1).jpg", category: "rooms", label: "Room detail" },
    { file: "room05.jpg", category: "rooms", label: "Room interior" },
    { file: "room06.jpg", category: "rooms", label: "Room interior" },
    { file: "room07.jpg", category: "rooms", label: "Room interior" },
    { file: "room08.jpg", category: "rooms", label: "Room interior" },
    { file: "room09.jpg", category: "rooms", label: "Room interior" },
    { file: "room10.jpg", category: "rooms", label: "Room interior" },
    { file: "room11.jpg", category: "rooms", label: "Room interior" },
    { file: "room12.jpg", category: "rooms", label: "Room interior" },
    { file: "room13.jpg", category: "rooms", label: "Room interior" },
    { file: "room14.jpg", category: "rooms", label: "Room interior" },

    // Bathrooms: 5
    { file: "bath01.jpeg", category: "bathrooms", label: "Bathroom" },
    { file: "bath02.jpeg", category: "bathrooms", label: "Bathroom" },
    { file: "bath03.jpeg", category: "bathrooms", label: "Bathroom" },
    { file: "bath04.jpeg", category: "bathrooms", label: "Bathroom" },
    { file: "bath05.jpeg", category: "bathrooms", label: "Bathroom" },

    // Private plunge pool: 3
    { file: "pool01.jpg", category: "pool", label: "Private plunge pool" },
    { file: "pool02.jpg", category: "pool", label: "Private plunge pool" },
    { file: "pool03.jpg", category: "pool", label: "Private plunge pool" },

    // Scenic bunker: 2
    { file: "bunk01.jpeg", category: "bunker", label: "Scenic bunker" },
    { file: "bunk02.jpeg", category: "bunker", label: "Scenic bunker" },

    // Staircase / architectural details: 1
    { file: "stairs.jpg", category: "details", label: "Interior detail" }
  ];

  const gallery = document.getElementById("propertyGallery");
  const galleryCount = document.getElementById("galleryCount");
  const filterButtons = document.querySelectorAll(".filter-button");

  const galleryItems = [];
  let activeFilter = "all";

  /* CREATE THE 35 GALLERY CARDS */

  function createGalleryCard(photo, index) {
    const figure = document.createElement("figure");
    figure.className = "gallery-card";
    figure.dataset.category = photo.category;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-photo";
    button.setAttribute(
      "aria-label",
      `Open photograph ${index + 1}: ${photo.label}`
    );

    const image = document.createElement("img");
    image.src = photoBase + photo.file;
    image.alt = `The Rustic Suite — ${photo.label.toLowerCase()}`;
    image.loading = index < 6 ? "eager" : "lazy";
    image.decoding = "async";

    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";
    placeholder.hidden = true;

    const placeholderTitle = document.createElement("strong");
    placeholderTitle.textContent = String(index + 1).padStart(2, "0");

    const placeholderLabel = document.createElement("span");
    placeholderLabel.textContent = "IMAGE NOT FOUND";

    placeholder.append(placeholderTitle, placeholderLabel);

    image.addEventListener("error", () => {
      image.hidden = true;
      placeholder.hidden = false;
    });

    image.addEventListener("load", () => {
      image.hidden = false;
      placeholder.hidden = true;
    });

    button.append(image, placeholder);

    const caption = document.createElement("figcaption");

    const label = document.createElement("span");
    label.textContent = photo.label;

    const number = document.createElement("span");
    number.className = "gallery-number";
    number.textContent = `${String(index + 1).padStart(2, "0")} / 35`;

    caption.append(label, number);
    figure.append(button, caption);

    const item = { figure, button, image, photo, index };
    galleryItems.push(item);

    button.addEventListener("click", () => openLightbox(item));

    return figure;
  }

  if (gallery) {
    const fragment = document.createDocumentFragment();

    photos.forEach((photo, index) => {
      fragment.appendChild(createGalleryCard(photo, index));
    });

    gallery.appendChild(fragment);
  }

  /* FILTER PHOTOS */

  function applyFilter(filter) {
    activeFilter = filter;

    let visibleCount = 0;

    galleryItems.forEach(({ figure, photo }) => {
      const visible = filter === "all" || photo.category === filter;

      figure.classList.toggle("is-hidden", !visible);

      if (visible) visibleCount++;
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (galleryCount) {
      galleryCount.textContent =
        filter === "all"
          ? `All ${visibleCount} photographs`
          : `${visibleCount} photographs`;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyFilter(button.dataset.filter);
    });
  });

  applyFilter("all");

  /* LIGHTBOX */

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentItem = null;
  let previousFocus = null;

  function visibleItems() {
    return galleryItems.filter(
      ({ figure }) => !figure.classList.contains("is-hidden")
    );
  }

  function openLightbox(item) {
    if (!lightbox || !lightboxImage) return;

    currentItem = item;
    previousFocus = document.activeElement;

    lightboxImage.src = item.image.src;
    lightboxImage.alt = item.image.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent =
        `${item.photo.label.toUpperCase()} · ` +
        `${String(item.index + 1).padStart(2, "0")} / 35`;
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }

    currentItem = null;
  }

  function moveLightbox(direction) {
    if (!currentItem) return;

    const items = visibleItems();
    const currentPosition = items.indexOf(currentItem);

    if (currentPosition < 0 || items.length < 2) return;

    const nextPosition =
      (currentPosition + direction + items.length) % items.length;

    openLightbox(items[nextPosition]);
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => moveLightbox(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => moveLightbox(1));
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });

  /* CURRENT YEAR */

  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});