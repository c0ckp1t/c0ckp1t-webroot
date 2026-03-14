<script setup>
/*
  [VARS] - name, init, imports, template, script, style

  Usage:
    const PageXXXX = defineAsyncComponent(() => import("/v3/workflows/c0ckp1t/www/pages/page-homepage.vue"))
    <page-xxxx></page-xxxx>
*/
// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {reactive, computed, ref, onMounted, onUnmounted, defineAsyncComponent, watch} from 'vue'
import {getLogger} from "Logging";
// !# C0CKP1T_START imports
import ComponentView from "./component-view.vue";
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "pages/page-components.vue"
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

// !# C0CKP1T_START script
// ________________________________________________________________________________
// STATE
// ________________________________________________________________________________
const local = reactive({
  id: LOG_HEADER,
  isLoading: false,
  updated: Date.now(),
  toc: [
    {to: 'x-input', name: 'x-input'},
    {to: 'x-label', name: 'x-label'},
    {to: 'ExecButton', name: 'ExecButton'},
    {to: 'x-checkbox', name: 'x-checkbox'},
    {to: 'x-check', name: 'x-check'},
    {to: 'x-toggle', name: 'x-toggle'},
    {to: 'x-toggle3', name: 'x-toggle3'},
    {to: 'x-collapse', name: 'x-collapse'},
    {to: 'x-list', name: 'x-list'},
    {to: 'x-kv', name: 'x-kv'},
    {to: 'x-map', name: 'x-map'},
    {to: 'x-dropdown', name: 'x-dropdown'},
    {to: 'x-dropdown2', name: 'x-dropdown2'},
    {to: 'x-json', name: 'x-json'},
    {to: 'x-section', name: 'x-section'},
    {to: 'x-table-open', name: 'x-table-open'},
    {to: 'x-nav', name: 'x-nav'},
    {to: 'x-tabs', name: 'x-tabs'},
  ],
  pathPrefix: "/v4/webroot/assets/ui/",
  imgDefault: "https://cdn.jsdelivr.net/npm/c0ckp1t@1.0.2/core/img/logo_v1.svg",

  xInputTextNumber: 123,
  xInputText: "v-model",
  myList: ["a", "two"],
  myMap: {
    "one": "1",
    "two": "2",
  },
  myDropDownItems: [
    {k: 'STATIC', v: 'STATIC'},
    {k: "DYNAMIC", v: 'DYNAMIC'}
  ],
  myDropDown: 'STATIC',
  myToggle: false,
  myToggle3: 0,
  myCheckBox: false,
  myTextEditor: "Text Editor Text",
  myTableData: [
    {name: 'alice', location: 'down the rabit hole'},
    {name: 'neo', location: 'the matrix has me'},
    {name: 'batman', location: 'arkam insane asylum'},
  ],
  xNavSel: "item1",
  xnav: [
    {id: "item1", label: "Item 1",},
    {id: "item2", label: "Item 2",},
  ],
  textArea: "This is my text area with 5 lines"
})


async function delay() {
  await new Promise(r => setTimeout(r, 1000))
}

// !# C0CKP1T_END script

// ________________________________________________________________________________
// INIT
// ________________________________________________________________________________
async function init() {

}

onMounted(async () => {
  init()
})
</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :level="2" :visible="true" k="X Vue Components">


    <ComponentView name="x-section" url="/components/xsection.vue">

      <x-section :level="5" k="Level 6" :visible="true">
        <template v-slot:header><span class="text-white">Header</span></template>
        Hello World from the body
      </x-section>
      <x-section :level="5" k="Level 5">
        <template v-slot:header><span class="text-white">Header</span></template>
        Hello World from the body
      </x-section>
      <x-section :level="4" k="Level 4">
        <template v-slot:header><span class="text-white">Header</span></template>
        Hello World from the body
      </x-section>
      <x-section :level="2" k="Level 3">
        <template v-slot:header><span class="text-white">Header</span></template>
        Hello World from the body
      </x-section>
      <x-section :level="2" k="Level 2">
        <template v-slot:header>
          <span class="text-white me-4">Header</span>
          <ExecButton icon="fa-rocket me-1" class="btn btn-warning">Button</ExecButton>
        </template>
        Hello World from the body
      </x-section>
      <x-section :level="1" k="Level 1">
        <template v-slot:header><span class="text-white">Header</span></template>
        Hello World from the body
      </x-section>

    </ComponentView>

    <ComponentView name="ExecButton" url="/components/ExecButton.vue">
      <ExecButton :callback="() => delay()"> Default</ExecButton>
      <ExecButton class="btn btn-primary" icon="fa-heart me-1" :callback="() => delay()"> btn-primary</ExecButton>
      <ExecButton class="btn btn-dark" icon="fa-heart me-1" :callback="() => delay()"> btn-dark</ExecButton>
      <ExecButton class="btn btn-outline-secondary" icon="fa-heart me-1" :callback="() => delay()"> btn-outline-secondary </ExecButton>
      <ExecButton class="btn btn-outline-danger" icon="fa-heart me-1" :callback="() => delay()">btn-outline-danger </ExecButton>
      <ExecButton class="btn btn-link" icon="fa-heart me-1" :callback="() => delay()"> btn-link</ExecButton>
    </ComponentView>

    <ComponentView name="x-input" url="/components/xinput.vue">
      <x-input k="Default" v-model="local.xInputText"></x-input>
      <x-input k="Number" v-model="local.xInputTextNumber" type="Number"></x-input>
      <x-input k="showLabel=false" v-model="local.xInputText" :showLabel="false"></x-input>
      <x-input k="styleObject, inputStyle" v-model="local.xInputText"
               :styleObject="{'border': '1px solid red'}"
               inputStyle="border: 1px solid green">
      </x-input>
    </ComponentView>

    <ComponentView name="x-label" url="/components/xlabel.vue">
      <x-label k="Default">my label value template</x-label>
      <x-label k="Website">https://example.com</x-label>
      <x-label k="D" :isCompact="true">compact</x-label>
      <x-label :k="null">k=null</x-label>
    </ComponentView>


    <ComponentView name="x-checkbox" url="/components/xcheckbox.vue">
      <x-checkbox k="" v-model="local.myCheckBox" class="fs-5"/>
      <x-checkbox k="Default" v-model="local.myCheckBox"/>
      <x-checkbox k="style=boder: 1px solid red" v-model="local.myCheckBox" style="border: 1px solid red"/>

      <x-checkbox k="Locked" v-model="local.myCheckBox" disabled/>

      <x-checkbox k="Inline Option A" v-model="local.myCheckBox" inline/>
      <x-checkbox k="Inline Option B" v-model="local.myCheckBox" inline/>

    </ComponentView>

    <ComponentView name="x-check" url="/components/xcheck.vue">
        <x-check k="My Check Box" :v="local.myCheckBox" />
    </ComponentView>

    <ComponentView name="x-toggle" url="/components/xtoggle.vue">
      <x-toggle k="My Toggle" v-model="local.myToggle"></x-toggle>
    </ComponentView>

    <ComponentView name="x-toggle3" url="/components/xtoggle3.vue">
      <div class="container">
        <x-toggle3 k="My Toggle" v-model="local.myToggle3"></x-toggle3>
      </div>
      <div class="container mt-2">
        <x-toggle3 k="My Toggle" v-model="local.myToggle3" :icons="['fa-times', 'fa-minus', 'fa-check']"></x-toggle3>
      </div>
    </ComponentView>

    <ComponentView name="x-collapse" url="/components/xcollapse.vue">
      <x-collapse k="Services" v-model="local.myToggle">Body of collapse</x-collapse>
      <x-collapse style="border: 1px solid green" k="Services" v-model="local.myToggle">Body of collapse</x-collapse>
    </ComponentView>

    <ComponentView name="x-kv" url="/components/xkv.vue">
      <x-kv k="local" :obj="local.myMap"></x-kv>
    </ComponentView>

    <ComponentView name="x-list" url="/components/xlist.vue">
      <x-list k="local" v-model="local.myList"></x-list>
    </ComponentView>

    <ComponentView name="x-map" url="/components/xmap.vue">
      <x-map k="local" v-model="local.myMap"></x-map>
    </ComponentView>

    <ComponentView name="x-dropdown" url="/components/xdropdown.vue">
      <x-dropdown k="Route Type: " :items="local.myDropDownItems" v-model="local.myDropDown"></x-dropdown>
    </ComponentView>

    <ComponentView name="x-dropdown2" url="/components/xdropdown2.vue">
      <x-dropdown2 k="Route Type: " :items="local.myDropDownItems" v-model="local.myDropDown"></x-dropdown2>
    </ComponentView>

    <ComponentView name="x-json" url="/components/xjson.vue">
      <x-json :obj="local.myTableData"></x-json>
      <div class="mt-2">
        <x-json :obj="local.myTableData" :expanded="true"></x-json>
      </div>
    </ComponentView>


    <ComponentView name="x-table-open" url="/components/xtable-open.vue">
      <x-table-open :exclude="[]" :arr="local.myTableData" v-slot="slotProps">
        {{ local.myTableData[slotProps.v] }}
      </x-table-open>

      <x-table-open :exclude="[]" :arr="local.myTableData">

        <template v-slot:name="props">
          <span style="font-weight: bold">{{ props }}</span>
        </template>

        <template v-slot:default="slotProps">
          <span> {{ slotProps }}</span>
        </template>

      </x-table-open>

    </ComponentView>


    <ComponentView name="x-nav" url="/components/xnav.vue">
      <div class="container">
        <x-nav :arr="local.xnav" v-model="local.xNavSel"></x-nav>
      </div>
      <div class="container">
        <x-nav :arr="local.xnav" v-model="local.xNavSel" :isVertical="true"></x-nav>
      </div>
    </ComponentView>

    <ComponentView name="x-tabs" url="/components/xtabs.vue">


      <x-tabs>
        <template #header>
          Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth
          master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro
          keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat
          salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.
        </template>

        <template #footer>
          Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1
          labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer
          twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
          PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.
        </template>
      </x-tabs>
    </ComponentView>

    <ComponentView name="x-textarea" url="/components/xtextarea.vue">
      <div class="container">
        <x-textarea k="Description" :lines="5" v-model="local.textArea"></x-textarea>
      </div>
    </ComponentView>

    <ComponentView name="x-hidden" url="/components/xhidden.vue">
      <x-hidden k="Hidden"> This is hidden text</x-hidden>
    </ComponentView>


    <ComponentView name="x-card" url="/components/xcard.vue">
      <x-card k="Title" :no-image="true">Content here</x-card>
      <hr>
      <x-card k="Title">Content here</x-card>
      <x-card k="Title" :img-src="local.imgDefault">Content here</x-card>
      <hr>
      <div class="row g-3">
        <div class="col-md-4">
          <x-card k="Card 1">Content for card 1</x-card>
        </div>
        <div class="col-md-4">
          <x-card k="Card 2" :img-src="local.imgDefault">Content for card 2</x-card>
        </div>
        <div class="col-md-4">
          <x-card k="Card 3">Content for card 3</x-card>
        </div>
        <div class="col-md-4">
          <x-card k="Card 4" :img-src="local.imgDefault">Content for card 4</x-card>
        </div>
        <div class="col-md-4">
          <x-card k="Card 5">          Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1
            labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer
            twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
            PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</x-card>
        </div>
      </div>
    </ComponentView>

    <ComponentView name="x-card-h" url="/components/xcard-h.vue">
      <x-card-h k="Title" :no-image="true">Content here</x-card-h>
      <x-card-h k="Title">Content here</x-card-h>
      <x-card-h k="Title" :img-src="local.imgDefault">Content here</x-card-h>
      <x-card-h k="Card 5">          Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1
        labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer
        twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
        PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</x-card-h>
    </ComponentView>
  </x-section>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */
.container {
  display: flex;
  justify-content: center;
}

/* !# C0CKP1T_END style */
</style>

