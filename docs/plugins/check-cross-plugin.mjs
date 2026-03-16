// Demo plugin showing how to use myst-iconify from another plugin.
// Provides {check} and {cross} roles that emit iconifyPlaceholder nodes,
// which the myst-iconify transform resolves to inline icons.

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
