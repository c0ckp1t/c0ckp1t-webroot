
# Theming


> Secret to theming and having a good layout: Iterate fast and with a large variation.

For simple modification customize [style.css](https://github.com/c0ckp1t/c0ckp1t-webroot/blob/main/style.css). The framework mainly uses **Bootstrap**, so you can override the main Bootstrap variables.

It is best to create your own `bootstrap.min.css` file. There is project called **Bootswatch** that provides many free customized bootstrap.min.css files for Bootstrap. 

* https://bootswatch.com/
* https://www.jsdelivr.com/package/npm/bootswatch
* https://www.jsdelivr.com/package/npm/bootswatch?tab=files&path=dist

```js
// List of available Bootswatch themes (for CSS swap)
const bootswatchThemes = [
  'brite', 'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal',
  'litera', 'lumen', 'lux', 'materia', 'minty', 'morph', 'pulse', 'quartz',
  'sandstone', 'simplex', 'sketchy', 'slate', 'solar', 'spacelab',
  'superhero', 'united', 'vapor', 'versa', 'yeti', 'zephyr'
]
```

**Note:** Theming is under development. 

* [Demo - Theming](:/default/components/theme)


# Icons

* Fontawesome icons are supported
  * See [css](https://github.com/c0ckp1t/c0ckp1t-webroot/tree/main/css/fontawesome) folder

Use the `@fortawesome/fontawesome-svg-core` npm packages to build a custom bundle containing only the icons you use. This gives the smallest payload but requires a build step. But generally just load `brands.min.css` + `solid.min.css` instead of everything. The marginal savings from further subsetting probably isn't worth the complexity, especially for a zero-build framework.
