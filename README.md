# FAQ Plugin

FAQ plugin allows you to ask questions and receive answers against a Google Sheet with a predefined list of questions and answers.

## Authorization with Google Sheets

This plugin requires OAuth2 authorization to access the Google Sheets API.
To authorize the plugin to access your Google Sheets, you need to specify Client ID and Client Secret in the plugin configuration parameters.

Follow these steps to get the Client ID and Client Secret:

**1. Enable the Google Sheets API**

1. Go to the Google Developers Console.
2. Create a new project or select an existing one.
3. Enable the Google Sheets API for your project.

**2. Create Credentials**

1. In the Google Developers Console, go to the "Credentials" page.
2. Click on “Create Credentials” and choose “OAuth client ID”.
3. Set up the OAuth consent screen if prompted.
4. Choose the application type (e.g., Web application, Other).
5. Save the credentials (you’ll get a client ID and client secret).

**3. Configure the plugin**

1. Copy the Client ID and Client Secret to the plugin configuration parameters.

## Available actions

| Action                                           | Description                                                                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Add missing FAQ](/src/actions/addMissingFaq.ts) | Add the missing FAQ to the Google Sheet. The administrator must approve the new FAQ before the &quot;Get answer&quot; action can use it.               |
| [Get answer](/src/actions/getAnswer.ts)          | Get an answer to your question from the predefined list of FAQs in a Google Sheet. Every access to the FAQs will be logged to a separate Google Sheet. |

## Repository structure

The entry point for this plugin is the [./src/index.ts](/src/index.ts) file.
It contains the plugin definition and references to all the actions.

The [./src/actions/](/src/actions/) folder contains all the actions this plugin defines.
Every action is represented by a separate file with the action definition and implementation.

The [./dist/plugin.js](/dist/plugin.js) file is the bundled version of the plugin with all the dependencies.
Connery uses this file to run the plugin.

## Connery

This repository is a plugin for [Connery](https://connery.io).

Connery is an open-source plugin ecosystem for AI and No-Code.

Learn more about Connery:

- [Documentation](https://docs.connery.io)
- [Source code](https://github.com/connery-io/connery-platform)
- [How to start using this plugin with Connery?](https://docs.connery.io/docs/platform/quick-start/)

## Support

If you have any questions or need help with this plugin, please create an issue in this repository.
