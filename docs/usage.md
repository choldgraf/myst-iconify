# Usage

A role for displaying inline icons from [Iconify](https://iconify.design) - over 200,000 icons from 100+ icon sets.

## The `{icon}` role

Use the `{icon}` role with any icon identifier in `prefix:name` format.
Browse available icons at [icon-sets.iconify.design](https://icon-sets.iconify.design).

### Basic usage

:::::{myst:demo}
- {icon}`mdi:home` Home
- {icon}`mdi:github` GitHub
- {icon}`mdi:rocket-launch` Launch
- {icon}`mdi:book-open-variant` Documentation
:::::

### Default prefix

Icons without a prefix default to [Material Design Icons](https://icon-sets.iconify.design/mdi/) (`mdi`), a general-purpose set with ~7,200 icons covering common UI actions, objects, and symbols:

:::::{myst:demo}
- {icon}`home` Home
- {icon}`star` Star
- {icon}`cog` Settings
- {icon}`magnify` Search
:::::

### Brand logos

Brand and project logos are **not** included in the default `mdi` set.
Use the [`simple-icons`](https://icon-sets.iconify.design/simple-icons/) or [`logos`](https://icon-sets.iconify.design/logos/) prefix instead:

:::::{myst:demo}
**Simple Icons** (`simple-icons`) - monochrome brand icons:
{icon}`simple-icons:python` {icon}`simple-icons:jupyter` {icon}`simple-icons:github` {icon}`simple-icons:numpy`

**Logos** (`logos`) - full-color brand logos:
{icon}`logos:python` {icon}`logos:jupyter` {icon}`logos:react` {icon}`logos:github-icon`
:::::

### Other popular icon sets

:::::{myst:demo}
**Font Awesome** (`fa6-solid`):
{icon}`fa6-solid:star` {icon}`fa6-solid:heart` {icon}`fa6-solid:bell` {icon}`fa6-solid:gear`

**Lucide** (`lucide`):
{icon}`lucide:rocket` {icon}`lucide:zap` {icon}`lucide:globe` {icon}`lucide:terminal`
:::::

### Custom colors

Use the `color` option to override the icon color. Accepts any CSS color value:

:::::{myst:demo}
{icon color=green}`mdi:check-circle` Passed
{icon color=red}`mdi:close-circle` Failed
{icon color="#ff9800"}`mdi:alert` Warning
{icon color=dodgerblue}`mdi:information` Info
:::::

:::{note}
Color only affects mono-color icons (those using `currentColor`). Multi-color icons like `logos:python` have their colors baked in and won't change.
:::

### Inline in text

:::::{myst:demo}
Icons render inline: click the {icon}`mdi:cog` settings icon, then look for the {icon}`mdi:shield-check` security tab.
:::::

### As linked icons

:::::{myst:demo}
[{icon}`mdi:github` Source code](https://github.com/choldgraf/myst-iconify)
[{icon}`mdi:book-open-variant` Documentation](https://mystmd.org)
:::::

## Use from other plugins

Other MyST plugins can use `myst-iconify` to resolve icons without reimplementing the fetching and caching logic. Just emit an `iconifyPlaceholder` node from your plugin's role or directive, and the `myst-iconify` transform will resolve it to an inline image automatically.

The node should look like:

```javascript
{ type: 'iconifyPlaceholder', key: 'prefix:name' }
```

For example, this documentation site defines a little demo plugin to create a `check` and `cross` role that uses the `iconify` implementation under the hood. It's used like this:

:::::{myst:demo}
- {check}`Task complete`
- {cross}`Task failed`
:::::

Here's the source code for that plugin ([`check-cross-plugin.mjs`](https://github.com/choldgraf/myst-iconify/blob/main/docs/plugins/check-cross-plugin.mjs)):

```javascript
const plugin = {
  name: 'Check and Cross Icons',
  roles: [
    {
      name: 'check',
      doc: 'Green checkmark icon with label text.',
      body: { type: String, required: true },
      run(data) {
        return [
          { type: 'iconifyPlaceholder', key: 'mdi:check-circle', color: '#4caf50' },
          { type: 'text', value: ` ${data.body}` },
        ];
      },
    },
    {
      name: 'cross',
      doc: 'Red cross icon with label text.',
      body: { type: String, required: true },
      run(data) {
        return [
          { type: 'iconifyPlaceholder', key: 'mdi:close-circle', color: '#f44336' },
          { type: 'text', value: ` ${data.body}` },
        ];
      },
    },
  ],
};

export default plugin;
```

## Notes and gotchas

### Vertical alignment and other visual differences

Icons are rendered at `1em` × `1em` with `vertical-align: -0.125em`, following [Iconify's own inline rendering guidance](https://iconify.design/docs/iconify-icon/inline.html). Because each icon's artwork fills its SVG grid differently, some icons may appear slightly higher or lower than others next to text. This is inherent to the icon designs, so your best bet is to choose icon sets that look good, or write your own CSS to special-case ones that aren't quite right.
