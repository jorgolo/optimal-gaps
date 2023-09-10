# OptimalGaps

Tiny script to find the optimal gaps between elements on viewport resize and make the las element overflow the viewport so the scrollbar makes sense to be there

---
### Parameters

| Parameters | Required | Types & accepted values | Default |
| --------- | :-------: | ----------------------:  | ------: |
| container | Yes        | [DOMNode] -               | null    |
| elements  | Yes        | [NodeList] -              | null    |
| offset    | Yes        | [String] '100px' or '10%' | null    |
| initialGap  | Yes      | [Int]      -              | null    |
| breakpointStart | No  | [Int]      -              | null    |
| containerClass  | No  | [String]   -              |'js-has-scroll'|
| minimunGap      | No    | [Int]    -              | 10 |
| minViewportWidth   | No | [Int]    -              | 360 |
| cssCustomProperty  | No | [String] -              |'--optimal-gap'|
| sidePaddings       | No | [Int] -                 | 0 |

---

### Events

_Coming soon_