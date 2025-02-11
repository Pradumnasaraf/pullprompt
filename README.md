[![release][release-badge]][release]
[![releases-ci][releases-ci-badge]][releases-ci]
[![build-ci][build-ci-badge]][build-ci]
[![actions-marketplace][actions-marketplace-badge]][actions-marketplace]

## About (PullPrompt)

**PullPrompt** comments on a Pull Request with a message generated from a user-given prompt. Under the hood, it uses Google’s Gemini API to generate the text.

## Features

- **Model Selection**: Choose from a variety of models to generate the text.
- **Model Temperature**: Set the temperature of the model to control the creativity of the text.
- **Word Limit and Language**: Set the word limit and language of the generated text.

## Usage  

The Action multiple inputs, some are required and some are optional:  

1. **`github-token`** (Required) – The GitHub token used for authentication.  
   *"Share an open-source tip in 2 to 3 lines to help developers improve their workflow."* You can find this in the `action.yml` file.  
2. **`gemini-api-key`** (Required) – The Gemini API key used for authentication and text generation. You can obtain it from the [Gemini API](https://ai.google.dev/gemini-api/docs/api-key) page.  
3. **`user-prompt`** (Optional) – The prompt used to generate the text. The default is:  
4. **`gemini-model`** (Optional) – The model used to generate the text. The default is: `gemini-1.5-flash`. We can use other Gemini models like `gemini-2.0-flash-exp`, `gemini-1.5-flash-8b`, `gemini-1.5-pro`, `gemini-1.0-pro`. A complete list of models can be found [here](https://ai.google.dev/gemini-api/docs/models/gemini).
5. **`word-limit`** (Optional) – The word limit for the generated text. The default is 200.
6. **`output-language`** (Optional) – The language of the generated text. The default is `english`.
7. **`model-temp`** (Optional) – The temperature of the model. The default is 0.5. We can set the temperature between 0.1 to 1.0. The lower the temperature, the more deterministic the model will be. The higher the temperature, the more creative the model will be.

### **Setting up the API Key**  
Once you have the API key, add it to your repository secrets:  
1. Go to **Repository Settings** → **Secrets** → **Actions**.  
2. Click **New Repository Secret**.  
3. Name it **`GEMINI_API_KEY`** and paste the API key as the value.  

### **Event Trigger**  
PullPrompt only works on **pull request events**. It will not trigger on any other event.  

```yaml
on:
  pull_request: # Works only on pull requests
```

### **Example Workflow**  
Below is an example of how to use PullPrompt in a GitHub Actions workflow:

> [!IMPORTANT]  
> Before using the below code, check the `pullprompt` action version in the `uses` field from the [GitHub Marketplace](https://github.com/marketplace/actions/pullprompt) for the latest version.

```yaml
name: PullPrompt

on:
  pull_request: # Works only on pull requests

jobs:
  pull_prompt:
    runs-on: ubuntu-latest

    permissions:
      contents: read # Required for reading files
      pull-requests: write # Required for commenting on PRs

    steps:
      - name: Checkout the code
        uses: actions/checkout@v4

      - name: Running PullPrompt
        uses: Pradumnasaraf/pullprompt@v1.2.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }} # Required
          gemini-api-key: ${{ secrets.GEMINI_API_KEY }} # Required
          user-prompt: "How to become a better developer?" # Optional
          gemini-model: "gemini-1.5-flash" # Optional
          output-language: "spanish" # Optional
          word-limit: 250 # Optional
          model-temp: 0.5 # Optional
```

## Example  

![en](https://github.com/user-attachments/assets/929d1aaa-4bed-4a21-b2bc-f809c4f7960d)

![jp](https://github.com/user-attachments/assets/94d69c65-5d6d-459a-8b5c-0750ccb3edbe)

## Contributing  

If you have suggestions for improving PullPrompt or want to report a bug, feel free to open an issue! We welcome all contributions.  

For more details, check out the [Contributing Guide](CONTRIBUTING.md).  

## License  

This project is licensed under the [GNU General Public License v3.0](LICENSE).  

## Security  

For information on reporting security vulnerabilities, please refer to the [Security Policy](SECURITY.md).  

[release]: https://github.com/Pradumnasaraf/pullprompt/releases
[release-badge]: https://img.shields.io/github/v/release/Pradumnasaraf/pullprompt
[releases-ci]: https://github.com/Pradumnasaraf/pullprompt/actions/workflows/releases.yml
[releases-ci-badge]: https://github.com/Pradumnasaraf/pullprompt/actions/workflows/releases.yml/badge.svg
[build-ci]: https://github.com/Pradumnasaraf/pullprompt/actions/workflows/ci.yml
[build-ci-badge]: https://github.com/Pradumnasaraf/pullprompt/actions/workflows/ci.yml/badge.svg
[actions-marketplace]: https://github.com/marketplace/actions/pullprompt
[actions-marketplace-badge]: https://img.shields.io/badge/marketplace-PullPrompt-blue?&logo=github
