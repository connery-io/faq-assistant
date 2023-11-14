import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';

const action: ActionDefinition = {
  key: 'getAnswer',
  title: 'Get answer',
  description: 'Get an answer to your question from the predefined list of FAQs in a Google Sheet. Every access to the FAQs will be logged to a separate Google Sheet.',
  type: 'read',
  inputParameters: [],
  operation: {
    handler: handler,
  },
  outputParameters: [],
};
export default action;

export async function handler({
  inputParameters,
  configurationParameters,
}: ActionContext): Promise<OutputParametersObject> {
  // TODO: Implement the action logic.

  return {};
}
