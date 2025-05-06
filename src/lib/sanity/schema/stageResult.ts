export default {
  name: 'stageResult',
  title: 'Stage Result',
  type: 'document',
  fields: [
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally this result belongs to'
    },
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{ type: 'stage' }],
      description: 'The stage this result is related to'
    },
    {
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'position', title: 'Position', type: 'number' },
          { name: 'driver', title: 'Driver', type: 'reference', to: [{ type: 'driver' }] },
          { name: 'coDriver', title: 'Co-Driver', type: 'reference', to: [{ type: 'driver' }] },
          { name: 'time', title: 'Time', type: 'string' },
          { name: 'gap', title: 'Gap', type: 'string' },
          { name: 'carNumber', title: 'Car Number', type: 'number' },
          { name: 'car', title: 'Car', type: 'string' },
          { name: 'status', title: 'Status', type: 'string' },
          { name: 'penalties', title: 'Penalties', type: 'array', of: [{ type: 'string' }] },
          { name: 'cumulativeTime', title: 'Cumulative Time', type: 'string' },
        ]
      }],
      description: 'Array of individual results for the stage'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Date when the result was recorded'
    }
  ]
}
