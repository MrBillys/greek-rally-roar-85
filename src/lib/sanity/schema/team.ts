
export default {
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the team'
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'Country of the team'
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Logo of the team'
    },
    {
      name: 'drivers',
      title: 'Drivers',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'driver' }]
      }],
      description: 'List of drivers in the team'
    },
    {
      name: 'cars',
      title: 'Cars',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'car' }]
      }],
      description: 'List of cars used by the team'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      description: 'The slug for the team URL'
    }
  ]
}
