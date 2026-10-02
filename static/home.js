document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const yearSlot = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

if (yearSlot) {
    yearSlot.textContent = new Date().getFullYear();
}

function setTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;

    if (themeLabel) {
        themeLabel.textContent = nextTheme === "dark" ? "Light" : "Dark";
    }

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
    }

    if (themeMeta) {
        const background = getComputedStyle(document.body).getPropertyValue("--paper").trim();
        themeMeta.setAttribute("content", background || (nextTheme === "dark" ? "#0b1118" : "#f7f3ea"));
    }

    try {
        localStorage.setItem("theme", nextTheme);
    } catch (error) {
        // Ignore storage failures in restricted contexts.
    }
}

function initTheme() {
    const initialTheme = document.documentElement.dataset.theme || "dark";
    setTheme(initialTheme);

    themeToggle?.addEventListener("click", () => {
        setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
}

function updateHeader() {
    if (!header || header.classList.contains("is-solid")) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isExternalUrl(url) {
    return /^https?:\/\//i.test(url);
}

function renderAcademicLinks(links = []) {
    return links
        .map((link) => {
            if (!link.url || link.url === "#") {
                return `<span>${escapeHtml(link.label || "pending")}</span>`;
            }

            const url = escapeHtml(link.url || "#");
            const label = escapeHtml(link.label || "Link");
            const target = isExternalUrl(link.url || "") ? ' target="_blank" rel="noreferrer"' : "";
            return `<a href="${url}"${target}>${label}</a>`;
        })
        .join("");
}

function initReveal(root = document) {
    const selector = [
        ".intro-grid > *",
        ".section-heading",
        ".route-card",
        ".focus-card",
        ".contact-grid > *",
        ".academic-block",
        ".research-item",
        ".news-item",
        ".academic-current-item",
        ".publication-item",
        ".resource-link",
        ".library-card",
        ".faq-item",
        ".note-grid > *",
        ".timeline-item",
        ".publication-box",
        ".profile-figure"
    ].join(", ");

    const revealTargets = Array.from(root.querySelectorAll(selector)).filter((target) => !target.dataset.revealBound);

    if (!revealTargets.length) {
        return;
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: "0px 0px -8% 0px",
                threshold: 0.12,
            }
        );

        revealTargets.forEach((target, index) => {
            target.dataset.revealBound = "true";
            target.classList.add("reveal-item");
            target.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 55, 275)}ms`);
            observer.observe(target);
        });
    } else {
        revealTargets.forEach((target) => {
            target.dataset.revealBound = "true";
            target.classList.add("reveal-item", "is-visible");
        });
    }
}

async function hydrateAcademicData() {
    const newsSlot = document.querySelector("[data-academic-news]");
    const publicationSlot = document.querySelector("[data-academic-publications]");

    if (!newsSlot && !publicationSlot) {
        return;
    }

    try {
        const response = await fetch("./static/data/academic.json", { cache: "no-store" });
        if (!response.ok) {
            return;
        }

        const data = await response.json();

        if (newsSlot && Array.isArray(data.news)) {
            newsSlot.innerHTML = data.news
                .map((item) => `
                    <article class="academic-current-item">
                        ${item.label ? `<span class="academic-current-label">${escapeHtml(item.label)}</span>` : ""}
                        <h3>${escapeHtml(item.title || item.date || "")}</h3>
                        <p>${escapeHtml(item.text || "")}</p>
                    </article>
                `)
                .join("");
            initReveal(newsSlot);
        }

        if (publicationSlot && Array.isArray(data.publications) && data.publications.length) {
            publicationSlot.innerHTML = data.publications
                .map((item) => `
                    <article class="publication-item">
                        <div class="publication-year">${escapeHtml(item.year || "")}</div>
                        <div>
                            <h3>${escapeHtml(item.title || "")}</h3>
                            ${item.authors ? `<p class="publication-authors">${escapeHtml(item.authors)}</p>` : ""}
                            <p>${escapeHtml(item.description || "")}</p>
                            <div class="publication-links">${renderAcademicLinks(item.links)}</div>
                        </div>
                    </article>
                `)
                .join("");
            initReveal(publicationSlot);
        }
    } catch (error) {
        // Local file previews may block fetch; the HTML fallback remains visible.
    }
}

function initAcademicMotion() {
    const progressBar = document.querySelector("[data-reading-progress]");
    const cover = document.querySelector(".academic-cover");
    const coverGrid = document.querySelector(".academic-cover-grid");

    if (!progressBar && !coverGrid) {
        return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameRequested = false;

    function updateAcademicMotion() {
        const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(Math.max(window.scrollY / scrollRange, 0), 1);

        if (progressBar) {
            progressBar.style.transform = `scaleX(${progress})`;
        }

        if (cover && coverGrid && !reduceMotion.matches) {
            const coverProgress = Math.min(Math.max(window.scrollY / Math.max(cover.offsetHeight, 1), 0), 1);
            coverGrid.style.setProperty("--academic-scroll-shift", `${coverProgress * 18}px`);
            cover.style.setProperty("--academic-overlay", String(0.08 + coverProgress * 0.18));
        }

        frameRequested = false;
    }

    function requestAcademicMotionUpdate() {
        if (frameRequested) {
            return;
        }

        frameRequested = true;
        window.requestAnimationFrame(updateAcademicMotion);
    }

    updateAcademicMotion();
    window.addEventListener("scroll", requestAcademicMotionUpdate, { passive: true });
    window.addEventListener("resize", requestAcademicMotionUpdate, { passive: true });
    reduceMotion.addEventListener?.("change", requestAcademicMotionUpdate);
}

function initCopyEmail() {
    if (!copyButton || !copyStatus) {
        return;
    }

    copyButton.addEventListener("click", async () => {
        const email = copyButton.dataset.copyEmail;

        try {
            await navigator.clipboard.writeText(email);
            copyStatus.textContent = "邮箱已复制";
        } catch (error) {
            copyStatus.textContent = email;
        }

        window.setTimeout(() => {
            copyStatus.textContent = "";
        }, 2400);
    });
}

function initLibraryFilters() {
    const library = document.querySelector("[data-library]");
    if (!library) {
        return;
    }

    const searchInput = library.querySelector("[data-library-search]");
    const filterButtons = Array.from(library.querySelectorAll("[data-library-filter]"));
    const cards = Array.from(library.querySelectorAll("[data-library-card]"));
    const emptyState = library.querySelector("[data-library-empty]");
    let activeFilter = "all";

    function applyFilters() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach((card) => {
            const categories = (card.dataset.category || "").split(/\s+/);
            const haystack = `${card.textContent} ${card.dataset.keywords || ""}`.toLowerCase();
            const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
            const matchesQuery = !query || haystack.includes(query);
            const visible = matchesFilter && matchesQuery;

            card.hidden = !visible;
            if (visible) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.libraryFilter || "all";
            filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            applyFilters();
        });
    });

    searchInput?.addEventListener("input", applyFilters);
    applyFilters();
}

function initFaqFilters() {
    const faq = document.querySelector("[data-faq]");
    if (!faq) {
        return;
    }

    const searchInput = faq.querySelector("[data-faq-search]");
    const filterButtons = Array.from(faq.querySelectorAll("[data-faq-filter]"));
    const items = Array.from(faq.querySelectorAll("[data-faq-item]"));
    const emptyState = faq.querySelector("[data-faq-empty]");
    let activeFilter = "all";

    function applyFilters() {
        const query = (searchInput?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        items.forEach((item) => {
            const categories = (item.dataset.category || "").split(/\s+/);
            const haystack = `${item.textContent} ${item.dataset.keywords || ""}`.toLowerCase();
            const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
            const matchesQuery = !query || haystack.includes(query);
            const visible = matchesFilter && matchesQuery;

            item.hidden = !visible;
            if (!visible) {
                item.open = false;
            } else {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.faqFilter || "all";
            filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            applyFilters();
        });
    });

    searchInput?.addEventListener("input", applyFilters);
    applyFilters();
}

function initAcademicRail() {
    const railLinks = Array.from(document.querySelectorAll(".academic-rail a[href^='#'], [data-section-nav] a[href^='#']"));
    if (!railLinks.length) {
        return;
    }

    const sectionById = new Map();
    railLinks.forEach((link) => {
        const id = link.getAttribute("href")?.slice(1);
        const section = id ? document.getElementById(id) : null;
        if (section) {
            sectionById.set(id, { link, section });
        }
    });

    if (!sectionById.size) {
        return;
    }

    function setActive(id) {
        railLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    let frameRequested = false;
    let activeId;

    function updateActiveSection() {
        frameRequested = false;
        const sections = Array.from(sectionById.entries());
        const readingLine = Math.max((header?.offsetHeight || 0) + 40, window.innerHeight * 0.4);
        let currentId = sections[0][0];

        sections.forEach(([id, { section }]) => {
            if (window.scrollY > 1 && section.getBoundingClientRect().top <= readingLine) {
                currentId = id;
            }
        });

        // A short final section may never reach the reading line.
        const atBottom = window.scrollY > 1 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
            currentId = sections[sections.length - 1][0];
        }

        // A short page can clamp different anchors to the same scroll position.
        const hashId = window.location.hash.slice(1);
        if (sectionById.has(hashId)) {
            const target = sectionById.get(hashId).section;
            const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
            const scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const anchorPosition = Math.min(scrollRange, Math.max(0, target.getBoundingClientRect().top + window.scrollY - margin));
            if (Math.abs(window.scrollY - anchorPosition) <= 2) {
                currentId = hashId;
            }
        }

        if (currentId !== activeId) {
            activeId = currentId;
            setActive(currentId);
        }
    }

    function requestSectionUpdate() {
        if (!frameRequested) {
            frameRequested = true;
            window.requestAnimationFrame(updateActiveSection);
        }
    }

    window.addEventListener("scroll", requestSectionUpdate, { passive: true });
    window.addEventListener("resize", requestSectionUpdate, { passive: true });
    window.addEventListener("load", requestSectionUpdate);
    window.addEventListener("hashchange", requestSectionUpdate);
    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(requestSectionUpdate);
        observer.observe(document.querySelector(".academic-main") || document.body);
    }
    updateActiveSection();
}

initTheme();
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

initReveal();
hydrateAcademicData();
initCopyEmail();
initLibraryFilters();
initFaqFilters();
initAcademicRail();
initAcademicMotion();
