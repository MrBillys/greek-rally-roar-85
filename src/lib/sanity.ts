
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Set up the client for fetching data from Sanity
export const client = createClient({
  projectId: '6590ce70', // You'll need to replace this with your actual Sanity project ID
  dataset: 'production',
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2025-05-04', // use a UTC date string
});

// Set up a helper function for generating image URLs
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
