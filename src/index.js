import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  try {
    const token = getInput("github-token", { required: true });
    const geminiApiKey = getInput("gemini-api-key", { required: true });
    const userPrompt = getInput("user-prompt");
    const characterLimit = getInput("character-limit");

    const octokit = getOctokit(token);

    if (context.payload.pull_request == null) {
      throw new Error("This action can only be run on pull_request events");
    }

    const { owner, repo } = context.repo;
    const { number } = context.payload.pull_request;
    const commentBody = await geminiCall(geminiApiKey, userPrompt, characterLimit);
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

async function geminiCall(key, userPrompt, characterLimit) {
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`${userPrompt} in ${characterLimit} characters`);

    return result.response.text();
  } catch (error) {
    setFailed("Error generating content with Gemini:", error);
    return "An error occurred while generating content.";
  }
}

run();
