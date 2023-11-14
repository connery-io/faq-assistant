# FAQ Plugin

FAQ plugin allows you to ask questions and receive answers against a Google Sheet with a predefined list of questions and answers.

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
