// script.js — dipisah & diperbaiki
(function () {
  "use strict";

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

    // ========== GAME: MATHEMATICS ==========
    let mathScore = 0;
    let correctAnswer = 0;

    function startMath() {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const ops = ["+", "-", "*"];
      const op = ops[Math.floor(Math.random() * ops.length)];

      // compute safely without eval
      if (op === "+") correctAnswer = a + b;
      else if (op === "-") correctAnswer = a - b;
      else correctAnswer = a * b;

      const q = `${a} ${op} ${b} = ?`;
      const mq = document.getElementById("mathQuestion");
      if (mq) mq.innerText = q;
      const ma = document.getElementById("mathAnswer");
      if (ma) ma.value = "";
      const mr = document.getElementById("mathResult");
      if (mr) mr.innerText = "";
    }

    function checkMath() {
      const ma = document.getElementById("mathAnswer");
      const val = ma ? Number(ma.value) : NaN;
      const mr = document.getElementById("mathResult");
      if (Number.isNaN(val)) {
        if (mr) mr.innerText = "Masukkan angka dulu.";
        return;
      }
      if (val === correctAnswer) {
        mathScore += 10;
        if (mr) mr.innerText = "Benar! 🎉";
      } else {
        mathScore -= 5;
        if (mr) mr.innerText = `Salah ❌ (jawaban: ${correctAnswer})`;
      }
      const ms = document.getElementById("mathScore");
      if (ms) ms.innerText = mathScore;
      setTimeout(startMath, 200);
    }

    document.getElementById("mathStart")?.addEventListener("click", startMath);
    document.getElementById("mathCheck")?.addEventListener("click", checkMath);

    // ========== GAME: ENGLISH ==========
    let engScore = 0;
    let currentIndex = 0;

    const questions = [
      {
        q: "What is the meaning of 'Happy'?",
        c: ["Sedih", "Bahagia", "Takut", "Besar"],
        a: 1,
      },
      { q: "Synonym of 'Big'?", c: ["Huge", "Tiny", "Slow", "Weak"], a: 0 },
      { q: "Opposite of 'Cold'?", c: ["Warm", "Ice", "Dark", "Soft"], a: 0 },
      {
        q: "Meaning of 'Quick'?",
        c: ["Lambat", "Berani", "Cepat", "Panas"],
        a: 2,
      },
    ];

    function startEng() {
      currentIndex = Math.floor(Math.random() * questions.length);
      const q = questions[currentIndex];
      const eq = document.getElementById("engQuestion");
      if (eq) eq.innerText = q.q;
      const choicesEl = document.getElementById("engChoices");
      if (!choicesEl) return;
      choicesEl.innerHTML = "";
      const er = document.getElementById("engResult");
      if (er) er.innerText = "";

      q.c.forEach((text, i) => {
        const btn = document.createElement("button");
        btn.className = "choice";
        btn.innerText = text;
        btn.addEventListener("click", () => checkEng(i));
        choicesEl.appendChild(btn);
      });
    }

    function checkEng(choice) {
      const q = questions[currentIndex];
      const buttons = document.querySelectorAll(".choice");
      const er = document.getElementById("engResult");
      if (choice === q.a) {
        engScore++;
        if (er) er.innerText = "Benar! 🎉";
        buttons[choice]?.classList.add("correct");
      } else {
        if (er) er.innerText = `Salah ❌ (Benar: ${q.c[q.a]})`;
        buttons[choice]?.classList.add("wrong");
      }
      const es = document.getElementById("engScore");
      if (es) es.innerText = engScore;
      setTimeout(startEng, 800);
    }

    document.getElementById("engStart")?.addEventListener("click", startEng);

    // ========== DOWNLOAD CV ==========
    function downloadCV() {
      const pdf = "CV_Marvelino.pdf";
      fetch(pdf, { method: "HEAD" })
        .then((res) => {
          if (res.ok) window.open(pdf, "_blank");
          else fallbackTxt();
        })
        .catch(() => fallbackTxt());
    }
    function fallbackTxt() {
      const txt =
        "MARVELINO ALFRADO\nFreelance Web Developer\nKontak: +62 81998011501\nEmail: marvelpenanggal@gmail.com\n";
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
    window.downloadCV = downloadCV;

    // occasional glitch peak
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
    const locationCoord = { lat: -8.142601221135756, lng: 113.03622707862603 };
    const mapZoom = 14;

    function buildMapSrc() {
      return `https://maps.google.com/maps?q=${locationCoord.lat},${locationCoord.lng}&z=${mapZoom}&output=embed`;
    }

    function openMap() {
      const popup = document.getElementById("mapPopup");
      const frame = document.getElementById("mapFrame");
      if (!popup) return;
      if (
        frame &&
        (!frame.getAttribute("src") || frame.getAttribute("src").trim() === "")
      ) {
        frame.setAttribute("src", buildMapSrc());
      }
      popup.style.display = "grid";
      popup.setAttribute("aria-hidden", "false");
      document.getElementById("mapClose")?.focus();
      document.addEventListener("keydown", _mapEscHandler);
    }

    function closeMap() {
      const popup = document.getElementById("mapPopup");
      const frame = document.getElementById("mapFrame");
      if (!popup) return;
      popup.style.display = "none";
      popup.setAttribute("aria-hidden", "true");
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

    const mapPopupEl = document.getElementById("mapPopup");
    if (mapPopupEl) {
      mapPopupEl.addEventListener("click", (e) => {
        if (e.target === mapPopupEl) closeMap();
      });
    }
    const mapCloseBtn = document.getElementById("mapClose");
    if (mapCloseBtn) mapCloseBtn.addEventListener("click", closeMap);

    // global ESC handler for lightbox & map
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (lightbox && lightbox.style.display === "grid") {
          lightbox.style.display = "none";
          lightbox.setAttribute("aria-hidden", "true");
          document.getElementById("lbImg").src = "";
        }
        const mp = document.getElementById("mapPopup");
        if (mp && mp.style.display === "grid") closeMap();
      }
    });

    // NAV: toggle for mobile
    const header = document.getElementById("siteHeader");
    const toggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function setNav(open) {
      if (open) {
        header.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    }

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.contains("nav-open");
      setNav(!isOpen);
    });

    // close nav when clicking a link (mobile)
    mainNav.querySelectorAll("a, button").forEach((el) =>
      el.addEventListener("click", () => {
        if (window.innerWidth <= 900) setNav(false);
      })
    );

    // ensure nav resets on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setNav(false);
    });

    // expose map functions
    window.openMap = openMap;
    window.closeMap = closeMap;
  }); // DOMContentLoaded
})();
