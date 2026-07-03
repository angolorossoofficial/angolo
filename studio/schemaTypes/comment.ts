import {defineType, defineField} from 'sanity'

// Public comment, submitted from the site via a Netlify Function and written
// here UNapproved. The redazione approves it in Studio (approved = true) before
// it becomes visible on the review page. NOTE: no email is collected or stored —
// the whole dataset is public-read, so storing PII here would leak it. Name +
// message only; moderation is by approve/reject.
export const comment = defineType({
  name: 'comment',
  title: 'Commento',
  type: 'document',
  // Created by an automated function; not authored by hand in the Studio.
  readOnly: false,
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Commento',
      type: 'text',
      rows: 4,
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
      name: 'approved',
      title: 'Approvato',
      description: 'Spunta per pubblicare il commento sul sito.',
      type: 'boolean',
      initialValue: false,
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
    select: {name: 'name', message: 'message', approved: 'approved', review: 'reviewTitle'},
    prepare({name, message, approved, review}) {
      const flag = approved ? '✅' : '🕓'
      return {
        title: `${flag} ${name || 'Anonimo'}`,
        subtitle: [review, message].filter(Boolean).join(' — '),
      }
    },
  },
})
