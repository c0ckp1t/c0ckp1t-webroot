
# Theming


Secret to theming and having good design: Iterate fast and with a large variation.

To customize CSS modify `style.css`.


Visually the framework uses Bootstrap, so you can override the main Bootstrap variables.


It is best to create your own bootstrap.min.css file

There is project called **Bootswatch** that provides many free customized bootstrap.min.css files for Bootstrap. 

* https://bootswatch.com/
* https://www.jsdelivr.com/package/npm/bootswatch
* https://www.jsdelivr.com/package/npm/bootswatch?tab=files&path=dist


These are supported by `Theme.mjs`

```js
// List of available Bootswatch themes (for CSS swap)
const bootswatchThemes = [
  'brite', 'cerulean', 'cosmo', 'cyborg', 'darkly', 'flatly', 'journal',
  'litera', 'lumen', 'lux', 'materia', 'minty', 'morph', 'pulse', 'quartz',
  'sandstone', 'simplex', 'sketchy', 'slate', 'solar', 'spacelab',
  'superhero', 'united', 'vapor', 'versa', 'yeti', 'zephyr'
]
```


# Icons

Use the @fortawesome/fontawesome-svg-core npm packages to build a custom bundle containing only the icons you use. This gives the smallest payload but requires a build step (which conflicts with your zero-build philosophy)

The brands.min.css + solid.min.css approach loads only two icon style subsets instead of everything. The marginal savings from further subsetting probably isn't worth the complexity, especially for a zero-build framewor
