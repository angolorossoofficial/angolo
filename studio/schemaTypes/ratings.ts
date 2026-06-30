import {defineType, defineField} from 'sanity'

// Reusable 0–5 axis (mezze stelle, es. 3.5) used by the redazione star panel.
const axis = (name: string, title: string) =>
  defineField({
    name,
    title,
    description: 'Da 0 a 5 (mezze stelle ammesse, es. 3.5)',
    type: 'number',
    validation: (rule) => rule.min(0).max(5).precision(1),
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
