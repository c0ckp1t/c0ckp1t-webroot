<script setup>
/*
  xdropdown2 - Native select dropdown with optgroup support

      <!-- With v-model only -->
     <xdropdown2
       v-model="selectedValue"
       :items="[{k: 'Option 1', v: 'opt1'}, {k: 'Option 2', v: 'opt2'}]"
       default-label="Choose..."
     />

     <!-- With callback only -->
     <xdropdown2
       :items="items"
       :on-change="(value) => handleSelection(value)"
       default-label="Select an option"
       group-label="Available Options"
     />

     <!-- With both v-model and callback -->
     <xdropdown2
       v-model="selectedTheme"
       :items="themeItems"
       :on-change="loadTheme"
       default-label="Custom Editor"
       group-label="Themes"
       k="Theme:"
     />


  Props:
    - items: Array of {k: 'label', v: 'value'} objects
    - k: Optional label displayed before the select
    - modelValue: The selected value (for v-model)
    - defaultLabel: Label for the default null option (default: "Select...")
    - groupLabel: Label for the optgroup (optional)
    - onChange: Callback function called with the selected value
    - maxWidth: Max width of select (default: '250px')
*/
import {computed, onMounted} from 'vue'

const props = defineProps({
  // [{k: 'item1key', v: 'item1'}, {k: 'item2key', v: 'item2'}]
  items: {
    type: Array,
    default: () => []
  }, 
  k: String,
  modelValue: { 
    default: null 
  },
  defaultLabel: {
    type: String,
    default: 'Select...'
  },
  groupLabel: {
    type: String,
    default: null
  },
  onChange: {
    type: Function,
    default: null
  },
  maxWidth: {
    type: String,
    default: '350px'
  }
})

const emit = defineEmits(['update:modelValue'])

// ________________________________________________________________________________
// METHODS
// ________________________________________________________________________________
function handleChange(event) {
  const rawValue = event.target.value
  // Convert empty string back to null for the default option
  const value = rawValue === '' ? null : rawValue
  
  // Emit for v-model support
  emit('update:modelValue', value)
  
  // Call the onChange callback if provided
  if (props.onChange) {
    props.onChange(value)
  }
}

// ________________________________________________________________________________ 
// INIT
// ________________________________________________________________________________ 
async function init() {
}

onMounted(async () => { init() })

// END OF SCRIPT
</script>


<template>

<div class="xdropdown2">
  <span class="pe-2 fw-bold" v-if="props.k">{{ props.k }}</span>
  <select 
    class="form-select" 
    :style="{ maxWidth: props.maxWidth }"
    :value="props.modelValue ?? ''"
    @change="handleChange"
  >
    <option value="">{{ props.defaultLabel }}</option>
    <optgroup v-if="props.groupLabel" :label="props.groupLabel">
      <option 
        v-for="obj in props.items" 
        :key="obj.v" 
        :value="obj.v"
      >
        {{ obj.k }}
      </option>
    </optgroup>
    <template v-else>
      <option 
        v-for="obj in props.items" 
        :key="obj.v" 
        :value="obj.v"
      >
        {{ obj.k }}
      </option>
    </template>
  </select>
</div>

</template>

<style scoped>
.xdropdown2 {
  display: inline-flex;
  align-items: center;
}
</style>
