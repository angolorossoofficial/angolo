import type {StructureResolver} from 'sanity/structure'

// Custom desk so the redazione moderates fast: pending comments sit at the top,
// separated from approved ones and from the public votes.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Angolo Rosso')
    .items([
      S.documentTypeListItem('review').title('Recensioni'),
      S.documentTypeListItem('news').title('News'),
      S.documentTypeListItem('category').title('Categorie'),
      S.documentTypeListItem('sponsor').title('📢 Pubblicità'),
      S.divider(),
      S.listItem()
        .title('🕓 Commenti da approvare')
        .schemaType('comment')
        .child(
          S.documentList()
            .title('Commenti da approvare')
            .filter('_type == "comment" && approved != true')
            .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
        ),
      S.listItem()
        .title('✅ Commenti approvati')
        .schemaType('comment')
        .child(
          S.documentList()
            .title('Commenti approvati')
            .filter('_type == "comment" && approved == true')
            .defaultOrdering([{field: 'createdAt', direction: 'desc'}]),
        ),
      S.documentTypeListItem('vote').title('Voti del pubblico'),
    ])
