import {defineType, defineField} from 'sanity'

// Banner pubblicitari gestiti dalla redazione. Ogni sponsor "attivo" entra
// nella rotazione dello spazio pubblicitario. Solo immagine + link: nessun
// cookie di tracciamento, quindi non serve consenso.
export const sponsor = defineType({
  name: 'sponsor',
  title: 'Pubblicità',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome (interno)',
      description:
        'Solo per riconoscerlo nel pannello, es. "Zero Automation — luglio". Non appare sul sito.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Attivo',
      description:
        'Se acceso, il banner entra nella rotazione. Spegnilo per fermarlo senza cancellarlo.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'url',
      title: 'Link',
      description: 'Indirizzo a cui porta il banner (https://…).',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'imageDesktop',
      title: 'Immagine — desktop',
      description:
        'Striscia larga. Consigliato 970×120 px (meglio 1940×240 per schermi retina). WebP/JPG/PNG, sotto ~150 KB.',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageMobile',
      title: 'Immagine — mobile (facoltativa)',
      description:
        'Formato compatto per telefono, 320×100 px (o 640×200 retina). Se manca, sul telefono si usa quella desktop rimpicciolita.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'alt',
      title: 'Testo alternativo',
      description:
        'Breve descrizione del banner (accessibilità), es. "Zero Automation — automazioni per aziende".',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'url', media: 'imageDesktop', active: 'active'},
    prepare({title, subtitle, media, active}) {
      return {title: `${active ? '🟢' : '⚪️'} ${title}`, subtitle, media}
    },
  },
})
