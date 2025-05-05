
export default {
  name: 'driver',
  title: 'Driver',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Full name of the driver'
    },
    {
      name: 'birthDate',
      title: 'Birth Date',
      type: 'datetime',
      description: 'Driver\'s birth date'
    },
    {
      name: 'nationality',
      title: 'Nationality',
      type: 'string',
      description: 'Nationality of the driver'
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'A photo of the driver'
    },
    {
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
      description: 'The team the driver belongs to'
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      description: 'Biography of the driver'
    },
    {
      name: 'championships',
      title: 'Championships',
      type: 'number',
      description: 'Number of championships won'
    },
    {
      name: 'podiums',
      title: 'Podiums',
      type: 'number',
      description: 'Number of podium finishes'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      description: 'The slug for the driver URL'
    }
  ]
}
