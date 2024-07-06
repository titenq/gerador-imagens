import fs from 'node:fs';
import path from 'node:path';

import axios from 'axios';
import inquirer from 'inquirer';
import figlet from 'figlet';

import generateJob from './generateJob.js';
import getImage from './getImage.js';
import slug from './helpers/slug.js';

const saveImage = async (prompt, style_preset, width, height) => {
  const job = await generateJob(prompt, style_preset, width, height);

  const interval = setInterval(async () => {
    try {
      const image = await getImage(job);

      if (image.status === 'generating') {
        console.log('Imagem ainda está sendo gerada...');
      } else {
        console.log('Imagem pronta:', image);
        clearInterval(interval);

        const dir = path.join('.', 'img');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        const imageUrl = image.imageUrl;

        const response = await axios({
          url: imageUrl,
          responseType: 'stream'
        });

        const imagePath = path.join(dir, `${slug(prompt)}.png`);
        const writer = fs.createWriteStream(imagePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
          console.log(`Imagem salva em: ${imagePath}`);
        });

        writer.on('error', error => {
          console.error('Erro ao salvar a imagem:', error);
        });
      }
    } catch (error) {
      console.error('Erro ao obter a imagem:', error);

      clearInterval(interval);
    }
  }, 1000);
};

const run = async () => {
  console.log(figlet.textSync('Gerador de Imagens', {
      font: 'Doom',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      whitespaceBreak: true
    })
  );
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'prompt',
      message: 'Digite o prompt para gerar a imagem:'
    },
    {
      type: 'list',
      name: 'style_preset',
      message: 'Escolha o preset de estilo (padrão photographic):',
      choices: [
        'photographic',
        '3d-model',
        'analog-film',
        'anime',
        'cinematic',
        'comic-book',
        'craft-clay',
        'digital-art',
        'enhance',
        'fantasy-art',
        'isometric',
        'line-art',
        'low-poly',
        'neon-punk',
        'origami',
        'pixel-art',
        'texture'
      ],
      default: 'photographic',
      pageSize: 17
    },
    {
      type: 'input',
      name: 'width',
      message: 'Digite a largura (padrão: 1344, entre 512 a 1536):',
      default: 1344,
      validate: value => {
        const number = parseInt(value);
        const valid = !isNaN(number) && number >= 512 && number <= 1536;

        return valid || 'Por favor, insira um número inteiro entre 512 e 1536';
      },
      filter: Number
    },
    {
      type: 'input',
      name: 'height',
      message: 'Digite a altura (padrão: 768, entre 512 a 1536):',
      default: 768,
      validate: value => {
        const number = parseInt(value);
        const valid = !isNaN(number) && number >= 512 && number <= 1536;

        return valid || 'Por favor, insira um número inteiro entre 512 e 1536';
      },
      filter: Number
    }
  ]);

  await saveImage(answers.prompt, answers.style_preset, answers.width, answers.height);
};

run();
