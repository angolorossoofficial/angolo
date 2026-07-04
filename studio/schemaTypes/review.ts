import {defineType, defineField} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Recensione',
  type: 'document',
  groups: [
    {name: 'main', title: 'Recensione', default: true},
    {name: 'tech', title: 'Scheda tecnica'},
    {name: 'media', title: 'Media'},
    {name: 'ratings', title: 'Voti'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      group: 'main',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorie',
      description:
        'Una o più categorie (es. Occulto + Splatter). La prima è quella principale: decide il colore di sfondo di riserva.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      group: 'main',
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Estratto',
      description: 'Frase di lancio mostrata nelle card e in home (max 280 caratteri)',
      type: 'text',
      rows: 3,
      group: 'main',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data di pubblicazione',
      type: 'datetime',
      group: 'main',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlight',
      title: 'In evidenza',
      type: 'string',
      group: 'main',
      options: {
        layout: 'radio',
        list: [
          {title: 'Consigliata', value: 'consigliata'},
          {title: 'Popolare', value: 'popolare'},
          {title: 'Importante', value: 'importante'},
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Recensione',
      type: 'array',
      group: 'main',
      of: [{type: 'block'}],
    }),

    // --- Scheda tecnica ---
    defineField({
      name: 'originalTitle',
      title: 'Titolo originale',
      type: 'string',
      group: 'tech',
    }),
    defineField({
      name: 'year',
      title: 'Anno',
      type: 'number',
      group: 'tech',
      validation: (rule) => rule.min(1880).max(2100),
    }),
    defineField({
      name: 'director',
      title: 'Regia',
      type: 'string',
      group: 'tech',
    }),
    defineField({
      name: 'cast',
      title: 'Cast',
      type: 'array',
      group: 'tech',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'runtime',
      title: 'Durata (minuti)',
      type: 'number',
      group: 'tech',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'country',
      title: 'Paese',
      type: 'string',
      group: 'tech',
    }),
    defineField({
      name: 'genres',
      title: 'Generi',
      type: 'array',
      group: 'tech',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    // --- Media ---
    defineField({
      name: 'poster',
      title: 'Copertina',
      description:
        "Facoltativa. Senza copertina la card usa il gradiente qui sotto, o quello della categoria.",
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'atmo',
      title: 'Atmosfera (sfondo CSS)',
      description:
        "Gradiente CSS di riserva usato come sfondo quando manca la copertina. Lascia vuoto per ereditare quello della categoria.",
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'trailer',
      title: 'Trailer (URL YouTube)',
      type: 'url',
      group: 'media',
    }),

    // --- Voti ---
    defineField({
      name: 'ratings',
      title: 'Voti redazione',
      type: 'ratings',
      group: 'ratings',
    }),
  ],
  orderings: [
    {
      title: 'Più recenti',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', cat: 'categories.0.title', media: 'poster', voto: 'ratings.votoFinale'},
    prepare({title, cat, media, voto}) {
      const bits = [cat, voto != null ? `Voto ${voto}` : null].filter(Boolean)
      return {title, subtitle: bits.join(' · '), media}
    },
  },
})
