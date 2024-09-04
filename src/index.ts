import { PluginDefinition, setupPluginServer } from 'connery';
import askGoogleSheets from './actions/askGoogleSheets.js';

const pluginDefinition: PluginDefinition = {
  name: 'Google Sheets',
  description: 'Google Sheets plugin for Connery.',
  actions: [askGoogleSheets],
};

const handler = await setupPluginServer(pluginDefinition);
export default handler;
