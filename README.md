# Union Street Media Engineering Metrics Dashboard

My company uses Jira for product backlog management and reporting. While Atlassian products help our teams manage backlogs and stay organized, their reporting leaves much to be desired. Some basic reports are available for velocity and cycle time, though they lack proper filters. Other reports are missing entirely

The engineering metrics dashboard fills in the blanks by providing more detailed reporting using the [Jira Software Cloud API](https://developer.atlassian.com/cloud/jira/software/rest/intro/)

## Project Structure

The engineering metrics dashboard consists of three main repos:
* Web front end
* RESTful API
* Warehouse schema DDL

The front-end and API are contained in this monorepo. The warehouse schema DDL is stored in a separate repository

Each project contains a README with setup instructions for local development and deployment
