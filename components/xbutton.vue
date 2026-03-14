<script setup>
/*
    Usage:

    <x-button :isLoading="local.isLoading" @callback="callback"></x-button>

*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import { ref } from 'vue'

const props = defineProps({
    isLoading: Boolean,
    icon: {
        type: String,
        default: "fa-file",
    },
    extras: {
        type: String,
        default: "btn-dark"
    }
})

// fa-floppy-disk
// fa-arrows-rotate
// fa-trash

const emit = defineEmits(['callback'])

function buttonClick() {
    emit('callback')
}

</script>

<template >
    <button class="btn" :class="props.extras" @click.stop="buttonClick()">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading"></span>
        <span class="icon" v-if="!props.isLoading"> <i class="fa-solid" :class="props.icon"></i> </span>
        <slot></slot>
    </button>
</template>

<style scoped></style>
