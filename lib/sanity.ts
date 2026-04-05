// src/lib/sanity.ts
import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: 'e9nlmkj9',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

/*
 * Schema Sanity atteso per il documento "breedSection" (sottomenu razza homepage):
 *
 * {
 *   name: 'breedSection',
 *   title: 'Sezioni Razza',
 *   type: 'document',
 *   fields: [
 *     { name: 'order', type: 'number', title: 'Ordine' },
 *     { name: 'title', type: 'object', title: 'Titolo', fields: [
 *         { name: 'it', type: 'string' },
 *         { name: 'en', type: 'string' },
 *         { name: 'de', type: 'string' },
 *     ]},
 *     { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title.it' } },
 *     { name: 'excerpt', type: 'object', title: 'Estratto', fields: [
 *         { name: 'it', type: 'text' },
 *         { name: 'en', type: 'text' },
 *         { name: 'de', type: 'text' },
 *     ]},
 *   ]
 * }
 */
