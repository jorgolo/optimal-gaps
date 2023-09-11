# OptimalGaps

Tiny script to find the optimal gaps between elements on viewport resize and make the last element overflow the container so the scrollbar makes sense to be there.

The gaps are calculated so the last element will be overflown for the given pixels or a percentage of it set on the option "offset".

The gaps will shrink in a linear calculation from the point that the container has an horizontal scrollbar, to the point of the "minViewportWidth" option. This linear calculation is the same used in [this article of fluid typography](https://css-tricks.com/snippets/css/fluid-typography/)

---

How to use:

```
import OptimalGaps from "optimalGaps.min.js";

const container = document.querySelector('.container');
const elements = document.querySelectorAll('.element');

const options = {
  container,
  elements,
  offset: '30%',
  initialGap: 20,
};

new OptimalGaps(options);
```

---
### Parameters

| Parameters | Required   | Types & accepted values   | Default | Description |
| --------- | :-------:   | ----------------------:   | ------: | ----------- |
| container | Yes         | [DOMNode] -               | null    | The contiaines that has the overflow propertie |
| elements  | Yes         | [NodeList] -              | null    | The list of elements that will have the gap |
| offset    | Yes         | [String] '100px' or '10%' | null    | The quantity of the las element that will be overflown |
| initialGap  | Yes       | [Int]      -              | null    | The gaps that will be set without calculations |
| breakpointStart | No    | [Int]      -              | null    | If set the calculation will start from this point |
| containerClass  | No    | [String]   -              |'js-has-scroll'| The class that will be added to the contianer when the gap is calculated |
| minimunGap      | No    | [Int]    -                | 10 | The minimun gap that will be set  on the calculations |
| minViewportWidth   | No | [Int]    -                | 360 | The size of the viewport when the calculation will stop and the minimun gap will set |
| cssCustomProperty  | No | [String] -                |'--optimal-gap'| The CSS custom property that will be set on the container that has the calculated gap |
| sidePaddings       | No | [Int] -                   | 0 | The amount of padding in pixels that will be set in the container element with a CSS custom property: '--side-paddings' |

---

### Events

_Coming soon_