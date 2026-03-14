<script setup>
/*
 <v-ace-editor v-model="local.resultText" lang="kotlin" theme="twilight"
    style="height: 800px"></v-ace-editor>
*/

import {ref, reactive, markRaw, onMounted, onBeforeUnmount, watch} from 'vue';

const root = ref("");

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

// Available languages/modes (extracted from /public/js_ext/ace-editor/mode-*.js)
const langs = [
    'abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'aql', 'asciidoc',
    'assembly_arm32', 'assembly_x86', 'basic', 'batchfile', 'c9search', 'cirru', 'coffee',
    'coldfusion', 'crystal', 'csound_score', 'csv', 'd', 'dockerfile', 'dot', 'edifact',
    'elm', 'erlang', 'flix', 'forth', 'fortran', 'fsharp', 'gitignore', 'gobstones',
    'golang', 'groovy', 'haml', 'haskell', 'hjson', 'html_elixir', 'ini', 'io', 'ion',
    'java', 'javascript', 'json', 'jsoniq', 'jsx', 'julia', 'kotlin', 'latte', 'liquid',
    'livescript', 'logtalk', 'lsl', 'lucene', 'markdown', 'mask', 'matlab', 'mips',
    'mysql', 'nasal', 'nginx', 'nix', 'nsis', 'nunjucks', 'ocaml', 'partiql', 'perl',
    'php_laravel_blade', 'powershell', 'prql', 'puppet', 'qml', 'r', 'raku', 'rdoc',
    'red', 'rhtml', 'robot', 'rst', 'ruby', 'sass', 'scala', 'scad', 'sh', 'sjs',
    'snippets', 'soy_template', 'sparql', 'terraform', 'text', 'textile', 'toml',
    'tsx', 'turtle', 'vala', 'vbscript', 'velocity', 'vhdl', 'vue', 'wollok', 'xml',
    'xquery', 'zeek'
].sort();

// Local reactive state for debug controls
const local = reactive({
    currentTheme: '',
    currentLang: '',
    currentWrap: false,
    currentShowPrintMargin: true,
    currentShowGutter: true,
    currentRelativeLineNumbers: false,
});

const props = defineProps({
      modelValue: {
        type: String,
        required: true,
      },
      lang: {
        type: String,
        default: 'sh',
      },
      theme: {
        type: String,
        default: 'chrome',
      },
      fontSize: {
        type: Number,
        default: 14,
      },
      height: {
        type: String,
        default: '300px',
      },
      debug: {
        type: Boolean,
        default: false,
      },
      options: Object,
      placeholder: String,
      readonly: Boolean,
      wrap: Boolean,
      printMargin: {
        type: [Boolean, Number],
        default: true,
      },
      minLines: Number,
      maxLines: Number,
    }
)

const emit = defineEmits(['update:modelValue', 'init', ...[
  'blur',
  'input',
  'change',
  'changeSelectionStyle',
  'changeSession',
  'copy',
  'focus',
  'paste',
]])

let _editor = undefined
let _ro = undefined
let _contentBackup = undefined;
let _isSettingContent = false;


watch(() => props.modelValue, (first, second) => {
  value(first)
});

// Watchers for debug controls - update editor when local state changes
watch(() => local.currentTheme, (val) => {
  if (_editor && val) _editor.setTheme('ace/theme/' + val);
});

watch(() => local.currentLang, (val) => {
  if (_editor && val) _editor.setOption('mode', 'ace/mode/' + val);
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

watch(() => local.currentRelativeLineNumbers, (val) => {
  if (_editor) _editor.setOption('relativeLineNumbers', val);
});

onMounted(() => {
  if (typeof ace === 'undefined') {
    console.error('Ace editor not loaded')
    return
  }
  ace.config.set('basePath', '/js_ext/ace-editor');
  _editor = markRaw(ace.edit(root.value, {
    mode: 'ace/mode/' + props.lang,
    theme: 'ace/theme/' + props.theme,
    placeholder: props.placeholder,
    readOnly: props.readonly,
    wrap: props.wrap,
    printMargin: props.printMargin,
    useWorker: false,
    minLines: props.minLines,
    maxLines: props.maxLines,
    ...props.options,
  }));

  _editor.setFontSize(props.fontSize)

  _editor.on('change', () => {
    if (_isSettingContent) return;
    const content = _editor.getValue();
    _contentBackup = content;
    emit('update:modelValue', content);
  });

  // Initialize local state from props
  local.currentTheme = props.theme;
  local.currentLang = props.lang;
  local.currentWrap = props.wrap || false;
  local.currentShowPrintMargin = props.printMargin !== false;
  local.currentShowGutter = true;
  local.currentRelativeLineNumbers = false;

  value(props.modelValue)
  _ro = new ResizeObserver(() => _editor.resize());
  _ro.observe(root.value);
  emit('init', _editor);
})

onBeforeUnmount(() => {
  var _a, _b;
  (_a = _ro) === null || _a === void 0 ? void 0 : _a.disconnect();
  (_b = _editor) === null || _b === void 0 ? void 0 : _b.destroy();
})

function focus() {
  _editor.focus();
}

function blur() {
  _editor.blur();
}

function selectAll() {
  _editor.selectAll();
}

function value(val) {
  if (_contentBackup !== val) {
    try {
      _isSettingContent = true;
      _editor.setValue(val, 1);
    } finally {
      _isSettingContent = false;
    }
    _contentBackup = val;
  }
}

function theme(val) {
  _editor.setTheme('ace/theme/' + val);
}

function options(val) {
  _editor.setOptions(val);
}

function readonly(val) {
  _editor.setReadOnly(val);
}

function placeholder(val) {
  _editor.setOption('placeholder', val);
}

function wrap(val) {
  _editor.setWrapBehavioursEnabled(val);
}

function printMargin(val) {
  _editor.setOption('printMargin', val);
}

function lang(val) {
  _editor.setOption('mode', 'ace/mode/' + val);
}

function minLines(val) {
  _editor.setOption('minLines', val);
}

function maxLines(val) {
  _editor.setOption('maxLines', val);
}


</script>

<template>
  <div class="ace-editor" style="display: flex; flex-direction: column;" :style="{ height: props.height }">
    <div class="debug-toolbar" v-if="props.debug">
      <label>
        Theme:
        <select v-model="local.currentTheme">
          <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <label>
        Lang:
        <select v-model="local.currentLang">
          <option v-for="l in langs" :key="l" :value="l">{{ l }}</option>
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
      <label class="toggle-label">
        <input type="checkbox" v-model="local.currentRelativeLineNumbers" />
        Relative Lines
      </label>
    </div>
    <div ref="root" style="flex: 1; min-height: 0;"></div>
  </div>
</template>

<style scoped>
/* vue3-ace-editor.vue */

.ace-editor {
  resize: vertical;
  overflow-y: auto;
  overflow-x: hidden;
}

.debug-toolbar {
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

.debug-toolbar label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.debug-toolbar select {
  font-size: 12px;
  padding: 2px 4px;
  background: #3c3c3c;
  color: #ccc;
  border: 1px solid #555;
  border-radius: 3px;
}

.debug-toolbar select:focus {
  outline: none;
  border-color: #007acc;
}

.debug-toolbar .toggle-label {
  cursor: pointer;
  user-select: none;
}

.debug-toolbar input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
}
</style>