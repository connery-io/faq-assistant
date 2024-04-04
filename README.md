# Google Sheets FAQ Plugin

The FAQ plugin allows you to ask questions and receive answers against a Google Sheet with a predefined list of questions and answers.

## How to set up the plugin

### Prepare Google Sheets

**1. Create "FAQ List" sheet**

This sheet should contain the list of questions and answers that the plugin will use to answer your questions.

![FAQ List Google Sheet](/img/faq-list.png)

- Create a "FAQ List" Google Sheet with the following columns: "Question" and "Answer".
  - The first row should contain the exact names of the columns.
  - The sheet may also contain other columns if needed.
- Add the questions and answers to the sheet.

**2. Create "FAQ Log" sheet**

This sheet will be used to log all the questions asked to the plugin.

![FAQ Log Google Sheet](/img/faq-log.png)

- Create a "FAQ Log" Google Sheet with the following columns: "Question Prompt", "Search Status", "FAQ Question", "FAQ Answer", "Search Timestamp".
  - The first row should contain the exact names of the columns.
  - The sheet may also contain other columns if needed.

**3. Share both sheets with the service account**

- Share both Google Sheets with the service account email address (see below).

### Create a service account on Google Cloud Platform

This plugin requires OAuth2 authorization to access the Google Sheets API.
To authorize the plugin to access your Google Sheets, you must provide a JSON Key from a Google Cloud Platform service account. This service account must have access to the Google Sheet you want to use with this plugin.

Follow these steps to get the JSON Key, grant access to the Google Sheet, and configure the plugin:

**1. Create a Service Account**

- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Select your project, go to "IAM & Admin" > "Service Accounts", and create a new service account.
- Grant the necessary permissions to the service account based on what actions it needs to perform.
- Create and download a JSON Key file for the service account. This file contains the credentials used to authenticate your server-to-server API requests.

**2. Share the Google Sheets with Service Account**

- Find the service account's email address in the JSON Key file or in the service account details in the Google Cloud Console.
- Share the Google Sheets with this service account email, just like you would with any regular user.

**3. Enable Google Sheets API**

- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Make sure you are logged in with the correct Google account and select correct project.
- Navigate to "APIs & Services" > "Dashboard".
- Click on “+ ENABLE APIS AND SERVICES” at the top.
- Search for "Google Sheets API", select it, and click “Enable”.

**4. Configure the plugin**

- Copy the JSON Key to the plugin configuration parameters when installin the plugin on the runner.

## Repository structure

This repository contains the plugin's source code.

| Path                            | Description                                                                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [./src/index.ts](/src/index.ts) | **The entry point for the plugin.** It contains the plugin definition and references to all the actions.                                             |
| [./src/actions/](/src/actions/) | **This folder contains all the actions of the plugin.** Each action is represented by a separate file with the action definition and implementation. |

## Built using Connery SDK

This plugin is built using [Connery SDK](https://github.com/connery-io/connery), an open-source project for plugin development.

[Learn how to use the plugin and its actions.](https://sdk.connery.io/docs/quickstart/use-plugin)

## Support

If you have any questions or need help with this plugin, please create an issue in this repository.
