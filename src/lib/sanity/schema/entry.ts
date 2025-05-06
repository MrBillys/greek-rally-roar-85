
export default {
  name: 'entry',
  title: 'Entry',
  type: 'document',
  fields: [
    {
      name: 'number',
      title: 'Number',
      type: 'number',
      description: 'The entry number of the team'
    },
    {
      name: 'driver',
      title: 'Driver',
      type: 'reference',
      to: [{ type: 'driver' }],
      description: 'The driver\'s information'
    },
    {
      name: 'coDriver',
      title: 'Co-Driver',
      type: 'reference',
      to: [{ type: 'coDriver' }],
      description: 'The co-driver\'s information'
    },
    {
      name: 'car',
      title: 'Car',
      type: 'reference',
      to: [{ type: 'car' }],
      description: 'The car used by the team'
    },
    {
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
      description: 'The team they represent'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'The car category they compete in (e.g., WRC, R2, etc.)'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally the entry is participating in'
    }
  ]
}
