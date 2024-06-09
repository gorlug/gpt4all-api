import axios from 'axios';
import { CreateCompletionRequest } from '../src/gpt4all.service';

async function run() {
  const prompt = `What is 1 + 1?`;
  const completionRequest: CreateCompletionRequest = {
    messages: prompt,
    temperature: 0.5,
  };
  console.log(JSON.stringify(completionRequest));
  try {
    const response = await axios.post(
      'http://localhost:3000/chat/completions',
      completionRequest,
    );
    console.log(JSON.stringify(response.data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
