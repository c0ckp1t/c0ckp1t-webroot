<script setup>
import {ref, reactive, markRaw, onMounted, onBeforeUnmount, watch, nextTick} from 'vue';

const root = ref(null);
const inputRef = ref(null);

// Available themes (extracted from /public/js_ext/ace-editor/theme-*.js)
const themes = [
  'ambiance', 'chaos', 'chrome', 'cloud9_day', 'cloud9_night', 'cloud9_night_low_color',
  'cloud_editor', 'cloud_editor_dark', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor',
  'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'github_dark', 'github_light_default',
  'gob', 'gruvbox', 'gruvbox_dark_hard', 'gruvbox_light_hard', 'idle_fingers', 'iplastic',
  'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'mono_industrial',
  'monokai', 'nord_dark', 'one_dark', 'pastel_on_dark', 'solarized_dark', 'solarized_light',
  'sqlserver', 'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue',
  'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'
].sort();

// Sample files for ls command
const sampleFiles = [
  'config.json', 'readme.md', 'app.mjs', 'package.json', 'index.html',
  'style.css', 'main.mjs', 'router.mjs', 'utils.mjs', 'constants.mjs',
  'data.json', 'settings.yaml', 'Makefile', 'Dockerfile', '.gitignore',
  '.env', 'server.mjs', 'api.mjs', 'helpers.mjs', 'types.d.ts'
];

// Local reactive state
const local = reactive({
  currentTheme: 'terminal',
  currentWrap: false,
  currentShowPrintMargin: false,
  currentShowGutter: true,
  // Terminal state
  currentDirectory: '/home/user',
  currentInput: '',
  inputHistory: [],
  historyIndex: -1,
  outputContent: '',
});

const props = defineProps({
  theme: {
    type: String,
    default: 'terminal',
  },
  fontSize: {
    type: Number,
    default: 14,
  },
  height: {
    type: String,
    default: '400px',
  },
  wrap: Boolean,
  printMargin: {
    type: [Boolean, Number],
    default: false,
  },
});

const emit = defineEmits(['init', 'command']);

let _editor = undefined;
let _ro = undefined;

// Watchers for toolbar controls
watch(() => local.currentTheme, (val) => {
  if (_editor && val) _editor.setTheme('ace/theme/' + val);
});

watch(() => local.currentWrap, (val) => {
  if (_editor) _editor.setOption('wrap', val);
});

watch(() => local.currentShowPrintMargin, (val) => {
  if (_editor) _editor.setShowPrintMargin(val);
});

watch(() => local.currentShowGutter, (val) => {
  if (_editor) _editor.setOption('showGutter', val);
});

// ________________________________________________________________________________
// COMMAND EXECUTION
// ________________________________________________________________________________

function getRandomFiles(count = 3) {
  const shuffled = [...sampleFiles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function executeCommand(cmd) {
  const trimmed = cmd.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Simulate async execution
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

  switch (command) {
    case 'ls':
      return getRandomFiles(3).join('  ');
    
    case 'pwd':
      return local.currentDirectory;
    
    case 'cd':
      if (args.length === 0 || args[0] === '~') {
        local.currentDirectory = '/home/user';
        return '';
      } else if (args[0] === '..') {
        const parts = local.currentDirectory.split('/').filter(p => p);
        if (parts.length > 0) {
          parts.pop();
          local.currentDirectory = '/' + parts.join('/') || '/';
        }
        return '';
      } else if (args[0].startsWith('/')) {
        local.currentDirectory = args[0];
        return '';
      } else {
        local.currentDirectory = local.currentDirectory === '/' 
          ? '/' + args[0] 
          : local.currentDirectory + '/' + args[0];
        return '';
      }
    
    case 'clear':
      local.outputContent = '';
      if (_editor) {
        _editor.setValue('', 1);
      }
      return null; // null means don't append anything
    
    case 'help':
      return `Available commands:
  ls      - List files in current directory
  pwd     - Print working directory
  cd      - Change directory (cd, cd .., cd <dir>)
  clear   - Clear terminal
  help    - Show this help message`;
    
    default:
      return `bash: ${command}: command not found`;
  }
}

function getPrompt() {
  return `user@c0ckp1t:${local.currentDirectory}$ `;
}

async function handleCommand() {
  const cmd = local.currentInput;
  local.currentInput = '';
  
  // Add to history if not empty
  if (cmd.trim()) {
    local.inputHistory.push(cmd);
    local.historyIndex = local.inputHistory.length;
  }
  
  // Add command line to output
  const promptLine = getPrompt() + cmd;
  appendToOutput(promptLine);
  
  // Execute and get result
  const result = await executeCommand(cmd);
  
  // Append result if not null (clear returns null)
  if (result !== null && result !== '') {
    appendToOutput(result);
  }
  
  // Emit event for external handling
  emit('command', { command: cmd, result });
  
  // Scroll to bottom
  scrollToBottom();
}

function appendToOutput(text) {
  if (local.outputContent) {
    local.outputContent += '\n' + text;
  } else {
    local.outputContent = text;
  }
  
  if (_editor) {
    _editor.setValue(local.outputContent, 1);
    scrollToBottom();
  }
}

function scrollToBottom() {
  if (_editor) {
    nextTick(() => {
      const lastLine = _editor.session.getLength();
      _editor.gotoLine(lastLine, 0, false);
      _editor.scrollToLine(lastLine, false, false, () => {});
    });
  }
}

function onKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleCommand();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (local.historyIndex > 0) {
      local.historyIndex--;
      local.currentInput = local.inputHistory[local.historyIndex] || '';
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (local.historyIndex < local.inputHistory.length - 1) {
      local.historyIndex++;
      local.currentInput = local.inputHistory[local.historyIndex] || '';
    } else {
      local.historyIndex = local.inputHistory.length;
      local.currentInput = '';
    }
  }
}

async function copyToClipboard() {
  const content = _editor ? _editor.getValue() : local.outputContent;
  try {
    await navigator.clipboard.writeText(content);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
}

function focusInput(options = {}) {
  if (inputRef.value) {
    inputRef.value.focus({ preventScroll: true, ...options });
  }
}

// ________________________________________________________________________________
// LIFECYCLE
// ________________________________________________________________________________

onMounted(() => {
  if (typeof ace === 'undefined') {
    console.error('Ace editor not loaded');
    return;
  }
  
  ace.config.set('basePath', '/js_ext/ace-editor');
  _editor = markRaw(ace.edit(root.value, {
    mode: 'ace/mode/sh',
    theme: 'ace/theme/' + props.theme,
    readOnly: true,
    wrap: props.wrap,
    printMargin: props.printMargin,
    useWorker: false,
    showGutter: true,
    highlightActiveLine: false,
    highlightGutterLine: false,
  }));

  _editor.setFontSize(props.fontSize);
  
  // Click on editor should focus the input
  _editor.container.addEventListener('click', focusInput);

  // Initialize local state from props
  local.currentTheme = props.theme;
  local.currentWrap = props.wrap || false;
  local.currentShowPrintMargin = props.printMargin !== false;
  local.currentShowGutter = true;

  _ro = new ResizeObserver(() => _editor.resize());
  _ro.observe(root.value);
  
  emit('init', { editor: _editor, executeCommand, appendToOutput });
  
  // Focus input on mount
  nextTick(() => focusInput());
});

onBeforeUnmount(() => {
  if (_ro) _ro.disconnect();
  if (_editor) {
    _editor.container.removeEventListener('click', focusInput);
    _editor.destroy();
  }
});

// Expose methods for parent components
defineExpose({
  executeCommand,
  appendToOutput,
  focusInput,
  copyToClipboard,
});
</script>

<template>
  <div class="xterminal" :style="{ height: props.height }">
    <div class="terminal-toolbar">
      <label>
        Theme:
        <select v-model="local.currentTheme">
          <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <label class="toggle-label">
        <input type="checkbox" v-model="local.currentWrap" />
        Wrap
      </label>
      <label class="toggle-label">
        <input type="checkbox" v-model="local.currentShowPrintMargin" />
        Print Margin
      </label>
      <label class="toggle-label">
        <input type="checkbox" v-model="local.currentShowGutter" />
        Gutter
      </label>
      <button class="copy-btn" @click="copyToClipboard" title="Copy all output to clipboard">
        <i class="fa-solid fa-copy"></i> Copy All
      </button>
    </div>
    <div ref="root" class="terminal-output"></div>
    <div class="terminal-input-line">
      <span class="prompt">{{ getPrompt() }}</span>
      <input 
        ref="inputRef"
        v-model="local.currentInput" 
        @keydown="onKeyDown"
        class="terminal-input"
        type="text"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
  </div>
</template>

<style scoped>
.xterminal {
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
}

.terminal-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 4px 8px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
  font-size: 12px;
  color: #ccc;
  align-items: center;
}

.terminal-toolbar label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.terminal-toolbar select {
  font-size: 12px;
  padding: 2px 4px;
  background: #3c3c3c;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 3px;
}

.terminal-toolbar select:focus {
  outline: none;
  border-color: #007acc;
}

.terminal-toolbar .toggle-label {
  cursor: pointer;
  user-select: none;
}

.terminal-toolbar input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
}

.copy-btn {
  margin-left: auto;
  padding: 3px 8px;
  font-size: 12px;
  background: #3c3c3c;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-btn:hover {
  background: #4c4c4c;
  border-color: #666;
}

.copy-btn:active {
  background: #555;
}

.terminal-output {
  flex: 1;
  min-height: 0;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: #1e1e1e;
  border-top: 1px solid #333;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
}

.prompt {
  color: #4ec9b0;
  white-space: nowrap;
  user-select: none;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #d4d4d4;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  margin-left: 4px;
}

.terminal-input::placeholder {
  color: #6a6a6a;
}
</style>
