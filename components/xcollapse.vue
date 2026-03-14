<script setup>
/*
<x-collapse k="Services" v-model="local.myToggle">Body of collapse</x-collapse>
<x-collapse style="border: 1px solid green" k="Services" v-model="local.myToggle">Body of collapse</x-collapse>

use modelValue="true"  for input only
*/
import { ref, watch, computed } from 'vue';

const props = defineProps({
    k: String,
    modelValue: {
      type: Boolean,
      default: false
    }
})

const isOpenRef = ref(props.modelValue)
const emit = defineEmits(['update:modelValue']);

// Watch for external changes to modelValue and update isOpenRef accordingly
watch(() => props.modelValue, (newVal) => {
  isOpenRef.value = newVal;
});

// Emit changes when isOpenRef changes, to update the parent's v-model binding if used
watch(isOpenRef, (newVal) => {
  emit('update:modelValue', newVal);
});


function clickEvent() {
  isOpenRef.value = !isOpenRef.value; // This will also emit the update:modelValue event
}

</script>


<template >
    <div>
        <button @click="clickEvent" class="btn btn-light w-100" type="button">
            <span v-if="isOpenRef"><i class="fa-solid fa-minus"></i> {{ k }}</span>
            <span v-if="!isOpenRef"><i class="fa-solid fa-plus"></i> {{ k }}</span>
        </button>
        <div class="" v-if="isOpenRef">
            <slot></slot>
        </div>
    </div>
</template>


<style scoped></style>
