import 'dotenv/config';
import axios from 'axios';

const xProdiaKey = process.env.X_PRODIA_KEY;

const getImage = async job => {
  const options = {
    method: 'GET',
    url: `https://api.prodia.com/v1/job/${job}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Prodia-Key': xProdiaKey
    }
  };

  try {
    const response = await axios.request(options);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default getImage;
