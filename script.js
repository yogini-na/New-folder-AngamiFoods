/* ===================================
   NAVBAR SCROLL EFFECT
=================================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});

/* ===================================
   COUNTER ANIMATION
=================================== */

const counters = document.querySelectorAll(".counter");

let counterStarted = false;

function animateCounters() {

    if (counterStarted) return;

    counterStarted = true;

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        let count = 0;

        const increment = target / 120;

        function updateCounter() {

            count += increment;

            if (count < target) {

                counter.innerText = Math.floor(count);

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target + "+";

            }

        }

        updateCounter();

    });

}

const statsSection = document.querySelector(".statistics");

if (statsSection) {

    const statsObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounters();

            }

        });

    }, {
        threshold: 0.3
    });

    statsObserver.observe(statsSection);

}

/* ===================================
   SCROLL REVEAL
=================================== */

const revealSections = document.querySelectorAll("section");

revealSections.forEach(section => {

    section.classList.add("hidden-section");

});

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show-section");

        }

    });

}, {
    threshold: 0.15
});

revealSections.forEach(section => {

    revealObserver.observe(section);

});

/* ===================================
   ACTIVE NAVIGATION
=================================== */

const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    document.querySelectorAll("section").forEach(section => {

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (window.scrollY >= top &&
            window.scrollY < top + height) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") === "#" + current
        ) {

            link.classList.add("active");

        }

    });

});

/* ===================================
   SMOOTH SCROLL
=================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute("href")
        );

        if (!target) return;

        window.scrollTo({

            top: target.offsetTop - 80,
            behavior: "smooth"

        });

    });

});

/* ===================================
   CONTACT FORM
   (Handled by db.js — local SQLite API)
=================================== */

/* ===================================
   PRODUCT CARD HOVER EFFECT
=================================== */

const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0px)";

    });

});

/* ===================================
   HERO BUTTON EFFECT
=================================== */

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transition = ".3s";

    });

});

/* ===================================
   CURRENT YEAR
=================================== */

const year = document.getElementById("year");

if (year) {

    year.textContent = new Date().getFullYear();

}

/* ===================================
   PAGE LOADED
=================================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* ===================================
   BACK TO TOP
=================================== */

const backToTop = document.createElement("button");

backToTop.innerHTML = "↑";

backToTop.style.position = "fixed";
backToTop.style.bottom = "30px";
backToTop.style.right = "30px";
backToTop.style.width = "50px";
backToTop.style.height = "50px";
backToTop.style.border = "none";
backToTop.style.borderRadius = "50%";
backToTop.style.background = "#f28c28";
backToTop.style.color = "#fff";
backToTop.style.cursor = "pointer";
backToTop.style.fontSize = "20px";
backToTop.style.display = "none";
backToTop.style.zIndex = "999";

document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.style.display = "block";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});
document.querySelectorAll('[data-page]').forEach(link => {

    link.addEventListener('click', function(e){

        e.preventDefault();

        const targetPage = this.dataset.page;

        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active-page');
        });

        document.getElementById(targetPage)
                .classList.add('active-page');

        window.scrollTo(0,0);

    });

});