# pr-quote-action

This github action will post random quotes to your pull requests.

Quotes are fectched using the [Quotable](https://github.com/lukePeavey/quotable) API.

## Example usage
```yml
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  quote:
    runs-on: ubuntu-latest
    steps:
    - uses: Dunklas/pr-quote-action@v1.0
        with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
```
