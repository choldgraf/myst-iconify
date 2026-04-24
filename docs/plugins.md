
# Use in other plugins

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
