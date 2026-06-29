import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
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
      name: 'tagline',
      title: 'Sottotitolo',
      description: 'Frase breve sotto il nome (es. "Senza tagli")',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descrizione',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'accent',
      title: 'Colore accento',
      description: 'HEX a 6 cifre, es. #c1121f',
      type: 'string',
      validation: (rule) =>
        rule.regex(/^#[0-9a-fA-F]{6}$/, {name: 'hex'}).error('Usa un HEX a 6 cifre, es. #c1121f'),
    }),
    defineField({
      name: 'atmo',
      title: 'Atmosfera (CSS gradient)',
      description: "Sfondo della card categoria finché non c'è una copertina",
      type: 'string',
    }),
    defineField({
      name: 'cover',
      title: 'Copertina',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Ordine',
      description: 'Posizione nella griglia delle categorie (più basso = prima)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {title: 'Ordine', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'tagline', media: 'cover'},
  },
})
