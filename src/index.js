import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  try {
    const token = getInput("github-token", { required: true });
    const geminiApiKey = getInput("gemini-api-key", { required: true });
    const userPrompt = getInput("user-prompt");
    const characterLimit = getInput("character-limit");
    const outputLanguage = getInput("output-language");
    const geminiModel = getInput("gemini-model");
    const modelTemperature = getInput("model-temp");

    const octokit = getOctokit(token);

    if (context.payload.pull_request == null) {
      throw new Error("This action can only be run on pull_request events");
    }

    const { owner, repo } = context.repo;
    const { number } = context.payload.pull_request;
    const commentBody = await geminiCall(
      geminiApiKey,
      userPrompt,
      characterLimit,
      outputLanguage,
      geminiModel,
      modelTemperature
    );
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: commentBody,
    });
  } catch (error) {
    setFailed(error.message);
  }
}

async function geminiCall(geminiApiKey, userPrompt, characterLimit, outputLanguage, geminiModel, modelTemperature) {
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: geminiModel });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userPrompt + " in " + outputLanguage + " in " + characterLimit + " characters.",
            },
          ],
        },
      ],
      generationConfig: {
        temperature: modelTemperature,
      },
    });
    return result.response.text();
  } catch (error) {
    setFailed("Error generating content with Gemini:", error);
    return "An error occurred while generating content.";
  }
}

run();
