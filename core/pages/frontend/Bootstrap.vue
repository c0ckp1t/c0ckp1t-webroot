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
import ComponentView from "./component-view-html.vue";
import {store as storeMain} from "GlobalStore";
import ExecButton from "../../../components/ExecButton.vue";
// !# C0CKP1T_END imports

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = "frontend/Bootstrap.vue"
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
  defaultExpand: storeMain.config?.componentsDefaultExpand ?? false,

  toc: [
    {to: 'navbars', name: 'Navbars'},
    {to: 'buttons', name: 'Buttons'},
    {to: 'typography', name: 'Typography'},
    {to: 'tables', name: 'Tables'},
    {to: 'forms', name: 'Forms'},
    {to: 'navs', name: 'Navs'},
    {to: 'indicators', name: 'Indicators'},
    {to: 'progress', name: 'Progress'},
    {to: 'containers', name: 'Containers'},
    {to: 'dialogs', name: 'Dialogs'},
  ]
})

// !# C0CKP1T_END script

</script>

<template>
  <!--  !# C0CKP1T_START template -->
  <x-section :level="2" :visible="true" k="Bootstrap Components">

    <!-- Navbars -->
    <ComponentView name="navbars" :defaultExpand="local.defaultExpand">
      <nav class="navbar navbar-expand-lg bg-primary mb-3" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto">
              <li class="nav-item"><a class="nav-link active" href="#">Home <span class="visually-hidden">(current)</span></a></li>
              <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
              <li class="nav-item"><a class="nav-link" href="#">About</a></li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Separated link</a>
                </div>
              </li>
            </ul>
            <form class="d-flex">
              <input class="form-control me-sm-2" type="search" placeholder="Search">
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      <nav class="navbar navbar-expand-lg bg-dark mb-3" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor02">
            <ul class="navbar-nav me-auto">
              <li class="nav-item"><a class="nav-link active" href="#">Home <span class="visually-hidden">(current)</span></a></li>
              <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
              <li class="nav-item"><a class="nav-link" href="#">About</a></li>
            </ul>
            <form class="d-flex">
              <input class="form-control me-sm-2" type="search" placeholder="Search">
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>

      <nav class="navbar navbar-expand-lg bg-light mb-3" data-bs-theme="light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor03">
            <ul class="navbar-nav me-auto">
              <li class="nav-item"><a class="nav-link active" href="#">Home <span class="visually-hidden">(current)</span></a></li>
              <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
              <li class="nav-item"><a class="nav-link" href="#">Pricing</a></li>
              <li class="nav-item"><a class="nav-link" href="#">About</a></li>
            </ul>
            <form class="d-flex">
              <input class="form-control me-sm-2" type="search" placeholder="Search">
              <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </ComponentView>

    <!-- Buttons -->
    <ComponentView name="buttons" :defaultExpand="local.defaultExpand">
      <div class="mb-3">
        <button type="button" class="btn btn-primary me-1">Primary</button>
        <button type="button" class="btn btn-secondary me-1">Secondary</button>
        <button type="button" class="btn btn-success me-1">Success</button>
        <button type="button" class="btn btn-info me-1">Info</button>
        <button type="button" class="btn btn-warning me-1">Warning</button>
        <button type="button" class="btn btn-danger me-1">Danger</button>
        <button type="button" class="btn btn-light me-1">Light</button>
        <button type="button" class="btn btn-dark me-1">Dark</button>
        <button type="button" class="btn btn-link me-1">Link</button>
      </div>

      <div class="mb-3">
        <button type="button" class="btn btn-primary disabled me-1">Primary</button>
        <button type="button" class="btn btn-secondary disabled me-1">Secondary</button>
        <button type="button" class="btn btn-success disabled me-1">Success</button>
        <button type="button" class="btn btn-info disabled me-1">Info</button>
        <button type="button" class="btn btn-warning disabled me-1">Warning</button>
        <button type="button" class="btn btn-danger disabled me-1">Danger</button>
        <button type="button" class="btn btn-light disabled me-1">Light</button>
        <button type="button" class="btn btn-dark disabled me-1">Dark</button>
        <button type="button" class="btn btn-link disabled me-1">Link</button>
      </div>

      <div class="mb-3">
        <button type="button" class="btn btn-outline-primary me-1">Primary</button>
        <button type="button" class="btn btn-outline-secondary me-1">Secondary</button>
        <button type="button" class="btn btn-outline-success me-1">Success</button>
        <button type="button" class="btn btn-outline-info me-1">Info</button>
        <button type="button" class="btn btn-outline-warning me-1">Warning</button>
        <button type="button" class="btn btn-outline-danger me-1">Danger</button>
        <button type="button" class="btn btn-outline-light me-1">Light</button>
        <button type="button" class="btn btn-outline-dark me-1">Dark</button>
      </div>

      <div class="mb-3">
        <div class="btn-group me-1" role="group" aria-label="Button group with nested dropdown">
          <button type="button" class="btn btn-primary">Primary</button>
          <div class="btn-group" role="group">
            <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
              <a class="dropdown-item" href="#">Dropdown link</a>
              <a class="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>
        </div>

        <div class="btn-group me-1" role="group" aria-label="Button group with nested dropdown">
          <button type="button" class="btn btn-success">Success</button>
          <div class="btn-group" role="group">
            <button id="btnGroupDrop2" type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <div class="dropdown-menu" aria-labelledby="btnGroupDrop2">
              <a class="dropdown-item" href="#">Dropdown link</a>
              <a class="dropdown-item" href="#">Dropdown link</a>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <button type="button" class="btn btn-primary btn-lg me-1">Large button</button>
        <button type="button" class="btn btn-primary me-1">Default button</button>
        <button type="button" class="btn btn-primary btn-sm me-1">Small button</button>
      </div>

      <div class="mb-3">
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
          <input type="checkbox" class="btn-check" id="btncheck1" checked autocomplete="off">
          <label class="btn btn-primary" for="btncheck1">Checkbox 1</label>
          <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off">
          <label class="btn btn-primary" for="btncheck2">Checkbox 2</label>
          <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off">
          <label class="btn btn-primary" for="btncheck3">Checkbox 3</label>
        </div>
      </div>

      <div class="mb-3">
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
          <label class="btn btn-outline-primary" for="btnradio1">Radio 1</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked>
          <label class="btn btn-outline-primary" for="btnradio2">Radio 2</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked>
          <label class="btn btn-outline-primary" for="btnradio3">Radio 3</label>
        </div>
      </div>
    </ComponentView>

    <!-- Typography -->
    <ComponentView name="typography" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
            <h3>Heading <small class="text-body-secondary">with faded secondary text</small></h3>
            <p class="lead">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <h2>Example body text</h2>
            <p>Nullam quis risus eget <a href="#">urna mollis ornare</a> vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>
            <p><small>This line of text is meant to be treated as fine print.</small></p>
            <p>The following is <strong>rendered as bold text</strong>.</p>
            <p>The following is <em>rendered as italicized text</em>.</p>
            <p>An abbreviation of the word attribute is <abbr title="attribute">attr</abbr>.</p>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <h2>Emphasis classes</h2>
            <p class="text-primary">.text-primary</p>
            <p class="text-secondary">.text-secondary</p>
            <p class="text-success">.text-success</p>
            <p class="text-danger">.text-danger</p>
            <p class="text-warning">.text-warning</p>
            <p class="text-info">.text-info</p>
            <p class="text-light bg-dark">.text-light</p>
            <p class="text-dark">.text-dark</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <figure>
            <blockquote class="blockquote">
              <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            </blockquote>
            <figcaption class="blockquote-footer">
              Someone famous in <cite title="Source Title">Source Title</cite>
            </figcaption>
          </figure>
        </div>
      </div>
    </ComponentView>

    <!-- Tables -->
    <ComponentView name="tables" :defaultExpand="local.defaultExpand">
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col">Type</th>
          <th scope="col">Column heading</th>
          <th scope="col">Column heading</th>
          <th scope="col">Column heading</th>
        </tr>
        </thead>
        <tbody>
        <tr class="table-active">
          <th scope="row">Active</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr>
          <th scope="row">Default</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-primary">
          <th scope="row">Primary</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-secondary">
          <th scope="row">Secondary</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-success">
          <th scope="row">Success</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-danger">
          <th scope="row">Danger</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-warning">
          <th scope="row">Warning</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-info">
          <th scope="row">Info</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-light">
          <th scope="row">Light</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        <tr class="table-dark">
          <th scope="row">Dark</th>
          <td>Column content</td>
          <td>Column content</td>
          <td>Column content</td>
        </tr>
        </tbody>
      </table>
    </ComponentView>

    <!-- Forms -->
    <ComponentView name="forms" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-lg-6">
          <form>
            <fieldset>
              <legend>Legend</legend>
              <div class="row mb-3">
                <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                  <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com">
                </div>
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" autocomplete="off">
              </div>
              <div class="mb-3">
                <label for="exampleSelect1" class="form-label">Example select</label>
                <select class="form-select" id="exampleSelect1">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="exampleSelect2" class="form-label">Example multiple select</label>
                <select multiple class="form-select" id="exampleSelect2">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="exampleTextarea" class="form-label">Example textarea</label>
                <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label for="formFile" class="form-label">Default file input example</label>
                <input class="form-control" type="file" id="formFile">
              </div>
              <fieldset class="mb-3">
                <legend>Radio buttons</legend>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
                  <label class="form-check-label" for="optionsRadios1">
                    Option one is this and that&mdash;be sure to include why it's great
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
                  <label class="form-check-label" for="optionsRadios2">
                    Option two can be something else and selecting it will deselect option one
                  </label>
                </div>
                <div class="form-check disabled">
                  <input class="form-check-input" type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
                  <label class="form-check-label" for="optionsRadios3">
                    Option three is disabled
                  </label>
                </div>
              </fieldset>
              <fieldset class="mb-3">
                <legend>Checkboxes</legend>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                    Default checkbox
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                  <label class="form-check-label" for="flexCheckChecked">
                    Checked checkbox
                  </label>
                </div>
              </fieldset>
              <fieldset class="mb-3">
                <legend>Switches</legend>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                  <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
                  <label class="form-check-label" for="flexSwitchCheckChecked">Checked switch checkbox input</label>
                </div>
              </fieldset>
              <button type="submit" class="btn btn-primary">Submit</button>
            </fieldset>
          </form>
        </div>
        <div class="col-lg-4 offset-lg-1">
          <form>
            <div class="mb-3">
              <fieldset disabled>
                <label class="form-label" for="disabledInput">Disabled input</label>
                <input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
              </fieldset>
            </div>
            <div class="mb-3">
              <label class="form-label" for="readOnlyInput">Readonly input</label>
              <input class="form-control" id="readOnlyInput" type="text" placeholder="Readonly input here..." readonly>
            </div>
            <div class="has-success mb-3">
              <label class="form-label" for="inputValid">Valid input</label>
              <input type="text" value="correct value" class="form-control is-valid" id="inputValid">
              <div class="valid-feedback">Success! You've done it.</div>
            </div>
            <div class="has-danger mb-3">
              <label class="form-label" for="inputInvalid">Invalid input</label>
              <input type="text" value="wrong value" class="form-control is-invalid" id="inputInvalid">
              <div class="invalid-feedback">Sorry, that username's taken. Try another?</div>
            </div>
            <div class="mb-3">
              <label class="col-form-label col-form-label-lg" for="inputLarge">Large input</label>
              <input class="form-control form-control-lg" type="text" placeholder=".form-control-lg" id="inputLarge">
            </div>
            <div class="mb-3">
              <label class="col-form-label" for="inputDefault">Default input</label>
              <input type="text" class="form-control" placeholder="Default input" id="inputDefault">
            </div>
            <div class="mb-3">
              <label class="col-form-label col-form-label-sm" for="inputSmall">Small input</label>
              <input class="form-control form-control-sm" type="text" placeholder=".form-control-sm" id="inputSmall">
            </div>
            <div class="mb-3">
              <label class="form-label">Input addons</label>
              <div class="input-group mb-3">
                <span class="input-group-text">$</span>
                <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                <span class="input-group-text">.00</span>
              </div>
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2">
                <button class="btn btn-primary" type="button" id="button-addon2">Button</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Floating labels</label>
              <div class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
                <label for="floatingInput">Email address</label>
              </div>
              <div class="form-floating">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password" autocomplete="off">
                <label for="floatingPassword">Password</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ComponentView>

    <!-- Navs -->
    <ComponentView name="navs" :defaultExpand="local.defaultExpand">
      <div class="row mb-5">
        <div class="col-lg-6">
          <h2 id="nav-tabs">Tabs</h2>
          <div class="bs-component">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#profile">Profile</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#">Disabled</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div class="dropdown-menu">
                  <h6 class="dropdown-header">Dropdown header</h6>
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Separated link</a>
                </div>
              </li>
            </ul>
            <div id="myTabContent" class="tab-content">
              <div class="tab-pane fade show active" id="home">
                <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
              </div>
              <div class="tab-pane fade" id="profile">
                <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2 id="nav-pills">Pills</h2>
          <div class="bs-component">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <a class="nav-link active" href="#">Active</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div class="dropdown-menu">
                  <h6 class="dropdown-header">Dropdown header</h6>
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Separated link</a>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#">Disabled</a>
              </li>
            </ul>
          </div>
          <br>
          <div class="bs-component">
            <ul class="nav nav-pills flex-column">
              <li class="nav-item">
                <a class="nav-link active" href="#">Active</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div class="dropdown-menu">
                  <h6 class="dropdown-header">Dropdown header</h6>
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Separated link</a>
                </div>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#">Disabled</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-lg-6">
          <h2 id="nav-breadcrumbs">Breadcrumbs</h2>
          <div class="bs-component">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active">Home</li>
            </ol>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Library</li>
            </ol>
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Library</a></li>
              <li class="breadcrumb-item active">Data</li>
            </ol>
          </div>
        </div>
        <div class="col-lg-6">
          <h2 id="pagination">Pagination</h2>
          <div class="bs-component">
            <div>
              <ul class="pagination">
                <li class="page-item disabled">
                  <a class="page-link" href="#">&laquo;</a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">3</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">4</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">5</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">&raquo;</a>
                </li>
              </ul>
            </div>
            <div>
              <ul class="pagination pagination-lg">
                <li class="page-item disabled">
                  <a class="page-link" href="#">&laquo;</a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">3</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">4</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">5</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">&raquo;</a>
                </li>
              </ul>
            </div>
            <div>
              <ul class="pagination pagination-sm">
                <li class="page-item disabled">
                  <a class="page-link" href="#">&laquo;</a>
                </li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">2</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">3</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">4</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">5</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">&raquo;</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ComponentView>

    <!-- Indicators -->
    <ComponentView name="indicators" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-lg-12">
          <h2>Alerts</h2>
          <div class="bs-component">
            <div class="alert alert-dismissible alert-warning">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <h4 class="alert-heading">Warning!</h4>
              <p class="mb-0">Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, <a href="#" class="alert-link">vel scelerisque nisl consectetur et</a>.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-danger">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-success">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Well done!</strong> You successfully read <a href="#" class="alert-link">this important alert message</a>.
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-info">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-primary">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-secondary">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Well done!</strong> You successfully read <a href="#" class="alert-link">this important alert message</a>.
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="alert alert-dismissible alert-light">
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
              <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Badges</h2>
        <div class="bs-component mb-4">
          <span class="badge bg-primary me-1">Primary</span>
          <span class="badge bg-secondary me-1">Secondary</span>
          <span class="badge bg-success me-1">Success</span>
          <span class="badge bg-danger me-1">Danger</span>
          <span class="badge bg-warning me-1">Warning</span>
          <span class="badge bg-info me-1">Info</span>
          <span class="badge bg-light me-1">Light</span>
          <span class="badge bg-dark me-1">Dark</span>
        </div>
        <div class="bs-component">
          <span class="badge rounded-pill bg-primary me-1">Primary</span>
          <span class="badge rounded-pill bg-secondary me-1">Secondary</span>
          <span class="badge rounded-pill bg-success me-1">Success</span>
          <span class="badge rounded-pill bg-danger me-1">Danger</span>
          <span class="badge rounded-pill bg-warning me-1">Warning</span>
          <span class="badge rounded-pill bg-info me-1">Info</span>
          <span class="badge rounded-pill bg-light me-1">Light</span>
          <span class="badge rounded-pill bg-dark me-1">Dark</span>
        </div>
      </div>
    </ComponentView>

    <!-- Progress -->
    <ComponentView name="progress" :defaultExpand="local.defaultExpand">
      <h3 id="progress-basic">Basic</h3>
      <div class="bs-component mb-3">
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>

      <h3 id="progress-alternatives">Contextual alternatives</h3>
      <div class="bs-component mb-3">
        <div class="progress mb-2">
          <div class="progress-bar bg-success" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar bg-info" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar bg-warning" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar bg-danger" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>

      <h3 id="progress-multiple">Multiple bars</h3>
      <div class="bs-component mb-3">
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: 15%;" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
          <div class="progress-bar bg-success" role="progressbar" style="width: 30%;" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
          <div class="progress-bar bg-info" role="progressbar" style="width: 20%;" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>

      <h3 id="progress-striped">Striped</h3>
      <div class="bs-component mb-3">
        <div class="progress mb-2">
          <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 10%;" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: 50%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 75%;" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="progress mb-2">
          <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>

      <h3 id="progress-animated">Animated</h3>
      <div class="bs-component">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%;"></div>
        </div>
      </div>
    </ComponentView>

    <!-- Containers -->
    <ComponentView name="containers" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-lg-12">
          <h2>List groups</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Cras justo odio
                <span class="badge bg-primary rounded-pill">14</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Dapibus ac facilisis in
                <span class="badge bg-primary rounded-pill">2</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Morbi leo risus
                <span class="badge bg-primary rounded-pill">1</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action active">Cras justo odio</a>
              <a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
              <a href="#" class="list-group-item list-group-item-action disabled">Morbi leo risus</a>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="list-group">
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start active">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">List group item heading</h5>
                  <small>3 days ago</small>
                </div>
                <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                <small>Donec id elit non mi porta.</small>
              </a>
              <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">List group item heading</h5>
                  <small class="text-muted">3 days ago</small>
                </div>
                <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                <small class="text-muted">Donec id elit non mi porta.</small>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-12">
          <h2>Cards</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h4 class="card-title">Primary card title</h4>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="card border-primary mb-3" style="max-width: 20rem;">
              <div class="card-header">Header</div>
              <div class="card-body">
                <h4 class="card-title">Primary card title</h4>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="card mb-3">
              <h3 class="card-header">Card header</h3>
              <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <h6 class="card-subtitle text-muted">Support card subtitle</h6>
              </div>
              <div class="card-body">
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Cras justo odio</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item">Vestibulum at eros</li>
              </ul>
              <div class="card-body">
                <a href="#" class="card-link">Card link</a>
                <a href="#" class="card-link">Another link</a>
              </div>
              <div class="card-footer text-muted">
                2 days ago
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-lg-12">
          <h2>Accordions</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="bs-component">
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Accordion Item #1
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <strong>This is the first item's accordion body.</strong> It is shown by default.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Accordion Item #2
                  </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <strong>This is the second item's accordion body.</strong> It is hidden by default.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Accordion Item #3
                  </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <strong>This is the third item's accordion body.</strong> It is hidden by default.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentView>

    <!-- Dialogs -->
    <ComponentView name="dialogs" :defaultExpand="local.defaultExpand">
      <div class="row">
        <div class="col-lg-6">
          <h2>Modals</h2>
          <div class="bs-component">
            <div class="modal position-static d-block">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true"></span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Save changes</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2>Offcanvas</h2>
          <div class="bs-component">
            <a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
              Link with href
            </a>
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
              Button with data-bs-target
            </button>

            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <div>
                  Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                </div>
                <div class="dropdown mt-3">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                    Dropdown button
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Popovers</h2>
          <div class="bs-component mb-5">
            <button type="button" class="btn btn-secondary me-1" title="Popover Title" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="left" data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Left</button>
            <button type="button" class="btn btn-secondary me-1" title="Popover Title" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Top</button>
            <button type="button" class="btn btn-secondary me-1" title="Popover Title" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Bottom</button>
            <button type="button" class="btn btn-secondary me-1" title="Popover Title" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Right</button>
          </div>
          <h2>Tooltips</h2>
          <div class="bs-component mb-5">
            <button type="button" class="btn btn-secondary me-1" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">Left</button>
            <button type="button" class="btn btn-secondary me-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Top</button>
            <button type="button" class="btn btn-secondary me-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">Bottom</button>
            <button type="button" class="btn btn-secondary me-1" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">Right</button>
          </div>
          <h2>Toasts</h2>
          <div class="bs-component">
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header">
                <strong class="me-auto">Bootstrap</strong>
                <small>11 mins ago</small>
                <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
                  <span aria-hidden="true"></span>
                </button>
              </div>
              <div class="toast-body">
                Hello, world! This is a toast message.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentView>

  </x-section>
  <!--  !# C0CKP1T_END template -->
</template>

<style scoped>
/* !# C0CKP1T_START style */

/* !# C0CKP1T_END style */
</style>
