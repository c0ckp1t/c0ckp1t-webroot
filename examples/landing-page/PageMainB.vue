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

</script>

<template>
  <div class="page-main" >

    <!-- ═══════════ TopNavBar ═══════════ -->
    <nav class="top-nav d-flex justify-content-between align-items-center px-3 px-md-4 py-3">
      <div class="brand">URBAN PALIMPSEST</div>

      <div class="d-none d-md-flex gap-4 align-items-center">
        <a class="nav-link-custom active-link" href="#">STREETS</a>
        <a class="nav-link-custom" href="#">FEATURES</a>
        <a class="nav-link-custom" href="#">PRE-ORDER</a>
        <a class="nav-link-custom" href="#">GALLERY</a>
      </div>

      <button class="btn-join-nav">JOIN THE CREW</button>
    </nav>

    <!-- ═══════════ Main ═══════════ -->
    <main class="position-relative">

      <!-- Grain -->
      <div class="grain-overlay"></div>

      <!-- ─── Hero Section ─── -->
      <section class="hero-section d-flex align-items-center px-3 px-md-4">
        <div class="hero-bg">
          <img alt="Vibrant urban graffiti with yellow blue and red spray paint"
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWvYxcxCtIidWmf7YDEa3gsUnVKttuKSGwTLgmUzYzFnxMAKPSfPK2H3BLHlbGgFv1jqADQ9S4_DCqfJtV3ieVUfQzsfYf_OH45R0hsKfiJcFCJXPX2kgbEpewlGbj1LBTxrEJw4ZGSktUCkumnezrjbDmJ97K8dc16WJonTIz2i4Cto8Mhg4kk20Rnnn9Bb2lD_QXYmbhBskOil4olR66H-kx44eMgQdhpq2FYCXvTtawYwDbTcePeDd5esVbFCY5y6JdQKfP1Jk" />
          <div class="hero-gradient"></div>
        </div>

        <div class="hero-content container-xxl w-100">
          <div class="row align-items-end">
            <div class="col-lg-8">
              <p class="hero-subtitle">Expressionist Urban Adventure</p>
              <h1 class="hero-title">
                URBAN<br />
                <span class="highlight">PALIMPSEST</span>
              </h1>

              <div class="d-flex flex-column flex-sm-row gap-4 align-items-start align-items-sm-center">
                <button class="btn-rebellion">
                  <span class="position-relative" style="z-index:1">JOIN THE REBELLION</span>
                  <div class="btn-shadow"></div>
                </button>

                <div class="hero-info-box">
                                <span class="material-symbols-outlined"
                                      style="font-variation-settings: 'FILL' 1;">format_paint</span>
                  <p>Paint the grey walls with your soul's rebellion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ─── The Streets Section ─── -->
      <section class="streets-section px-3 px-md-4">
        <div class="container-xxl">
          <div class="row g-5 align-items-center">

            <!-- Image column -->
            <div class="col-lg-6">
              <div class="streets-image-wrapper">
                <div class="streets-glow"></div>
                <div class="streets-image-frame">
                  <img alt="A gritty dark alleyway with glowing neon graffiti on brick walls"
                       src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMaRxRfaFUyKWkXdCKPWQMw6Ajwvle3kynDN0u95MhHI_CJGnvWOLEZKndNCAwFuQpzfc-RpEHfCz6F5MoTpHO5k_6881xTrI1pXx2PvuHpu5bynxlKdxJLz16WLhmR4xYtLHH13EwlowB5T5zWUsmlMFacmmhDqMScO5WOY90mSTDYWfv-y8YymVFnIchf_z6XrRJnMFl8rEDxDetLjh9LdBJr5YE5-q_qkdVwkCLwfyvQnXZQfcqnPwPUfepYtyotowg5XAop5o" />
                  <div class="streets-badge">
                    <p>RECLAIM THE VOID</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Text column -->
            <div class="col-lg-6">
              <div class="d-flex flex-column gap-4">
                <h2 class="streets-title">
                  THE STREETS ARE YOUR <span class="accent">CANVAS</span>
                </h2>

                <div class="d-flex flex-column gap-3" style="max-width:36rem;">
                  <p class="streets-text">In the monolithic grey of the Neo-Palimpsest district, silence
                    is a crime and color is a weapon. Every wall is a history waiting to be overwritten.
                  </p>
                  <p class="streets-quote">The art style blends 1980s neo-expressionism with futuristic
                    tech-stencil aesthetics. Layers upon layers of digital paint react to the
                    environment, changing with the rhythm of the city's heartbeat.</p>
                </div>

                <div class="d-flex flex-wrap gap-3">
                  <span class="tag tag-primary">WHEATPASTE_V1.0</span>
                  <span class="tag tag-secondary">DRIP_TECH_ACTIVE</span>
                  <span class="tag tag-tertiary">PALIMPSEST_PROTOCOL</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ─── Features Bento Grid ─── -->
      <section class="features-section px-3 px-md-4">
        <div class="container-xxl">

          <!-- Header -->
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <h2 class="features-header-title mb-0">FEATURES</h2>
            <p class="features-header-sub text-md-end mb-0" style="max-width:20rem;">Deconstruct the mechanics
              of the rebellion.</p>
          </div>

          <!-- Grid -->
          <div class="row g-4">

            <!-- Feature 1: Street Art Magic (2-col span) -->
            <div class="col-md-8">
              <div class="feature-card feature-card-art h-100">
                <div class="icon-bg">
                  <span class="material-symbols-outlined">brush</span>
                </div>
                <div class="position-relative" style="z-index:1;">
                  <h3 class="fs-2 mb-3">STREET ART MAGIC</h3>
                  <p class="text-on-surface-variant fs-5 mb-0" style="max-width:28rem; color: var(--clr-on-surface-variant); line-height:1.4;">
                    Wield the "Aerosol Arcanum"—a tool that turns light and shadow into physical
                    structures. Paint stairs to reach rooftops or shields to block surveillance drones.
                  </p>
                </div>
                <div class="overlay"></div>
              </div>
            </div>

            <!-- Feature 2: Urban Exploration -->
            <div class="col-md-4">
              <div class="feature-card feature-card-explore h-100">
                <div class="d-flex flex-column gap-3">
                                <span class="material-symbols-outlined"
                                      style="font-variation-settings: 'FILL' 1;">explore</span>
                  <h3 class="fs-3 leading-none">URBAN EXPLORATION</h3>
                </div>
                <p>Navigate a vertical labyrinth of fire escapes, rooftops, and hidden subway veins. The
                  city is a 3D puzzle where gravity is just another suggestion.</p>
              </div>
            </div>

            <!-- Feature 3: Hidden Secrets -->
            <div class="col-md-4">
              <div class="feature-card feature-card-secrets h-100">
                <div>
                  <div class="icon-box">
                                    <span class="material-symbols-outlined"
                                          style="font-variation-settings: 'FILL' 1;">vpn_key</span>
                  </div>
                  <h3 class="fs-3 mb-3" style="color:var(--clr-on-surface);">HIDDEN SECRETS</h3>
                  <p class="small mb-0" style="color:var(--clr-on-surface-variant);">Decode the visual
                    history of the resistance. Every mural holds coordinates, passcodes, and the
                    memories of those who painted before you.</p>
                </div>
                <div class="footer-row d-flex justify-content-between align-items-center">
                  <span class="encrypted-label">Encrypted_Layer_Detected</span>
                  <span class="material-symbols-outlined"
                        style="font-size:0.75rem; color:var(--clr-on-surface-variant);">arrow_forward</span>
                </div>
              </div>
            </div>

            <!-- CTA Feature (2-col span) -->
            <div class="col-md-8">
              <div
                  class="feature-card feature-card-cta h-100 d-flex flex-column flex-md-row gap-4 align-items-center justify-content-between">
                <div>
                  <h3 class="mb-2">READY TO LEAVE YOUR MARK?</h3>
                  <p class="cta-sub mb-0">Limited pre-order slots available for the closed beta.</p>
                </div>
                <button class="btn-preorder">PRE-ORDER NOW</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ─── Image Gallery / Marquee ─── -->
      <section class="gallery-section">
        <div class="gallery-track">
          <div class="gallery-item">
            <img alt="Abstract graffiti art with thick brush strokes and vibrant blue highlights"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx6MMYZizTWSGO5gNJfqISfozo0JoiXisUn-t5BWDU0da6_RKhV85xfF7xMHBv9pyueimqPUc3-XAmtQvfKke55FMVp9XFSAHDhNJrtOqmumzr_4zxRTnKNDrSXNVeAQMYWq9vviUm8Y57TZP6GGhfN1Fl0rmB-EO_Z1s1M11lWZOVlvcdlQxHH5KTXC6WURGFYI9UdyzWwOKoz_GqjV4ZaPbmKJNR9ltnoNVGVgvmXH-l_p9ZlMAAMqvJO-vRyECnrdxh80uo7SA" />
          </div>
          <div class="gallery-item">
            <img alt="Cyberpunk street art featuring a robotic skull dripping with red paint"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7zhHdxAn2XEcu68dUG1gMLaUF1kiNEn3_Zw5mktkRzuZ2LeyFHTwdxKXLPRHjvgX6QhKfadJoPQM7pvpWck2mTX83yDrSjd99eqUzjQtA2V5y7E0WIWOBoG0UpWeaOUQukoRpwA-VeiOf9USsWe3yfzuaXwceitRrMB_6aHZfRkNOhar0-gSemNQG_0f9YUcnE4gdtfkvTNC5RqXje6f_7qel0XA4g7_ivTW_3x-clV7KKyGXAIJcAJsvtYD5BPoWrmVumqyaQJU" />
          </div>
          <div class="gallery-item">
            <img alt="High contrast street art of a character wearing a glowing yellow mask"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUWw2-J1zRlYmwhNWFPI_tpSAaVB9sfRcjFX_oGl5sS3ah-lOtHARosqZmR96hihJQs4YEUIhXTdGQKi7f6IOmAYzlVDnP09sj2nz_872ZUrvhjwv6CSMmwm7L3lKek6aJbmMMPdxgqH3OHub42D5aeOoUZeueWQAlo6B9E9yFgJDB4uiMlmmuhL9tiac9zU4uF_7O0Wc_TA9oUgEJXrvJTdC4q7M0vwlsMxJzZlJxsDoiF7XDAWGumVJ_K1gyHpPWhWqJxkyCpdY" />
          </div>
          <div class="gallery-item">
            <img alt="Urban scenery with massive graffiti mural covering an entire apartment building"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuColPVn0MLg0Xt_0hNVlvOp0PFnERUk6gjMarbNSkDrMT3e3pMUZ2En7zOBoBygaXMN10i2TnZWNatmIpCsGXwo9Nx8EQzexEoJyC_t-yIcCgeBEqPQI6fNA_Xn1UC4gQOxZam8dVRSFNiOQPhgZGv_8zXc-MTIcsaftCcQsL89VqlfO4bzQwig1CTd7cMW8bQIEU6YAhVLxfaLrCd6C_AHe6dLkSGKLPk1xLzyBJVvQbIAerWZvttBsawm6Aa9zWmDrPcACLHVtVE" />
          </div>
          <div class="gallery-item">
            <img alt="Close up of spray paint cans with colorful drips running down them"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhGFlzDoQLVKwUahG0VLh0ID9IFDQ83IMpl5C8-eTW8-pOsEOwTe5m6bjaE-rEWEFAhTkLwHlmv7okAVUJ34B5B4MCoyAnkdH7A7-ehNeTMRsbYpAnq1Km8QN5sye98SAmwa98IqpCO1dcOA_cSzlr0RM7RJKKVIHfVKlysH-pMXQKABIUT_9hO7dQ836r8bKVzmKlu72_3ksrFZJUH0PeAFkHfjCi-mobx2apvZCXybdm2bdvWkn3eiskGEsd-HM5BfegQZfvFU" />
          </div>
          <!-- Duplicate set for seamless loop -->
          <div class="gallery-item">
            <img alt="Abstract graffiti art with thick brush strokes and vibrant blue highlights"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx6MMYZizTWSGO5gNJfqISfozo0JoiXisUn-t5BWDU0da6_RKhV85xfF7xMHBv9pyueimqPUc3-XAmtQvfKke55FMVp9XFSAHDhNJrtOqmumzr_4zxRTnKNDrSXNVeAQMYWq9vviUm8Y57TZP6GGhfN1Fl0rmB-EO_Z1s1M11lWZOVlvcdlQxHH5KTXC6WURGFYI9UdyzWwOKoz_GqjV4ZaPbmKJNR9ltnoNVGVgvmXH-l_p9ZlMAAMqvJO-vRyECnrdxh80uo7SA" />
          </div>
          <div class="gallery-item">
            <img alt="Cyberpunk street art featuring a robotic skull dripping with red paint"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7zhHdxAn2XEcu68dUG1gMLaUF1kiNEn3_Zw5mktkRzuZ2LeyFHTwdxKXLPRHjvgX6QhKfadJoPQM7pvpWck2mTX83yDrSjd99eqUzjQtA2V5y7E0WIWOBoG0UpWeaOUQukoRpwA-VeiOf9USsWe3yfzuaXwceitRrMB_6aHZfRkNOhar0-gSemNQG_0f9YUcnE4gdtfkvTNC5RqXje6f_7qel0XA4g7_ivTW_3x-clV7KKyGXAIJcAJsvtYD5BPoWrmVumqyaQJU" />
          </div>
          <div class="gallery-item">
            <img alt="High contrast street art of a character wearing a glowing yellow mask"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUWw2-J1zRlYmwhNWFPI_tpSAaVB9sfRcjFX_oGl5sS3ah-lOtHARosqZmR96hihJQs4YEUIhXTdGQKi7f6IOmAYzlVDnP09sj2nz_872ZUrvhjwv6CSMmwm7L3lKek6aJbmMMPdxgqH3OHub42D5aeOoUZeueWQAlo6B9E9yFgJDB4uiMlmmuhL9tiac9zU4uF_7O0Wc_TA9oUgEJXrvJTdC4q7M0vwlsMxJzZlJxsDoiF7XDAWGumVJ_K1gyHpPWhWqJxkyCpdY" />
          </div>
          <div class="gallery-item">
            <img alt="Urban scenery with massive graffiti mural covering an entire apartment building"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuColPVn0MLg0Xt_0hNVlvOp0PFnERUk6gjMarbNSkDrMT3e3pMUZ2En7zOBoBygaXMN10i2TnZWNatmIpCsGXwo9Nx8EQzexEoJyC_t-yIcCgeBEqPQI6fNA_Xn1UC4gQOxZam8dVRSFNiOQPhgZGv_8zXc-MTIcsaftCcQsL89VqlfO4bzQwig1CTd7cMW8bQIEU6YAhVLxfaLrCd6C_AHe6dLkSGKLPk1xLzyBJVvQbIAerWZvttBsawm6Aa9zWmDrPcACLHVtVE" />
          </div>
          <div class="gallery-item">
            <img alt="Close up of spray paint cans with colorful drips running down them"
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhGFlzDoQLVKwUahG0VLh0ID9IFDQ83IMpl5C8-eTW8-pOsEOwTe5m6bjaE-rEWEFAhTkLwHlmv7okAVUJ34B5B4MCoyAnkdH7A7-ehNeTMRsbYpAnq1Km8QN5sye98SAmwa98IqpCO1dcOA_cSzlr0RM7RJKKVIHfVKlysH-pMXQKABIUT_9hO7dQ836r8bKVzmKlu72_3ksrFZJUH0PeAFkHfjCi-mobx2apvZCXybdm2bdvWkn3eiskGEsd-HM5BfegQZfvFU" />
          </div>
        </div>
      </section>

    </main>

    <!-- ═══════════ Footer ═══════════ -->
    <footer class="site-footer d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <div class="d-flex flex-column gap-1">
        <div class="brand">URBAN PALIMPSEST</div>
        <p class="copyright mb-0">© 2024 URBAN PALIMPSEST. ALL WALLS RECLAIMED.</p>
      </div>
      <div class="d-flex gap-4">
        <a class="footer-link" href="#">INSTAGRAM</a>
        <a class="footer-link" href="#">DISCORD</a>
        <a class="footer-link" href="#">TWITTER</a>
        <a class="footer-link" href="#">TERMS</a>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* !# C0CKP1T_START style */
/* ── CSS Custom Properties (Design Tokens) ── */
:root {
  --clr-background: #0e0e0e;
  --clr-surface: #0e0e0e;
  --clr-surface-container-lowest: #000000;
  --clr-surface-container-low: #131313;
  --clr-surface-container: #1a1919;
  --clr-surface-container-high: #201f1f;
  --clr-surface-container-highest: #262626;
  --clr-surface-bright: #2c2c2c;
  --clr-on-background: #ffffff;
  --clr-on-surface: #ffffff;
  --clr-on-surface-variant: #adaaaa;
  --clr-primary: #ffe887;
  --clr-primary-container: #fcd800;
  --clr-on-primary: #635400;
  --clr-on-primary-container: #5a4c00;
  --clr-secondary: #4ea0ff;
  --clr-secondary-dim: #4ea0ff;
  --clr-on-secondary: #002141;
  --clr-tertiary: #ff7162;
  --clr-tertiary-container: #fd2e27;
  --clr-on-tertiary: #4a0001;
  --clr-on-tertiary-container: #000000;
  --clr-error: #ff7351;
  --clr-outline: #767575;
  --clr-outline-variant: #484847;

  --ff-headline: 'Epilogue', sans-serif;
  --ff-body: 'Space Grotesk', sans-serif;
}

/* ── Base / Reset ── */
body {
  background-color: var(--clr-background);
  color: var(--clr-on-background);
  font-family: var(--ff-body);
}

::selection {
  background: var(--clr-tertiary);
  color: #fff;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* ── Typography helpers ── */
.font-headline {
  font-family: var(--ff-headline);
}

.font-mono {
  font-family: 'Space Grotesk', monospace;
}

.tracking-tighter {
  letter-spacing: -0.05em;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.leading-none {
  line-height: 1;
}

.leading-085 {
  line-height: 0.85;
}

.text-stroke {
  -webkit-text-stroke: 1px var(--clr-primary);
  color: transparent;
}

/* ── Grain Overlay ── */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}

/* ── Top Nav ── */
.top-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background: rgba(14, 14, 14, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.top-nav .brand {
  font-size: 1.5rem;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.05em;
  color: var(--clr-primary);
  text-shadow: 2px 2px 0px rgba(252, 216, 0, 1);
  font-family: var(--ff-headline);
}

.top-nav .nav-link-custom {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-decoration: none;
  transition: all 0.1s;
}

.top-nav .nav-link-custom.active-link {
  color: var(--clr-primary);
  border-bottom: 4px solid var(--clr-tertiary);
  padding-bottom: 0.25rem;
}

.top-nav .nav-link-custom:not(.active-link) {
  color: var(--clr-on-surface-variant);
  transform: skewX(-12deg);
  padding: 0.25rem 0.5rem;
}

.top-nav .nav-link-custom:not(.active-link):hover {
  color: #fff;
  background: var(--clr-tertiary);
}

.top-nav .nav-link-custom:active {
  transform: scale(0.95);
}

.btn-join-nav {
  background: var(--clr-primary);
  color: var(--clr-on-primary);
  font-family: var(--ff-headline);
  font-weight: 900;
  font-size: 0.875rem;
  letter-spacing: -0.05em;
  padding: 0.5rem 1.5rem;
  border: none;
  transform: skewX(-12deg);
  transition: all 0.15s;
}

.btn-join-nav:hover {
  background: var(--clr-tertiary);
  color: #fff;
}

.btn-join-nav:active {
  transform: skewX(-12deg) scale(0.95);
}

/* ── Hero Section ── */
.hero-section {
  position: relative;
  min-height: 100vh;
  padding-top: 8rem;
  padding-bottom: 5rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  mix-blend-mode: luminosity;
}

.hero-bg .hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--clr-background), rgba(14, 14, 14, 0.2), transparent);
}

.hero-content {
  position: relative;
  z-index: 10;
}

.hero-subtitle {
  font-family: 'Space Grotesk', monospace;
  color: var(--clr-secondary);
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: var(--ff-headline);
  font-size: clamp(4rem, 10vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.85;
  text-transform: uppercase;
  color: var(--clr-on-background);
  margin-bottom: 2rem;
}

.hero-title .highlight {
  color: var(--clr-primary);
  font-style: italic;
}

.btn-rebellion {
  position: relative;
  padding: 1.25rem 2.5rem;
  background: var(--clr-primary);
  color: var(--clr-on-primary-container);
  font-family: var(--ff-headline);
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: -0.05em;
  border: none;
  transition: all 0.15s;
}

.btn-rebellion:hover {
  background: var(--clr-tertiary);
  color: #fff;
}

.btn-rebellion:active {
  transform: scale(0.95);
}

.btn-rebellion .btn-shadow {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 100%;
  height: 100%;
  background: var(--clr-primary-container);
  z-index: -1;
  transition: background 0.15s;
}

.btn-rebellion:hover .btn-shadow {
  background: var(--clr-tertiary-container);
}

.hero-info-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-left: 4px solid var(--clr-secondary);
  background: rgba(78, 160, 255, 0.1);
  backdrop-filter: blur(12px);
}

.hero-info-box .material-symbols-outlined {
  color: var(--clr-secondary);
}

.hero-info-box p {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: var(--clr-secondary-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  max-width: 200px;
  margin: 0;
}

/* ── Streets Section ── */
.streets-section {
  padding: 8rem 0;
  background: var(--clr-surface-container-lowest);
  position: relative;
}

.streets-image-wrapper {
  position: relative;
}

.streets-glow {
  position: absolute;
  top: -2.5rem;
  left: -2.5rem;
  width: 10rem;
  height: 10rem;
  background: rgba(255, 113, 98, 0.2);
  filter: blur(48px);
  border-radius: 50%;
}

.streets-image-frame {
  background: var(--clr-surface-container-high);
  padding: 1rem;
  transform: skewY(-2deg);
  position: relative;
}

.streets-image-frame img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.7s;
}

.streets-image-frame img:hover {
  filter: grayscale(0%);
}

.streets-badge {
  position: absolute;
  bottom: 2rem;
  right: -1rem;
  background: var(--clr-primary);
  padding: 1rem;
  transform: rotate(3deg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.streets-badge p {
  font-family: var(--ff-headline);
  color: var(--clr-on-primary);
  font-weight: 900;
  font-size: 1.25rem;
  font-style: italic;
  letter-spacing: -0.05em;
  margin: 0;
}

.streets-title {
  font-family: var(--ff-headline);
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  line-height: 1;
  color: var(--clr-on-surface);
}

.streets-title .accent {
  color: var(--clr-tertiary);
}

.streets-text {
  color: var(--clr-on-surface-variant);
  font-size: 1.125rem;
  line-height: 1.625;
}

.streets-quote {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.875rem;
  border-left: 2px solid var(--clr-outline-variant);
  padding-left: 1.5rem;
  color: var(--clr-on-surface-variant);
}

.tag {
  display: inline-block;
  background: var(--clr-surface-container-highest);
  padding: 0.5rem 1rem;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
}

.tag-primary {
  color: var(--clr-primary);
  border: 1px solid rgba(255, 232, 135, 0.2);
  transform: rotate(-2deg);
}

.tag-secondary {
  color: var(--clr-secondary);
  border: 1px solid rgba(78, 160, 255, 0.2);
  transform: rotate(1deg);
}

.tag-tertiary {
  color: var(--clr-tertiary);
  border: 1px solid rgba(255, 113, 98, 0.2);
  transform: rotate(-1deg);
}

/* ── Features Section ── */
.features-section {
  padding: 8rem 0;
  background: var(--clr-background);
}

.features-header-title {
  font-family: var(--ff-headline);
  font-size: 3.75rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

.features-header-sub {
  font-family: 'Space Grotesk', monospace;
  color: var(--clr-on-surface-variant);
  font-size: 0.875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Feature cards */
.feature-card {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  transition: all 0.3s;
}

.feature-card-art {
  background: var(--clr-surface-container-low);
  justify-content: flex-end;
}

.feature-card-art .icon-bg {
  position: absolute;
  top: 0;
  right: 0;
  padding: 2rem;
}

.feature-card-art .icon-bg .material-symbols-outlined {
  font-size: 3.75rem;
  color: rgba(255, 232, 135, 0.2);
  transition: color 0.3s;
}

.feature-card-art:hover .icon-bg .material-symbols-outlined {
  color: rgba(255, 232, 135, 0.5);
}

.feature-card-art .overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 232, 135, 0.05);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-card-art:hover .overlay {
  opacity: 1;
}

.feature-card-art h3 {
  color: var(--clr-primary);
}

.feature-card-explore {
  background: var(--clr-surface-container-high);
  justify-content: space-between;
  border-top: 8px solid var(--clr-secondary);
}

.feature-card-explore .material-symbols-outlined {
  font-size: 2.25rem;
  color: var(--clr-secondary);
}

.feature-card-explore p {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  line-height: 1.625;
  color: var(--clr-on-surface-variant);
}

.feature-card-secrets {
  background: var(--clr-surface-container-highest);
  justify-content: space-between;
}

.feature-card-secrets .icon-box {
  width: 3rem;
  height: 3rem;
  background: var(--clr-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-card-secrets .icon-box .material-symbols-outlined {
  color: var(--clr-on-tertiary);
}

.feature-card-secrets .footer-row {
  margin-top: 2rem;
  border-top: 1px solid var(--clr-outline-variant);
  padding-top: 1rem;
}

.feature-card-secrets .footer-row .encrypted-label {
  font-family: 'Space Grotesk', monospace;
  font-size: 10px;
  letter-spacing: -0.05em;
  color: var(--clr-tertiary);
  text-transform: uppercase;
}

.feature-card-cta {
  background: var(--clr-primary);
  padding: 3rem;
}

.feature-card-cta h3 {
  font-family: var(--ff-headline);
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--clr-on-primary-container);
  line-height: 1;
  text-transform: uppercase;
}

.feature-card-cta .cta-sub {
  font-family: 'Space Grotesk', monospace;
  color: rgba(90, 76, 0, 0.7);
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 700;
}

.btn-preorder {
  white-space: nowrap;
  background: #000;
  color: var(--clr-primary);
  font-family: var(--ff-headline);
  padding: 1rem 2rem;
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  border: none;
  transform: skewX(-12deg);
  transition: all 0.15s;
}

.btn-preorder:hover {
  background: var(--clr-tertiary);
  color: #fff;
}

.btn-preorder:active {
  transform: skewX(-12deg) scale(0.95);
}

.feature-card h3 {
  font-family: var(--ff-headline);
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

/* ── Gallery / Marquee ── */
.gallery-section {
  padding: 5rem 0;
  background: var(--clr-surface-container-lowest);
  overflow: hidden;
}

.gallery-track {
  display: flex;
  gap: 1rem;
  animation: marquee 30s linear infinite;
}

.gallery-item {
  width: 300px;
  height: 400px;
  flex-shrink: 0;
  background: var(--clr-surface-container-high);
  border: 4px solid var(--clr-outline-variant);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.4s;
}

.gallery-item img:hover {
  filter: grayscale(0%);
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* ── Footer ── */
.site-footer {
  background: #0e0e0e;
  padding: 3rem 2rem;
}

.site-footer .brand {
  font-size: 1.125rem;
  font-weight: 900;
  color: var(--clr-primary);
  font-family: var(--ff-headline);
}

.site-footer .copyright {
  font-family: 'Space Grotesk', monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--clr-on-surface-variant);
  letter-spacing: 0.15em;
}

.site-footer .footer-link {
  font-family: 'Space Grotesk', monospace;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--clr-on-surface-variant);
  letter-spacing: 0.15em;
  text-decoration: underline;
  text-decoration-style: wavy;
  transition: color 0.2s;
}

.site-footer .footer-link:hover {
  color: var(--clr-tertiary);
}

.site-footer .footer-link:active {
  opacity: 0.7;
}

/* ── Responsive tweaks ── */
@media (max-width: 767.98px) {
  .hero-title {
    font-size: 4.5rem;
  }

  .features-header-title {
    font-size: 2.5rem;
  }

  .feature-card-cta h3 {
    font-size: 1.75rem;
  }
}
/* !# C0CKP1T_END style */
</style>
