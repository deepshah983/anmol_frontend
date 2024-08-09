// youtubeEmbedValidationSchema.js
import * as yup from 'yup';

const youtubeEmbedValidationSchema = yup
  .string()
  .required('Please Enter YouTube Embed URL')
  .test('is-youtube-embed-url', 'Invalid YouTube Embed URL', (value) => {
    if (!value) {
      return false;
    }

    // Regular expression to match valid YouTube embed URLs
    const youtubeEmbedUrlPattern = /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+(\?[\w=&-]+)?$/i;
    return youtubeEmbedUrlPattern.test(value);
  });

export default youtubeEmbedValidationSchema;
