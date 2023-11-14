import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';

const action: ActionDefinition = {
  key: 'addMissingFaq',
  title: 'Add missing FAQ',
  description: 'Add the missing FAQ to the Google Sheet. The administrator must approve the new FAQ before the &quot;Get answer&quot; action can use it.',
  type: 'create',
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
