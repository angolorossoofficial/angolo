import {defineType, defineField} from 'sanity'

// Editoriali / news (no ratings, no scheda tecnica) — es. approfondimenti,
// notizie, pezzi d'opinione come "Kill Bill: The Whole Bloody Affair".
export const news = defineType({
  name: 'news',
  title: 'News / Approfondimento',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kicker',
      title: 'Etichetta',
      description: 'Es. "Approfondimento", "News", "Opinione"',
      type: 'string',
      initialValue: 'Approfondimento',
    }),
    defineField({
      name: 'excerpt',
      title: 'Estratto',
      description: 'Frase di lancio mostrata nelle card e in apertura (max 280 caratteri)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'author',
      title: 'Autore',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data di pubblicazione',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Copertina',
      description: 'Facoltativa. Senza copertina si usa il gradiente qui sotto.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'atmo',
      title: 'Atmosfera (sfondo CSS)',
      description: 'Gradiente CSS di riserva usato come sfondo quando manca la copertina.',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Testo',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  orderings: [
    {title: 'Più recenti', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'kicker', media: 'cover'},
  },
})
