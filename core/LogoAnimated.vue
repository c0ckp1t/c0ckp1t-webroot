<script setup>
/*
  Animated inline SVG logo for the navbar.
  Transitions between two visual states based on sidebar open/close.

  Props:
    isOpen (Boolean) - true when sidebar is open

  Sidebar Closed (default):
    - Bright yellow head (#ffdf11)
    - X-shaped eyes (normal)
    - Smile visible
    - Neck visible

  Sidebar Open:
    - Darker gold head (#c4a900)
    - Eyes rotate to horizontal dashes (squinting)
    - Smile subtle change
    - Neck fades out
*/
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <svg
    :class="['logo-animated', { 'logo-open': isOpen }]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 78.31498 89.318481"
    height="24"
    aria-label="Toggle sidebar"
    role="button"
  >
    <g transform="translate(-58.970072,-89.839213)" class="logo-layer">

      <!-- Head -->
      <ellipse
        class="logo-head"
        ry="37.436966"
        rx="39.0252"
        cy="129.01283"
        cx="97.967125"
      />

      <!-- Left Eye (two crossing paths forming an X) -->
      <g class="logo-left-eye">
        <path
          class="logo-eye-stroke"
          d="M 62.802996,126.14677 C 83.82199,101.23898 83.964978,101.06953 83.964978,101.06953"
          style="stroke-width:1.17285"
        />
        <path
          class="logo-eye-stroke"
          d="M 82.6223,124.4643 C 65.50242,101.25919 65.230678,101.25919 65.230678,101.25919"
          style="stroke-width:1.47804"
        />
      </g>

      <!-- Right Eye (two crossing paths forming an X) -->
      <g class="logo-right-eye">
        <path
          class="logo-eye-stroke"
          d="m 104.50542,128.9234 c 17.98743,-24.4738 18.1098,-24.64029 18.1098,-24.64029"
          style="stroke-width:1.74255"
        />
        <path
          class="logo-eye-stroke"
          d="M 119.97488,125.1614 C 104.59226,105.53305 104.34809,105.53305 104.34809,105.53305"
          style="stroke-width:0.863069"
        />
      </g>

      <!-- Smile -->
      <path
        class="logo-smile"
        d="m 128.94069,130.81133 c -4.85524,28.95711 -45.118395,28.26865 -57.939008,25.5371"
      />

      <!-- Neck -->
      <rect
        class="logo-neck"
        y="164.78011"
        x="89.790077"
        height="8.6218405"
        width="19.292933"
      />
      <rect
        class="logo-neck logo-neck-lower"
        width="12.705888"
        height="6.1260414"
        x="93.640526"
        y="172.92065"
      />

    </g>
  </svg>
</template>

<style scoped>
/* ─── Base Styles ─── */
.logo-animated {
  display: inline-block;
  vertical-align: text-top;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo-animated:hover {
  transform: scale(1.08);
}

/* ─── Head ─── */
.logo-head {
  fill: #ffdf11;
  fill-opacity: 1;
  fill-rule: evenodd;
  stroke: #000000;
  stroke-width: 0.264583;
  stroke-opacity: 1;
  transition: fill 0.3s ease;
}

.logo-open .logo-head {
  fill: #c4a900;
}

/* ─── Eyes ─── */
.logo-eye-stroke {
  fill: none;
  stroke: #000000;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
  stroke-opacity: 1;
}

.logo-left-eye,
.logo-right-eye {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/*
  Left eye center ~(73.4, 113.6) in absolute SVG coords.
  When open: scale Y to 0 (collapse X into horizontal dash) and slight rotation.
*/
.logo-left-eye {
  transform-origin: 73.4px 113.6px;
}

.logo-open .logo-left-eye {
  transform: scaleY(0.15) rotate(-10deg);
}

/*
  Right eye center ~(112.2, 117.2) in absolute SVG coords.
*/
.logo-right-eye {
  transform-origin: 112.2px 117.2px;
}

.logo-open .logo-right-eye {
  transform: scaleY(0.15) rotate(10deg);
}

/* ─── Smile ─── */
.logo-smile {
  fill: none;
  stroke: #000000;
  stroke-width: 1.39662;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 4;
  stroke-opacity: 1;
  transition: stroke-width 0.3s ease, opacity 0.3s ease;
}

.logo-open .logo-smile {
  stroke-width: 2;
  opacity: 0.85;
}

/* ─── Neck ─── */
.logo-neck {
  fill: #ffdf11;
  fill-opacity: 1;
  stroke: #000000;
  stroke-width: 0.264951;
  stroke-miterlimit: 4;
  stroke-opacity: 1;
  transition: opacity 0.3s ease, fill 0.3s ease;
}

.logo-neck-lower {
  stroke-width: 0.222;
}

.logo-open .logo-neck {
  opacity: 0;
}
</style>
