import { PluginDefinition } from '@connery-io/sdk';
import searchFaq from './actions/searchFaq';

const plugin: PluginDefinition = {
  title: 'FAQ Plugin',
  description:
    'FAQ plugin allows you to ask questions and receive answers against a Google Sheet with a predefined list of questions and answers.',
  actions: [searchFaq],
  configurationParameters: [
    {
      key: 'faqListSheetId',
      title: 'FAQ List Sheet ID',
      description: 'ID of the Google Sheet with the list of FAQs.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'faqLogSheetId',
      title: 'FAQ Log Sheet ID',
      description: 'ID of the Google Sheet where the access to the FAQs will be logged.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'jsonKey',
      title: 'JSON Key',
      description: 'JSON key of the Google Cloud service account with access to the Google Sheets.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'openAiApiKey',
      title: 'OpenAI API Key',
      description: 'OpenAI API key to access the OpenAI API to identify the FAQ based on the user prompt.',
      type: 'string',
      validation: {
        required: true,
      },
    },
    {
      key: 'openAiModel',
      title: 'OpenAI Model',
      description:
        'OpenAI model to use to identify the FAQ based on the user prompt. We recommend using gpt-3.5-turbo-0613.',
      type: 'string',
      validation: {
        required: true,
      },
    },
  ],
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
