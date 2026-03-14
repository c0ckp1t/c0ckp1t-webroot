<script setup>
/*
 <code-mirror v-model="local.code" lang="javascript" theme="oneDark"
    style="height: 800px"></code-mirror>
*/

import {ref, reactive, markRaw, onMounted, onBeforeUnmount, watch} from 'vue';

const root = ref(null);

// Available languages for debug selector
const langs = ['javascript', 'python', 'markdown', 'html', 'css', 'json', 'xml', 'sql', 'java', 'cpp', 'php', 'rust', 'go', 'text'].sort();

// Available themes
const themes = ['default', 'oneDark'].sort();

// Local reactive state for debug controls
const local = reactive({
  currentTheme: '',
  currentLang: '',
  currentWrap: false,
  currentReadonly: false,
});

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  lang: {
    type: String,
    default: 'javascript',
  },
  theme: {
    type: String,
    default: 'default',
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
  readonly: {
    type: Boolean,
    default: false,
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  tabSize: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(['update:modelValue', 'init', 'change', 'focus', 'blur']);

// Editor instance and compartments for dynamic reconfiguration
let _editor = null;
let _ro = null;
let _contentBackup = '';
let _isSettingContent = false;

let _mounted = false;
let _initAborted = false;

// CodeMirror modules - loaded dynamically
let EditorView = null;
let EditorState = null;
let Compartment = null;
let basicSetup = null;

// Compartments - initialized after module load
let languageCompartment = null;
let themeCompartment = null;
let readonlyCompartment = null;
let wrapCompartment = null;

// Language loaders - lazy import
const languageLoaders = {
  javascript: () => import('https://esm.sh/@codemirror/lang-javascript').then(m => m.javascript()),
  js: () => import('https://esm.sh/@codemirror/lang-javascript').then(m => m.javascript()),
  python: () => import('https://esm.sh/@codemirror/lang-python').then(m => m.python()),
  py: () => import('https://esm.sh/@codemirror/lang-python').then(m => m.python()),
  markdown: () => import('https://esm.sh/@codemirror/lang-markdown').then(m => m.markdown()),
  md: () => import('https://esm.sh/@codemirror/lang-markdown').then(m => m.markdown()),
  html: () => import('https://esm.sh/@codemirror/lang-html').then(m => m.html()),
  css: () => import('https://esm.sh/@codemirror/lang-css').then(m => m.css()),
  json: () => import('https://esm.sh/@codemirror/lang-json').then(m => m.json()),
  xml: () => import('https://esm.sh/@codemirror/lang-xml').then(m => m.xml()),
  sql: () => import('https://esm.sh/@codemirror/lang-sql').then(m => m.sql()),
  java: () => import('https://esm.sh/@codemirror/lang-java').then(m => m.java()),
  cpp: () => import('https://esm.sh/@codemirror/lang-cpp').then(m => m.cpp()),
  c: () => import('https://esm.sh/@codemirror/lang-cpp').then(m => m.cpp()),
  php: () => import('https://esm.sh/@codemirror/lang-php').then(m => m.php()),
  rust: () => import('https://esm.sh/@codemirror/lang-rust').then(m => m.rust()),
  go: () => import('https://esm.sh/@codemirror/lang-go').then(m => m.go()),
  golang: () => import('https://esm.sh/@codemirror/lang-go').then(m => m.go()),
  text: () => Promise.resolve([]),
  plain: () => Promise.resolve([]),
};

// Theme loaders - lazy import
const themeLoaders = {
  default: () => Promise.resolve([]),
  oneDark: () => import('https://esm.sh/@codemirror/theme-one-dark').then(m => m.oneDark),
};

// Get language extension
async function getLanguageExtension(langName) {
  const loader = languageLoaders[langName] || languageLoaders.text;
  try {
    return await loader();
  } catch (e) {
    console.warn(`Failed to load language: ${langName}`, e);
    return [];
  }
}

// Get theme extension
async function getThemeExtension(themeName) {
  const loader = themeLoaders[themeName] || themeLoaders.default;
  try {
    return await loader();
  } catch (e) {
    console.warn(`Failed to load theme: ${themeName}`, e);
    return [];
  }
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (_editor && _contentBackup !== newVal) {
    setValue(newVal);
  }
});

// Watch for prop changes
watch(() => props.lang, async (val) => {
  if (_editor && languageCompartment) {
    const langExt = await getLanguageExtension(val);
    _editor.dispatch({
      effects: languageCompartment.reconfigure(langExt)
    });
  }
});

watch(() => props.theme, async (val) => {
  if (_editor && themeCompartment) {
    const themeExt = await getThemeExtension(val);
    _editor.dispatch({
      effects: themeCompartment.reconfigure(themeExt)
    });
  }
});

watch(() => props.readonly, (val) => {
  if (_editor && readonlyCompartment && EditorState) {
    _editor.dispatch({
      effects: readonlyCompartment.reconfigure(EditorState.readOnly.of(val))
    });
  }
});

watch(() => props.wrap, (val) => {
  if (_editor && wrapCompartment && EditorView) {
    _editor.dispatch({
      effects: wrapCompartment.reconfigure(val ? EditorView.lineWrapping : [])
    });
  }
});

// Watchers for debug controls
watch(() => local.currentTheme, async (val) => {
  if (_editor && val && themeCompartment) {
    const themeExt = await getThemeExtension(val);
    _editor.dispatch({
      effects: themeCompartment.reconfigure(themeExt)
    });
  }
});

watch(() => local.currentLang, async (val) => {
  if (_editor && val && languageCompartment) {
    const langExt = await getLanguageExtension(val);
    _editor.dispatch({
      effects: languageCompartment.reconfigure(langExt)
    });
  }
});

watch(() => local.currentWrap, (val) => {
  if (_editor && wrapCompartment && EditorView) {
    _editor.dispatch({
      effects: wrapCompartment.reconfigure(val ? EditorView.lineWrapping : [])
    });
  }
});

watch(() => local.currentReadonly, (val) => {
  if (_editor && readonlyCompartment && EditorState) {
    _editor.dispatch({
      effects: readonlyCompartment.reconfigure(EditorState.readOnly.of(val))
    });
  }
});

onMounted(async () => {
  _mounted = true;
  // --- guard helper ---
  const alive = () => _mounted && root.value != null;
  if (!alive()) return;


  // Load core CodeMirror modules
  const [stateModule, viewModule, basicSetupModule] = await Promise.all([
    import('https://esm.sh/@codemirror/state'),
    import('https://esm.sh/@codemirror/view'),
    import('https://esm.sh/codemirror'),
  ]);

  // Bail if component unmounted during async load
  if (!alive()) return;

  EditorState = stateModule.EditorState;
  Compartment = stateModule.Compartment;
  EditorView = viewModule.EditorView;
  basicSetup = basicSetupModule.basicSetup;

  // Initialize compartments
  languageCompartment = new Compartment();
  themeCompartment = new Compartment();
  readonlyCompartment = new Compartment();
  wrapCompartment = new Compartment();

  // Load initial language and theme
  const [langExt, themeExt] = await Promise.all([
    getLanguageExtension(props.lang),
    getThemeExtension(props.theme),
  ]);

  // Bail again after second async gap
  if (!alive()) return;

  const extensions = [
    basicSetup,
    languageCompartment.of(langExt),
    themeCompartment.of(themeExt),
    readonlyCompartment.of(EditorState.readOnly.of(props.readonly)),
    wrapCompartment.of(props.wrap ? EditorView.lineWrapping : []),
    EditorState.tabSize.of(props.tabSize),
    EditorView.updateListener.of((update) => {
      if (update.docChanged && !_isSettingContent) {
        const content = update.state.doc.toString();
        _contentBackup = content;
        emit('update:modelValue', content);
        emit('change', content);
      }
      if (update.focusChanged) {
        if (update.view.hasFocus) {
          emit('focus');
        } else {
          emit('blur');
        }
      }
    }),
    EditorView.theme({
      '&': {
        fontSize: props.fontSize + 'px',
      },
      '.cm-scroller': {
        fontFamily: 'monospace',
      },
    }),
  ];

  const state = EditorState.create({
    doc: props.modelValue || '',
    extensions,
  });

  _editor = markRaw(new EditorView({
    state,
    parent: root.value,
  }));

  _contentBackup = props.modelValue || '';

  // Initialize local state from props
  local.currentTheme = props.theme;
  local.currentLang = props.lang;
  local.currentWrap = props.wrap || false;
  local.currentReadonly = props.readonly || false;

  // ResizeObserver for responsive sizing
  _ro = new ResizeObserver(() => {
    if (_editor) {
      _editor.requestMeasure();
    }
  });
  _ro.observe(root.value);

  emit('init', _editor);
});

onBeforeUnmount(() => {
  _mounted = false;

  _ro?.disconnect();
  _ro = null;

  _editor?.destroy();
  _editor = null;

});

// Public methods
function setValue(val) {
  if (_editor && _contentBackup !== val) {
    try {
      _isSettingContent = true;
      _editor.dispatch({
        changes: {
          from: 0,
          to: _editor.state.doc.length,
          insert: val || '',
        },
      });
    } finally {
      _isSettingContent = false;
    }
    _contentBackup = val || '';
  }
}

function getValue() {
  return _editor ? _editor.state.doc.toString() : '';
}

function focus() {
  if (_editor) {
    _editor.focus();
  }
}

function blur() {
  if (_editor) {
    _editor.contentDOM.blur();
  }
}

// Expose methods for parent components
defineExpose({
  setValue,
  getValue,
  focus,
  blur,
  getEditor: () => _editor,
});
</script>

<template>
  <div class="code-mirror-editor" style="display: flex; flex-direction: column;" :style="{ height: props.height }">
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
        <input type="checkbox" v-model="local.currentReadonly" />
        Readonly
      </label>
    </div>
    <div ref="root" style="flex: 1; min-height: 0;"></div>
  </div>
</template>

<style scoped>
/* code-mirror.vue */

.code-mirror-editor {
  resize: vertical;
  overflow-y: auto;
  overflow-x: hidden;
}

.code-mirror-editor :deep(.cm-editor) {
  height: 100%;
}

.code-mirror-editor :deep(.cm-scroller) {
  overflow: auto;
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
