const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const getQuote = () => {
    const baseUrl = 'http://api.quotable.io';
    return fetch(`${baseUrl}/random`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Non-2xx status code from ${baseUrl}`);
            }
            return response.json()
        })
}

const onError = (error, allowFailure) => {
    console.warn(`Failed to post quote: ${error}`)
    if (allowFailure) {
        core.setFailed(error);
    }
}

const run = async () => {
    try {
        const githubToken = core.getInput('github-token');
        const allowFailure = core.getInput('allow-failure');
        if (github.context.eventName != 'pull_request') {
            core.setFailed('PR Quoter can only be used on pull_request events');
            return;
        }

        const quote = await getQuote()
            .catch(error => {
                return onError(error, allowFailure);
            })

        const prNumber = github.context.payload.pull_request.number;
        const octokit = github.getOctokit(githubToken);
        octokit.rest.issues.createComment({
            ...github.context.repo,
            issue_number: prNumber,
            body: `"*${quote.content}*"  \n- ${quote.author}`
        });
    } catch (error) {
        onError(error, allowFailure);
    }
}

run();
