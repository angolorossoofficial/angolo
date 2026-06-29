import {defineType, defineField} from 'sanity'

// Reusable 0–10 axis used by the redazione score panel.
const axis = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'number',
    validation: (rule) => rule.min(0).max(10).precision(1),
  })

export const ratings = defineType({
  name: 'ratings',
  title: 'Voti redazione',
  type: 'object',
  options: {columns: 2},
  fields: [
    axis('jumpscare', 'Jumpscare'),
    axis('splatter', 'Splatter'),
    axis('musiche', 'Musiche'),
    axis('trucco', 'Trucco'),
    axis('effetti', 'Effetti'),
    axis('costumi', 'Costumi'),
    defineField({
      name: 'votoFinale',
      title: 'Voto finale',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(10).precision(1),
    }),
  ],
})
