# Renderson - Library for rendering jsons in the browser in a tree structure.

### Usage
To render an object in the DOM in a tree structure:
```js
import { renderson } from 'renderson';

renderson({
    value: 'value',
    objectValue: {
        imObjectValue: 'objectValue'
    },
    arrayValue: ['imLocatedInArray']
});
```

#### Customisation
The available customisations are:
- the left offset.
```js
import { renderson } from 'renderson';

renderson({
    value: 'value',
    objectValue: {
        imObjectValue: 'objectValue'
    },
    arrayValue: ['imLocatedInArray']
}, { 
    leftPixelOffset: 30 // the default value 
});

```
