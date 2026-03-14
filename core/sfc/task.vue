<script setup>
/*
 <Task :event="task"></Task>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
// { "endpoint": "/wf/20", "type": "TASK_CREATED", "message": "36", "kv": {}, "createdMs": 1745387413063 }
const props = defineProps({
  event: Object
})

// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________

function formatDate(createdMs) {
  if (!createdMs) return ''
  const date = new Date(createdMs)
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

</script>

<template>
  <div v-if="props.event" class="task-item">
    <div class="task-header">
      <span
          class="task-type"
          :class="[
          props.event.type.toLowerCase().includes('error') || props.event.type.toLowerCase().includes('fail')
            ? 'type-error'
            : 'type-complete'
        ]"
      >
        {{ props.event.type }}
      </span>
      <span class="task-time">{{ formatDate(props.event.createdMs) }}</span>
    </div>
    <div class="task-message">{{ props.event?.message }}</div>
  </div>
</template>

<style scoped>
.task-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid #8a8a8a;
  border-radius: 0 4px 4px 0;
  background-color: rgba(255, 255, 255, 0.08);
  font-size: 0.85rem;
  transition: background-color 0.2s;
  color: #e0e0e0;
}

.task-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.task-type {
  font-weight: bold;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  text-transform: uppercase;
  background-color: #5a5a5a;
  color: #e0e0e0;
}

.type-error, .type-failed {
  background-color: #b71c1c;
  color: white;
}

.type-complete, .type-success {
  background-color: #2e7d32;
  color: white;
}

.task-time {
  color: #aaa;
  font-size: 0.7rem;
}

.task-message {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>