import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GoogleGenAI } from "@google/genai";

async function run() {
  try {
    const token = getInput("github-token", { required: true });
    const geminiApiKey = getInput("gemini-api-key", { required: true });
    const userPrompt = getInput("user-prompt");
    const wordLimit = getInput("word-limit");
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
      wordLimit,
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

async function geminiCall(geminiApiKey, userPrompt, wordLimit, outputLanguage, geminiModel, modelTemperature) {
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const result = await ai.models.generateContent({
      model: geminiModel,
      contents: userPrompt + " in " + outputLanguage + " in " + wordLimit + " words",
      config: {
        temperature: Number(modelTemperature),
      },
    });
    return result.text;
  } catch (error) {
    setFailed("Error generating content with Gemini:", error);
    return "An error occurred while generating content.";
  }
}

run();
