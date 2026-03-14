<script setup>
import { reactive, computed, markRaw, onMounted, onBeforeUnmount } from 'vue'

// https://wavesurfer-js.org/docs/
// NOTE: streaming not supported?
import WaveSurfer from 'wavesurfer'

const STATE = {
    INIT: "INIT",
    LOADING: "LOADING",
    READY: "READY",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
}

//--------------------------------------------------------------------------------------
// PROPERTIES
//--------------------------------------------------------------------------------------
const props = defineProps({
    url: String,
    id: String,
    autoLoad: Boolean
})

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________
const local = reactive({
    state: STATE.INIT,
    loadingProgress: 0,
    wavesurfer: null,
    currentTime: 0,
    duration: 0,
    playbackRate: '1',
})

// Playback rate options for dropdown
const playbackRateOptions = [
    { k: '0.5x', v: '0.5' },
    { k: '0.75x', v: '0.75' },
    { k: '1x', v: '1' },
    { k: '1.25x', v: '1.25' },
    { k: '1.5x', v: '1.5' },
    { k: '2x', v: '2' },
]

// ________________________________________________________________________________
// COMPUTED
// ________________________________________________________________________________
const buttonText = computed(() => {
    if (local.state === STATE.INIT) return "LOAD"
    if (local.state === STATE.LOADING) return "LOADING..."
    if (local.state === STATE.PLAYING) return "PAUSE"
    return "PLAY"
})

const buttonIcon = computed(() => {
    if (local.state === STATE.INIT) return "fa-download"
    if (local.state === STATE.LOADING) return "fa-spinner fa-spin"
    if (local.state === STATE.PLAYING) return "fa-pause"
    return "fa-play"
})

const formattedCurrentTime = computed(() => formatTime(local.currentTime))
const formattedDuration = computed(() => formatTime(local.duration))

// ________________________________________________________________________________
// HELPER FUNCTIONS
// ________________________________________________________________________________
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

//--------------------------------------------------------------------------------------
// WAVE SURFER
//--------------------------------------------------------------------------------------

// must be created after mounted
async function buildDOMForWaveSurfer() {
  const rootStyles = getComputedStyle(document.documentElement)
  const waveColor = rootStyles.getPropertyValue('--bs-secondary').trim() || '#6c757d'
  const progressColor = rootStyles.getPropertyValue('--bs-info').trim() || '#0dcaf0'

  const wavesurfer = WaveSurfer.create({
        container: `#waveId${props.id}`,
        waveColor: waveColor,
        progressColor: progressColor,
        hideScrollbar: true,
        height: 48,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        xhr: {
            mode: "cors",
        }
    });
    local.wavesurfer = markRaw(wavesurfer)

    // Event listeners
    wavesurfer.on("finish", function () {
        local.state = STATE.PAUSED
    })

    wavesurfer.on("error", function (error) {
        console.error("WaveSurfer ERROR:", error)
        local.state = STATE.INIT
    })

    wavesurfer.on('loading', function (progress) {
        local.loadingProgress = progress
    })

    wavesurfer.on('ready', function () {
        local.state = STATE.PAUSED
        local.duration = wavesurfer.getDuration()
    })

    wavesurfer.on('play', function () {
        local.state = STATE.PLAYING
    })

    wavesurfer.on('pause', function () {
        local.state = STATE.PAUSED
    })

    wavesurfer.on('timeupdate', function (currentTime) {
        local.currentTime = currentTime
    })
}

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function loadFromURL() {
    local.wavesurfer.load(props.url)
}

function clickPlayPause() {
    if (local.state === STATE.INIT) {
        loadFromURL()
        local.state = STATE.LOADING
    } else {
        local.wavesurfer.playPause()
    }
}

function onPlaybackRateChange(value) {
    if (value && local.wavesurfer) {
        const rate = parseFloat(value)
        local.wavesurfer.setPlaybackRate(rate, true) // true = preserve pitch
    }
}

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {
    await buildDOMForWaveSurfer()
    if (props.autoLoad === true) { loadFromURL() }
}

onMounted(async () => { init() })
onBeforeUnmount(() => {
    if (local.wavesurfer) {
        local.wavesurfer.destroy()
    }
})
</script>


<template>
    <div class="xsound-player" v-if="id">
        <!-- Waveform -->
        <div class="waveform-container">
            <div :id="'waveId' + props.id"></div>
        </div>
        
        <!-- Controls Row -->
        <div class="controls-row d-flex align-items-center justify-content-between">
            <!-- Play/Pause Button -->
            <button 
                @click="clickPlayPause" 
                class="btn btn-outline-secondary btn-xs"
                :disabled="local.state === STATE.LOADING"
            >
                <i class="fa-solid" :class="buttonIcon"></i>
                <span class="ms-1">{{ buttonText }}</span>
            </button>
            
            <!-- Time Display -->
            <div class="time-display small mx-2">
                <span class="font-monospace">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
            </div>
            
            <!-- Playback Rate -->
            <x-dropdown2
                v-model="local.playbackRate"
                :items="playbackRateOptions"
                :on-change="onPlaybackRateChange"
                default-label="Speed"
                k=""
                max-width="80px"
            />
        </div>
    </div>
</template>


<!-- ________________________________________________________________________________ -->
<!-- STYLE -->
<!-- ________________________________________________________________________________ -->
<style scoped>
.xsound-player {
    border: 1px solid var(--bs-border-color);
    border-radius: var(--bs-border-radius);
    background-color: var(--bs-body-bg);
}

.waveform-container {
    min-height: 48px;
    padding: 0.25rem 0.5rem;
}

.controls-row {
    padding: 0.25rem 0.5rem;
    border-top: 1px solid var(--bs-border-color);
    gap: 0.5rem;
}

.btn-xs {
    padding: 0.1rem 0.4rem;
    font-size: 0.75rem;
    line-height: 1.2;
    min-width: 70px;
}

.time-display {
    flex-shrink: 0;
    font-size: 0.75rem;
}

:deep(.xdropdown2 .form-select) {
    padding: 0.1rem 1.5rem 0.1rem 0.4rem;
    font-size: 0.75rem;
    line-height: 1.2;
}
</style>
