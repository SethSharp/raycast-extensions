# Check Conflicting PRs

A Raycast Extension built to show the status of your open PRs.

Generate a personal access token from github
1. From user settings menu in GitHub, access the developer settings then personal access tokens and generate a token
2. Name the token `Github Workflow Token` and give it top level repo scope
3. Make sure to copy the token as it will be hidden after leaving the page
4. Run `npm run dev` to run the app from the Raycast interface
5. Enter your GitHub username, the organisation name and the token you generated along with any other filters
6. Now you should be shown your PRs and their state with some additional info
