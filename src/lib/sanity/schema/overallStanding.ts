
export default {
  name: 'overallStanding',
  title: 'Overall Standing',
  type: 'document',
  fields: [
    {
      name: 'rallyId',
      title: 'Rally ID',
      type: 'string',
      description: 'ID of the rally'
    },
    {
      name: 'rallyName',
      title: 'Rally Name',
      type: 'string',
      description: 'Name of the rally'
    },
    {
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'The position in the standings'
    },
    {
      name: 'points',
      title: 'Points',
      type: 'number',
      description: 'Total points accumulated'
    },
    {
      name: 'entry',
      title: 'Entry',
      type: 'reference',
      to: [{ type: 'entry' }],
      description: 'The entry (team) in the standings'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Date when the standings were recorded'
    },
    {
      name: 'standings',
      title: 'Standings',
      type: 'array',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'position', title: 'Position', type: 'number' },
          { name: 'driver', title: 'Driver', type: 'string' },
          { name: 'totalTime', title: 'Total Time', type: 'string' },
          { name: 'gap', title: 'Gap', type: 'string' },
          { name: 'carNumber', title: 'Car Number', type: 'number' },
          { name: 'points', title: 'Points', type: 'number' }
        ]
      }],
      description: 'Array of individual standings'
    }
  ]
}
