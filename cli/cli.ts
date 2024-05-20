import axios from 'axios';

async function run() {
  const prompt = `What is 1 + 1?`;
  const completionRequest = {
    prompt: prompt,
    temperature: 0.5,
  };
  console.log(JSON.stringify(completionRequest));
  try {
    const response = await axios.post(
      'http://localhost:3000',
      completionRequest,
    );
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
}

run();
