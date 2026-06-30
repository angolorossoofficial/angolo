import {defineType, defineField} from 'sanity'

// Public vote (0–10) on a review, written by a Netlify Function. The site reads
// these client-side to show "Pubblico X,X (N voti)" next to the redazione score.
// One vote per device is enforced client-side via localStorage (no cookie, no
// personal data stored here).
export const vote = defineType({
  name: 'vote',
  title: 'Voto del pubblico',
  type: 'document',
  fields: [
    defineField({
      name: 'value',
      title: 'Voto',
      type: 'number',
      readOnly: true,
      validation: (rule) => rule.required().min(0).max(10),
    }),
    defineField({
      name: 'reviewSlug',
      title: 'Recensione (slug)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'reviewTitle',
      title: 'Recensione',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Inviato il',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Più recenti',
      name: 'createdDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {value: 'value', review: 'reviewTitle', date: 'createdAt'},
    prepare({value, review, date}) {
      const d = date ? new Date(date).toLocaleDateString('it-IT') : ''
      return {title: `Voto ${value}/10`, subtitle: [review, d].filter(Boolean).join(' · ')}
    },
  },
})
