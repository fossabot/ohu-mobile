<p><h1 align="center">ohu-mobile</h1></p>
<p align="center">Mobile UI Toolkit include components, style helpers.</p>
<p align="center">
    <img src="https://img.shields.io/github/workflow/status/jeffwcx/ohu-mobile/Build?style=for-the-badge" alt="CI" />
    <img src="https://img.shields.io/github/languages/top/jeffwcx/ohu-mobile?style=for-the-badge" alt="Language" />
    <img src="https://img.shields.io/github/license/jeffwcx/ohu-mobile?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/npm/v/@ohu-mobile/core?style=for-the-badge" alt="Version" />
    <img src="https://img.shields.io/github/lerna-json/v/jeffwcx/ohu-mobile?style=for-the-badge" alt="Lerna" />
</p>



[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjeffwcx%2Fohu-mobile.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjeffwcx%2Fohu-mobile?ref=badge_large)

## Install
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjeffwcx%2Fohu-mobile.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjeffwcx%2Fohu-mobile?ref=badge_shield)


`@ohu-mobile/core`  contains all the components.

```bash
npm install @ohu-mobile/core

# or

yarn add @ohu-mobile/core
```

For more documentation and demos of this package, visit [https://getohu.dev](https://getohu.dev).


If you want to use offical svg icons. You can install `@ohu-mobile/icons`. It's a subset of [Remix Icon](https://remixicon.com/).

```bash
npm install @ohu-mobile/icons

# or

yarn add @ohu-mobile/icons
```

If you use [sass](https://sass-lang.com/), I recommand you use `@ohu-mobile/styles`. It's a mixin library, it will save you a lot of time writing styles.


```bash
npm install @ohu-mobile/styles

# or

yarn add @ohu-mobile/styles
```

## How to import Components in Vue.js

+ Import on Demand

    Strongly Recommand👇

    ```ts
    import { Button } from '@ohu-mobile/core';
    ```
    To achieve this effect, please use [babel-plugin-import](https://github.com/ant-design/babel-plugin-import).

    Or Manually import

    ```ts
    import Button from '@ohu-mobile/core/lib/Button';
    import Buttom from '@ohu-mobile/core/lib/Button/style';
    ```

+ Import all components

    ```ts
    import Vue from 'vue';
    import Ohu from '@ohu-mobile/core';
    import '@ohu-mobile/core/dist/ohu-mobile.css';

    Vue.use(Ohu);
    ```

+ Use CDN

## Three ways to customize.

+ Use theme variables.

+ Change default behavior of component.

+ Import the component library into your source code.