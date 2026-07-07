import {defineType, defineField} from 'sanity'

// Like/dislike su un commento approvato, scritto da una Netlify Function. Il
// sito legge i conteggi client-side e ordina i commenti dal più apprezzato.
// Un solo "mi piace"/"non mi piace" per dispositivo/IP per commento, applicato
// server-side con un _id deterministico (solo hash salato dell'IP, nessun dato
// personale memorizzato).
export const commentReaction = defineType({
  name: 'commentReaction',
  title: 'Reazione a commento',
  type: 'document',
  fields: [
    defineField({
      name: 'reaction',
      title: 'Reazione',
      type: 'string',
      readOnly: true,
      options: {list: [
        {title: '👍 Mi piace', value: 'like'},
        {title: '👎 Non mi piace', value: 'dislike'},
      ]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'commentId',
      title: 'Commento (id)',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewSlug',
      title: 'Recensione (slug)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'createdAt',
      title: 'Inviata il',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {reaction: 'reaction', review: 'reviewSlug', date: 'createdAt'},
    prepare({reaction, review, date}) {
      const d = date ? new Date(date).toLocaleDateString('it-IT') : ''
      return {
        title: reaction === 'like' ? '👍 Mi piace' : '👎 Non mi piace',
        subtitle: [review, d].filter(Boolean).join(' · '),
      }
    },
  },
})
