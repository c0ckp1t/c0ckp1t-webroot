<script setup>
/**
 * ClearMind Landing Page
 */
//________________________________________________________________________________
// IMPORTS
//________________________________________________________________________________
import {reactive, ref, onMounted} from 'vue'
import {getLogger} from "Logging";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'PageMain.vue'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// ________________________________________________________________________________
// LOCAL
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
})

//________________________________________________________________________________
// INIT
//________________________________________________________________________________
onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', "dark")
})

function goToRoot () {
  window.location.href = '/'
}
</script>

<template>
  <div class="page-main" >

    <!-- HERO -->
    <section class="text-center py-5 px-3" style="min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center;" @click.prevent="goToRoot">

      <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.31498 89.318481" width="140" height="160"
           style="--logo-fill: #57e389; --logo-stroke: #121212;">
        <g transform="translate(-58.970072,-89.839213)">
          <ellipse ry="37.436966" rx="39.0252" cy="129.01283" cx="97.967125" id="head"
                   style="fill:var(--logo-fill);fill-opacity:1;fill-rule:evenodd;stroke:var(--logo-stroke);stroke-width:0.264583;stroke-opacity:1" />
          <path id="lefEye2" d="M 62.802996,126.14677 C 83.82199,101.23898 83.964978,101.06953 83.964978,101.06953"
                style="fill:none;stroke:var(--logo-stroke);stroke-width:1.17285;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1" />
          <path id="leftEye1" d="M 82.6223,124.4643 C 65.50242,101.25919 65.230678,101.25919 65.230678,101.25919"
                style="fill:none;stroke:var(--logo-stroke);stroke-width:1.47804;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1" />
          <path id="rightEye1" d="m 104.50542,128.9234 c 17.98743,-24.4738 18.1098,-24.64029 18.1098,-24.64029"
                style="fill:none;stroke:var(--logo-stroke);stroke-width:1.74255;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1" />
          <path id="rightEye2" d="M 119.97488,125.1614 C 104.59226,105.53305 104.34809,105.53305 104.34809,105.53305"
                style="fill:none;stroke:var(--logo-stroke);stroke-width:0.863069;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1" />
          <path id="smile2" d="m 128.94069,130.81133 c -4.85524,28.95711 -45.118395,28.26865 -57.939008,25.5371"
                style="fill:none;stroke:var(--logo-stroke);stroke-width:1.39662;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1" />
          <rect y="164.78011" x="89.790077" height="8.6218405" width="19.292933" id="neck1"
                style="fill:var(--logo-fill);fill-opacity:1;stroke:var(--logo-stroke);stroke-width:0.264951;stroke-miterlimit:4;stroke-opacity:1" />
          <rect y="172.92065" x="93.640526" height="6.1260414" width="12.705888" id="neck2"
                style="fill:var(--logo-fill);fill-opacity:1;stroke:var(--logo-stroke);stroke-width:0.222;stroke-miterlimit:4;stroke-opacity:1" />
        </g>
      </svg>

      <h1 class="mt-4 mb-2 fw-bold" style="font-size: 3rem; color: #57e389;">ClearMind</h1>
      <p class="mb-4" style="font-size: 1.25rem; color: #82b1ff; max-width: 600px;">
        Build websites that cut through corporate propaganda. Tools for people who believe the internet should inform, not manipulate.
      </p>
      <div class="d-flex gap-3 flex-wrap justify-content-center">
        <a href="#features" class="btn btn-lg px-4" style="background: #57e389; color: #121212; font-weight: 600;">Get Started Free</a>
        <a href="#mission" class="btn btn-outline-light btn-lg px-4">Learn More</a>
      </div>
      <p class="mt-3 small text-secondary">No credit card. No tracking. No strings attached.</p>
    </section>

    <!-- FEATURES -->
    <section id="features" class="py-5 px-3" style="background: rgba(255,255,255,0.02);">
      <div class="container">
        <h2 class="text-center mb-5 fw-bold" style="color: #EED974;">Why ClearMind?</h2>
        <div class="row g-4">
          <div class="col-md-4 text-center">
            <i class="fa-solid fa-shield-halved mb-3" style="font-size: 2.5rem; color: #57e389;"></i>
            <h5 class="fw-bold">Truth-First Design</h5>
            <p class="text-secondary small">Every template is built to present information honestly. No dark patterns, no engagement traps, no algorithmic manipulation. Just clean, readable content that respects your audience.</p>
          </div>
          <div class="col-md-4 text-center">
            <i class="fa-solid fa-eye-slash mb-3" style="font-size: 2.5rem; color: #57e389;"></i>
            <h5 class="fw-bold">Zero Tracking</h5>
            <p class="text-secondary small">Sites built with ClearMind ship with zero third-party trackers by default. No analytics harvesting, no fingerprinting, no ad networks. Your visitors stay anonymous.</p>
          </div>
          <div class="col-md-4 text-center">
            <i class="fa-solid fa-code mb-3" style="font-size: 2.5rem; color: #57e389;"></i>
            <h5 class="fw-bold">Fully Open Source</h5>
            <p class="text-secondary small">Every line of code is auditable. Fork it, modify it, self-host it. We believe transparency in tools leads to transparency in communication.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION -->
    <section id="mission" class="py-5 px-4 text-center" style="max-width: 720px; margin: 0 auto;">
      <h2 class="fw-bold mb-3" style="color: #EED974;">The Internet Deserves Better</h2>
      <p class="text-secondary" style="line-height: 1.8;">
        Every day, billions of people visit websites designed to exploit cognitive biases, manufacture consent, and sell attention to the highest bidder. ClearMind exists because we think that's broken. We build website creation tools that prioritize clarity over clicks, truth over engagement metrics, and human dignity over conversion rates. If you're a journalist, activist, educator, or anyone tired of the attention economy — this platform is for you.
      </p>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-5 px-3" style="background: rgba(255,255,255,0.02);">
      <div class="container">
        <h2 class="text-center fw-bold mb-5" style="color: #EED974;">How It Works</h2>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px; background: #57e389; color: #121212; font-size: 1.5rem; font-weight: 700;">1</div>
            <h6 class="fw-bold">Pick a Template</h6>
            <p class="text-secondary small">Choose from dozens of clean, manipulation-free templates designed for blogs, news outlets, nonprofits, and community sites.</p>
          </div>
          <div class="col-md-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px; background: #57e389; color: #121212; font-size: 1.5rem; font-weight: 700;">2</div>
            <h6 class="fw-bold">Add Your Content</h6>
            <p class="text-secondary small">Write in Markdown, drag-and-drop media, or connect your existing CMS. Our editor stays out of your way so you can focus on the message.</p>
          </div>
          <div class="col-md-4">
            <div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px; background: #57e389; color: #121212; font-size: 1.5rem; font-weight: 700;">3</div>
            <h6 class="fw-bold">Publish Anywhere</h6>
            <p class="text-secondary small">One-click deploy to your own domain. No vendor lock-in, no platform dependency. You own your site, your data, and your voice.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="py-5 px-3 text-center">
      <div class="container">
        <div class="row g-4">
          <div class="col-4">
            <div style="font-size: 2.5rem; font-weight: 700; color: #57e389;">12k+</div>
            <div class="text-secondary small">Sites Launched</div>
          </div>
          <div class="col-4">
            <div style="font-size: 2.5rem; font-weight: 700; color: #57e389;">0</div>
            <div class="text-secondary small">Trackers Shipped</div>
          </div>
          <div class="col-4">
            <div style="font-size: 2.5rem; font-weight: 700; color: #57e389;">100%</div>
            <div class="text-secondary small">Open Source</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 px-3 text-center" style="background: rgba(255,255,255,0.02);">
      <h2 class="fw-bold mb-3" style="color: #EED974;">Ready to Build Something Honest?</h2>
      <p class="text-secondary mb-4">Join thousands of creators fighting for a clearer internet.</p>
      <div class="d-flex justify-content-center gap-2 flex-wrap" style="max-width: 480px; margin: 0 auto;">
        <input type="email" class="form-control" placeholder="you@example.com" style="background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1); color: #d4d4d4;">
        <button class="btn px-4 flex-shrink-0" style="background: #57e389; color: #121212; font-weight: 600;">Join Waitlist</button>
      </div>
      <p class="mt-2 small text-secondary">We'll never spam you. Obviously.</p>
    </section>

    <!-- FOOTER -->
    <footer class="py-4 px-3 text-center" style="background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.06);">
      <p class="small mb-1" style="color: #8b949e;">
        <i class="fa-solid fa-lock me-1"></i> Built with ClearMind — no cookies, no trackers, no nonsense.
      </p>
      <p class="small mb-0" style="color: #555;">2026 ClearMind. Open source under MIT License.</p>
    </footer>

  </div>
</template>

<style scoped>
/* !# C0CKP1T_START style */
.page-main {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.page-main h1, .page-main h2, .page-main h5, .page-main h6 {
  letter-spacing: -0.02em;
}
.page-main .btn {
  border-radius: 8px;
  transition: opacity 0.2s ease;
}
.page-main .btn:hover {
  opacity: 0.85;
}
.page-main input:focus {
  box-shadow: 0 0 0 3px rgba(87, 227, 137, 0.25);
  border-color: #57e389;
}
/* !# C0CKP1T_END style */
</style>
