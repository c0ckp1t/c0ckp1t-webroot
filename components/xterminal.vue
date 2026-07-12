<script setup>
/*
  Usage Examples:

  1. Demo mode (zero config, built-in demo commands work out of the box):
     <XTerminal />

  2. Custom terminal with command handler:
     <XTerminal
       prompt="myapp> "
       :onCommand="handleCmd"
       :showToolbar="false"
       greeting="Welcome to MyApp v1.0\nType 'help' for available commands."
       height="500px"
       :fontSize="16"
       theme="twilight"
     />

  3. Command handler in parent (return-based):
     The third argument is a utils object: { clear, appendToOutput }
     function handleCmd(command, args, { clear, appendToOutput }) {
       if (command === 'clear') { clear(); return null; }
       if (command === 'hello') return 'Hello, world!';
       if (command === 'status') return fetchStatus(); // can return a Promise<string>
       return undefined; // fall through to built-in demo commands
     }

  4. Streaming command handler (for long-running commands like tail -f):
     The start callback also receives utils as its second argument.
     function handleCmd(command, args) {
       if (command === 'tail') {
         return {
           stream: true,
           start(writer, { clear }) {
             clear(); // optionally clear before streaming
             const interval = setInterval(() => {
               writer.write(`[${new Date().toISOString()}] log line...`);
             }, 1000);
             writer.onAbort(() => clearInterval(interval));
             // call writer.done() when the stream is finished
           }
         };
       }
       return `result of ${command}`;
     }

  5. Fire-and-forget output via ref (notifications, external events):
     <XTerminal ref="term" />
     ...
     term.value.appendToOutput('[ALERT] Something happened');

  Props:
    prompt       String        default '$ '       — The prompt text shown before the input
    onCommand    Function      default null        — (command, args, utils) => string|null|undefined|Promise|{stream,start}
                                                     utils: { clear(), appendToOutput(text) }
                                                     stream start(writer, utils) also receives utils
    showToolbar  Boolean       default true        — Show/hide the theme/settings toolbar
    greeting     String        default ''          — Initial text shown in terminal on mount
    mode         String        default 'sh'        — Ace editor syntax highlighting mode
    theme        String        default 'terminal'  — Ace editor theme
    fontSize     Number        default 14          — Font size in pixels
    height       String        default '400px'     — Component height
    wrap         Boolean       default false       — Wrap long lines
    printMargin  Boolean|Number default false       — Show print margin

  Events:
    @init        { editor, appendToOutput }        — Fired after ace editor initializes
    @command     { command, args, result }          — Fired after every command execution (observability)

  Exposed methods (via ref):
    appendToOutput(text)   — Push text to the terminal output
    focusInput()           — Focus the input field
    copyToClipboard()      — Copy all output to clipboard
    clear()                — Clear the terminal output
 */
import {ref, reactive, markRaw, onMounted, onBeforeUnmount, watch, nextTick} from 'vue';
import {loadAce} from './AceLoader.mjs';

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

// ________________________________________________________________________________
// BUILT-IN DEMO COMMANDS (used when onCommand is not provided or returns undefined)
// ________________________________________________________________________________

const sampleFiles = [
  'config.json', 'readme.md', 'app.mjs', 'package.json', 'index.html',
  'style.css', 'main.mjs', 'router.mjs', 'utils.mjs', 'constants.mjs',
  'data.json', 'settings.yaml', 'Makefile', 'Dockerfile', '.gitignore',
  '.env', 'server.mjs', 'api.mjs', 'helpers.mjs', 'types.d.ts'
];

function getRandomFiles(count = 3) {
  const shuffled = [...sampleFiles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Internal demo directory state (only used by built-in demo commands)
let _demoDirectory = '/home/user';

async function demoExecuteCommand(command, args) {
  // Simulate async execution
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

  switch (command) {
    case 'ls':
      return getRandomFiles(3).join('  ');

    case 'pwd':
      return _demoDirectory;

    case 'cd':
      if (args.length === 0 || args[0] === '~') {
        _demoDirectory = '/home/user';
        return '';
      } else if (args[0] === '..') {
        const parts = _demoDirectory.split('/').filter(p => p);
        if (parts.length > 0) {
          parts.pop();
          _demoDirectory = '/' + parts.join('/') || '/';
        }
        return '';
      } else if (args[0].startsWith('/')) {
        _demoDirectory = args[0];
        return '';
      } else {
        _demoDirectory = _demoDirectory === '/'
          ? '/' + args[0]
          : _demoDirectory + '/' + args[0];
        return '';
      }

    case 'clear':
      clear();
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

// ________________________________________________________________________________
// LOCAL STATE
// ________________________________________________________________________________

const local = reactive({
  currentTheme: 'terminal',
  currentWrap: false,
  currentShowPrintMargin: false,
  currentShowGutter: true,
  // Terminal state
  currentInput: '',
  inputHistory: [],
  historyIndex: -1,
  outputContent: '',
  // Streaming state
  isStreaming: false,
  _abortFn: null,
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
  prompt: {
    type: String,
    default: '$ ',
  },
  onCommand: {
    type: Function,
    default: null,
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  greeting: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'sh',
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

async function handleCommand() {
  const cmd = local.currentInput;
  local.currentInput = '';

  // Add to history if not empty
  if (cmd.trim()) {
    local.inputHistory.push(cmd);
    local.historyIndex = local.inputHistory.length;
  }

  // Don't process empty commands
  const trimmed = cmd.trim();
  if (!trimmed) {
    appendToOutput(props.prompt);
    scrollToBottom();
    return;
  }

  // Parse command and args
  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Add command line to output
  const promptLine = props.prompt + cmd;
  appendToOutput(promptLine);

  let result;

  // Utilities object passed to onCommand and stream start handlers
  const utils = { clear, appendToOutput };

  // If onCommand prop is provided, call it first
  if (props.onCommand) {
    result = await props.onCommand(command, args, utils);

    // Check for streaming response
    if (result && typeof result === 'object' && result.stream === true && typeof result.start === 'function') {
      local.isStreaming = true;
      local._abortFn = null;

      const writer = {
        write(text) {
          appendToOutput(text);
        },
        done() {
          local.isStreaming = false;
          local._abortFn = null;
          scrollToBottom();
          nextTick(() => focusInput());
        },
        onAbort(fn) {
          local._abortFn = fn;
        },
      };

      result.start(writer, utils);

      // Emit for observability
      emit('command', { command, args, result: '[streaming]' });
      return;
    }

    // If onCommand returns undefined, fall through to demo commands
    if (result === undefined) {
      result = await demoExecuteCommand(command, args);
    }
  } else {
    // No onCommand prop — use built-in demo commands
    result = await demoExecuteCommand(command, args);
  }

  // Append result if not null (clear returns null)
  if (result !== null && result !== '') {
    appendToOutput(result);
  }

  // Emit event for observability
  emit('command', { command, args, result });

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

function clear() {
  local.outputContent = '';
  if (_editor) {
    _editor.setValue('', 1);
  }
}

function onKeyDown(event) {
  // Ctrl+C while streaming: abort the stream
  if (event.key === 'c' && event.ctrlKey && local.isStreaming) {
    event.preventDefault();
    appendToOutput('^C');
    if (local._abortFn) {
      local._abortFn();
    }
    local.isStreaming = false;
    local._abortFn = null;
    scrollToBottom();
    return;
  }

  if (local.isStreaming) {
    // Block all other input while streaming
    event.preventDefault();
    return;
  }

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

onMounted(async () => {
  try {
    await loadAce()
  } catch (err) {
    console.error('Ace editor failed to load:', err)
    return
  }

  // Guard: component may have unmounted during async loadAce()
  if (!root.value) return;

  ace.config.set('basePath', '/js_ext/ace-editor');
  _editor = markRaw(ace.edit(root.value, {
    mode: 'ace/mode/' + props.mode,
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

  // Show greeting if provided
  if (props.greeting) {
    appendToOutput(props.greeting);
  }

  emit('init', { editor: _editor, appendToOutput });

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
  appendToOutput,
  focusInput,
  copyToClipboard,
  clear,
});
</script>

<template>
  <div class="xterminal" :style="{ height: props.height }">
    <div v-if="props.showToolbar" class="terminal-toolbar">
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
      <span v-if="local.isStreaming" class="prompt streaming-indicator">running...</span>
      <span v-else class="prompt">{{ props.prompt }}</span>
      <input
        ref="inputRef"
        v-model="local.currentInput"
        @keydown="onKeyDown"
        class="terminal-input"
        :class="{ 'is-streaming': local.isStreaming }"
        type="text"
        spellcheck="false"
        autocomplete="off"
        :placeholder="local.isStreaming ? 'Ctrl+C to abort' : ''"
        :readonly="local.isStreaming"
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

.streaming-indicator {
  color: #e5c07b;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
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

.terminal-input.is-streaming {
  color: #6a6a6a;
  cursor: default;
}

.terminal-input::placeholder {
  color: #6a6a6a;
}
</style>
