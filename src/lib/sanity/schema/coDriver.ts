
export default {
  name: 'coDriver',
  title: 'Co-Driver',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the co-driver'
    },
    {
      name: 'birthDate',
      title: 'Birth Date',
      type: 'datetime',
      description: 'Co-driver\'s birth date'
    },
    {
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
      description: 'Nationality of the co-driver'
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'A photo of the co-driver'
    },
    {
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
      description: 'The team the co-driver belongs to'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      description: 'The slug for the co-driver URL'
    }
  ]
}
