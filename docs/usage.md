# Usage

Inline icons from [Iconify](https://iconify.design) - over 200,000 icons from 100+ icon sets.

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

### Inline in text

:::::{myst:demo}
Icons render inline: click the {icon}`mdi:cog` settings icon, then look for the {icon}`mdi:shield-check` security tab.
:::::

### As linked icons

:::::{myst:demo}
[{icon}`mdi:github` Source code](https://github.com/jupyter-book/myst-iconify)
[{icon}`mdi:book-open-variant` Documentation](https://mystmd.org)
:::::
