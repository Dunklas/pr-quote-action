const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const getQuote = () => {
    const baseUrl = 'api.quotable.io';
    return fetch(`${baseUrl}/random`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Non-2xx status code from ${baseUrl}`);
            }
            return response.json()
        })
}

const run = async () => {
    try {
        const githubToken = core.getInput('github-token');
        if (github.context.eventName != 'pull_request') {
            core.setFailed('PR Quoter can only be used on pull_request events');
            return;
        }

        const quote = await getQuote()
            .catch(error => {
                core.setFailed(error);
                return;
            })

        const prNumber = github.context.payload.pull_request.number;
        const octokit = github.getOctokit(githubToken);
        octokit.rest.issues.createComment({
            ...github.context.repo,
            issue_number: prNumber,
            body: `"*${quote.content}*"  \n - ${quote.author}`
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
