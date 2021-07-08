# USM Engineering Metrics Dashboard

## Overview

In order to report on the progress of higher-level initiatives (projects), this dashboard provides a set of metrics that show the progress toward completing a particular set of backlog epics stored in Jira

## Backlog Epics

The dashboard pulls data from the eng-metrics-api RESTful API layer, which in turn fetches the latest backlog and epic data from Jira using the Atlassian API

Since a business initiative (project) may only include a subset of the epics stored in the backlog, only epics that have the "Budget-Reporting" label are included in the report

## Setup

### Prerequisites

To configure the USM Engineering Metrics dashboard in your local environment, you will first need to:
* Deploy the eng-metrics API
* Install Nodejs
* Store the company's Atlassian API key in a local environment variable
* Clone this repo

### Install Packages
```
npm install
```

### Run
```
npm start
```