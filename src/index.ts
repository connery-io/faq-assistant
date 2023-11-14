import { PluginDefinition } from '@connery-io/sdk';
import addMissingFaq from './actions/addMissingFaq';
import getAnswer from './actions/getAnswer';

const plugin: PluginDefinition = {
  title: 'FAQ Plugin',
  description:
    'FAQ plugin allows you to ask questions and receive answers against a Google Sheet with a predefined list of questions and answers.',
  actions: [addMissingFaq, getAnswer],
  configurationParameters: [],
  maintainers: [
    {
      name: 'Connery',
      email: 'support@connery.io',
    },
  ],
  connery: {
    runnerVersion: '0',
  },
};
export default plugin;
