import 'dotenv/config';
import axios from 'axios';

const xProdiaKey = process.env.X_PRODIA_KEY;

const generateJob = async (
  prompt, style_preset = 'photographic', width = 1344, height = 768
) => {
  const options = {
    method: 'POST',
    url: 'https://api.prodia.com/v1/sdxl/generate',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Prodia-Key': xProdiaKey
    },
    data: {
      prompt,
      style_preset,
      width,
      height
    }
  };

  try {
    const response = await axios.request(options);
    const data = await response.data;

    return data.job;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default generateJob;
