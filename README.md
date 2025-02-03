## About (PullPrompt)

**PullPrompt** comments on a Pull Request with a message generated from a user-given prompt. Under the hood, it uses Google’s Gemini API to generate the text.  

## Usage  

The Action takes three inputs:  

1. **`github-token`** (Required) – The GitHub token used for authentication.  
   *"Share an open-source tip in 2 to 3 lines to help developers improve their workflow."* You can find this in the `action.yml` file.  
2. **`gemini-api-key`** (Required) – The Gemini API key used for authentication and text generation. You can obtain it from the [Gemini API](https://ai.google.dev/gemini-api/docs/api-key) page.  
3. **`user-prompt`** (Optional) – The prompt used to generate the text. The default is:  
4. **`character-limit`** (Optional) – The character limit for the generated text. The default is 300.

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
        uses: Pradumnasaraf/pullprompt@v1.0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }} # Required
          gemini-api-key: ${{ secrets.GEMINI_API_KEY }} # Required
          user-prompt: "Write your prompt here" # Optional
          character-limit: 450 # Optional
```

## Example  

![Action demo screenshot](https://github.com/user-attachments/assets/3c88ab21-61a1-4fe7-b5ef-211c8e60e577)  

## Contributing  

If you have suggestions for improving PullPrompt or want to report a bug, feel free to open an issue! We welcome all contributions.  

For more details, check out the [Contributing Guide](CONTRIBUTING.md).  

## License  

This project is licensed under the [GNU General Public License v3.0](LICENSE).  

## Security  

For information on reporting security vulnerabilities, please refer to the [Security Policy](SECURITY.md).  
