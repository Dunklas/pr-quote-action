const core = require('@actions/core');
const github = require('@actions/github');

try {
    const githubToken = core.getInput('github-token');
    if (github.context.eventName != 'pull_request') {
        core.setFailed('cat-pr-comment-action can only be used on pull_request events');
        return;
    }
    const prNumber = github.context.payload.pull_request.number;
    const octokit = github.getOctokit(githubToken);
    octokit.rest.issues.createComment({
        ...github.context.repo,
        issue_number: prNumber,
        body: 'The world is indeed comic, but the joke is on mankind.'
    });
} catch (error) {
    core.setFailed(error.message);
}
