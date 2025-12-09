// script.js — merged & safe version

(function () {
  "use strict";

  // Wait for DOM to be ready before querying elements (prevents null errors)
  document.addEventListener("DOMContentLoaded", () => {
    // ===== CORE =====
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // reveal observer
    const revealTargets = document.querySelectorAll(
      ".reveal, .hero-right, .hero-left > *:not(.eyebrow)"
    );
    if (window.IntersectionObserver) {
      const ro = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("revealed");
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealTargets.forEach((t) => ro.observe(t));
    } else {
      revealTargets.forEach((t) => t.classList.add("revealed"));
    }

    // progress bars
    function animateProgress() {
      document.querySelectorAll(".prog > span").forEach((el, i) => {
        const w = el.dataset.width || "0%";
        setTimeout(() => {
          el.style.width = w;
        }, i * 120);
      });
    }

    // circles
    function animateCircles() {
      document.querySelectorAll(".circle").forEach((c) => {
        const p = parseInt(c.dataset.percent || 0, 10);
        c.style.background = `conic-gradient(var(--tosca) 0deg ${
          p * 3.6
        }deg, rgba(255,255,255,0.04) ${p * 3.6}deg 360deg)`;
        const num = c.querySelector(".num");
        if (!num) return;
        let cur = 0;
        const dur = 700;
        const steps = Math.max(10, Math.floor(dur / 16));
        const stepTime = dur / steps;
        const delta = p / steps;
        const t = setInterval(() => {
          cur = Math.min(p, Math.round(cur + delta));
          num.textContent = cur + "%";
          if (cur >= p) clearInterval(t);
        }, stepTime);
      });
    }

    const skillsSection = document.getElementById("skills");
    if (skillsSection && window.IntersectionObserver) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateProgress();
              animateCircles();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      io.observe(skillsSection);
    } else {
      animateProgress();
      animateCircles();
    }

    // gallery tilt + lightbox
    document.querySelectorAll(".gal-item").forEach((item) => {
      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = y * -6;
        const ry = x * 6;
        item.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
      });
      item.addEventListener("mouseleave", () => (item.style.transform = ""));
      item.addEventListener("click", () => {
        const src = item.dataset.src || item.querySelector("img")?.src;
        const lightbox = document.getElementById("lightbox");
        const lbImg = document.getElementById("lbImg");
        if (lightbox && lbImg && src) {
          lbImg.src = src;
          lightbox.style.display = "grid";
          lightbox.setAttribute("aria-hidden", "false");
          document.getElementById("lbClose")?.focus();
        }
      });
    });

    // lightbox close
    const lbCloseBtn = document.getElementById("lbClose");
    const lightbox = document.getElementById("lightbox");
    if (lbCloseBtn)
      lbCloseBtn.addEventListener("click", () => {
        if (!lightbox) return;
        lightbox.style.display = "none";
        lightbox.setAttribute("aria-hidden", "true");
        document.getElementById("lbImg").src = "";
      });
    if (lightbox)
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          lightbox.style.display = "none";
          lightbox.setAttribute("aria-hidden", "true");
          document.getElementById("lbImg").src = "";
        }
      });

    // avatar parallax
    const avatarWrap = document.querySelector(".avatar-wrap");
    const avatar = document.querySelector(".avatar");
    const glow = document.querySelector(".avatar-glow");
    if (avatarWrap && avatar && glow) {
      avatarWrap.addEventListener("mousemove", (e) => {
        const rect = avatarWrap.getBoundingClientRect();
        const cx = rect.width / 2,
          cy = rect.height / 2;
        const x = e.clientX - rect.left,
          y = e.clientY - rect.top;
        const rx = (y - cy) / 20,
          ry = (cx - x) / 20;
        avatar.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        glow.style.transform = `translate(${(x - cx) / 10}px, ${
          (y - cy) / 10
        }px)`;
      });
      avatarWrap.addEventListener("mouseleave", () => {
        avatar.style.transform = "";
        glow.style.transform = "";
      });
    }

    // top button
    const topBtn = document.getElementById("topBtn");
    window.addEventListener("scroll", () => {
      if (!topBtn) return;
      if (window.scrollY > 300) {
        topBtn.style.opacity = 1;
        topBtn.style.transform = "translateY(0)";
      } else {
        topBtn.style.opacity = 0;
        topBtn.style.transform = "translateY(8px)";
      }
    });

    // download CV (fallback to text)
    function downloadCV() {
      const pdf = "CV_Marvelino.pdf";
      fetch(pdf, { method: "HEAD" })
        .then((res) => {
          if (res.ok) window.open(pdf, "_blank");
          else {
            const txt = `MARVELINO ALFRADO\nFreelance Web Developer\nKontak: +62 81998011501\nEmail: email@marvelinoo.com\n`;
            const blob = new Blob([txt], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "CV-MARVELINO-ALFRADO.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        })
        .catch(() => {
          const txt = `MARVELINO ALFRADO\nFreelance Web Developer\nKontak: +62 81998011501\nEmail: email@marvelinoo.com\n`;
          const blob = new Blob([txt], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "CV-MARVELINO-ALFRADO.txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
    }
    window.downloadCV = downloadCV;

    // occasional glitch peak (scanline)
    (function enableGlitchPeak() {
      const name = document.querySelector(".name-highlight");
      if (!name) return;
      function trigger() {
        name.classList.add("glitch-peak");
        setTimeout(() => name.classList.remove("glitch-peak"), 420);
      }
      setInterval(() => {
        if (Math.random() > 0.45) trigger();
      }, 3000 + Math.random() * 3000);
    })();

    // ===== LOCATION POPUP =====
    // Default coordinates set to Desa Penanggal, Candipuro, Lumajang
    // (If you prefer to use a static embed iframe in HTML, the code below will not overwrite it.)
    const locationCoord = { lat: -8.142601221135756, lng: 113.03622707862603 };
    const mapZoom = 14;

    function buildMapSrc() {
      return `https://maps.google.com/maps?q=${locationCoord.lat},${locationCoord.lng}&z=${mapZoom}&output=embed`;
    }

    function openMap() {
      const popup = document.getElementById("mapPopup");
      const frame = document.getElementById("mapFrame");
      if (!popup) return;

      // only set src if frame exists and currently empty (so we don't overwrite a manual embed)
      if (
        frame &&
        (!frame.getAttribute("src") || frame.getAttribute("src").trim() === "")
      ) {
        frame.setAttribute("src", buildMapSrc());
      }

      popup.style.display = "grid";
      popup.setAttribute("aria-hidden", "false");

      // focus the close button for accessibility
      document.getElementById("mapClose")?.focus();

      // add ESC handler specifically for map (safe to add multiple times because we remove on close)
      document.addEventListener("keydown", _mapEscHandler);
    }

    // closeMap with cleanup
    function closeMap() {
      const popup = document.getElementById("mapPopup");
      const frame = document.getElementById("mapFrame");
      if (!popup) return;
      popup.style.display = "none";
      popup.setAttribute("aria-hidden", "true");

      // if we injected the src dynamically we could clear it to stop loading.
      // Only clear if it matches the built URL (prevents clearing a manual embed).
      if (frame) {
        const built = buildMapSrc();
        const cur = frame.getAttribute("src") || "";
        if (cur === built) frame.setAttribute("src", "");
      }

      document.removeEventListener("keydown", _mapEscHandler);
    }

    function _mapEscHandler(e) {
      if (e.key === "Escape") closeMap();
    }

    // map: click outside to close (overlay)
    const mapPopupEl = document.getElementById("mapPopup");
    if (mapPopupEl) {
      mapPopupEl.addEventListener("click", (e) => {
        if (e.target === mapPopupEl) closeMap();
      });
    }

    // map close button hook (if present)
    const mapCloseBtn = document.getElementById("mapClose");
    if (mapCloseBtn) mapCloseBtn.addEventListener("click", closeMap);

    // Integrate map closing with existing global Escape handler and lightbox
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // close lightbox if open
        if (lightbox && lightbox.style.display === "grid") {
          lightbox.style.display = "none";
          lightbox.setAttribute("aria-hidden", "true");
          document.getElementById("lbImg").src = "";
        }
        // close map if open
        const mp = document.getElementById("mapPopup");
        if (mp && mp.style.display === "grid") {
          closeMap();
        }
      }
    });

    // expose for inline onclick attributes
    window.openMap = openMap;
    window.closeMap = closeMap;
  });
  // DOMContentLoaded
})();
