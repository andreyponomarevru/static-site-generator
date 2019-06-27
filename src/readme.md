`_variables-mixins-and-functions.scss` - you should never import things, that result in CSS several times - SCSS file imported into components (`_variables-mixins-and-functions.scss`, in my case) should typically only contain variables, mixins and functions!!!, thus when compiled, the entire content of `_variables-mixins-and-functions.scss` just dissapears, being imported (and compiled into actual CSS) into every SCSS file.

More on this: https://github.com/angular/angular-cli/issues/8431#issuecomment-343486059

`master.js` bundles everything together
