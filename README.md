# Open Source Raycast extensions

This is a open source project looking to improve the workflow of developers.


## Starting up
1. Clone the repo
2. From the terminal cd into github-workflow and run `npm install`
3. Run `npm run dev` to start the developer app
4. Generate a personal access token from github
5. From user settings menu, access the developer settings then personal access tokens and generate a token
6. Name the token `Github Workflow Token` and give it top level repo scope
7. Make sure to copy the token as it will be hidden after leaving the page
8. Run `npm run dev` to run the app from the Raycast interface
9. Enter your GitHub username, the repo name and the token you generated
10. Submit the answer and the app will show your PR's
11. Running npm run dev will clear the local storage and you will need to re-enter the information