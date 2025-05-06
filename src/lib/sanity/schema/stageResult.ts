
export default {
  name: 'stageResult',
  title: 'Stage Result',
  type: 'document',
  fields: [
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{ type: 'stage' }],
      description: 'The stage this result is related to'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally this stage result belongs to'
    },
    {
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'Position in the special stage'
    },
    {
      name: 'stageTime',
      title: 'Stage Time',
      type: 'string',
      description: 'Time taken to complete the stage'
    },
    {
      name: 'gap',
      title: 'Gap',
      type: 'string',
      description: 'Time gap to the leader in the stage'
    },
    {
      name: 'cumulativeTime',
      title: 'Cumulative Time',
      type: 'string',
      description: 'Total cumulative time for the rally up to that stage'
    },
    {
      name: 'retired',
      title: 'Retired',
      type: 'boolean',
      description: 'Whether the team retired from the stage'
    },
    {
      name: 'onboardLink',
      title: 'Onboard Link',
      type: 'url',
      description: 'Link to an onboard video for that stage'
    },
    {
      name: 'entry',
      title: 'Entry',
      type: 'reference',
      to: [{ type: 'entry' }],
      description: 'The entry (team) this result belongs to'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Date when the result was recorded'
    },
    {
      name: 'results',
      title: 'Results',
      type: 'array',
      of: [{ 
        type: 'object',
        fields: [
          { name: 'position', title: 'Position', type: 'number' },
          { name: 'driver', title: 'Driver', type: 'string' },
          { name: 'time', title: 'Time', type: 'string' },
          { name: 'gap', title: 'Gap', type: 'string' },
          { name: 'carNumber', title: 'Car Number', type: 'number' },
          { name: 'status', title: 'Status', type: 'string' }
        ]
      }],
      description: 'Array of individual results for the stage'
    }
  ],
  initialValue: {
    retired: false
  },
  preview: {
    select: {
      title: 'stage.name',
      subtitle: 'rally.title',
      position: 'position'
    },
    prepare(selection) {
      const { title, subtitle, position } = selection
      return {
        title: `${title || 'Stage'} - Position ${position || 'N/A'}`,
        subtitle: `${subtitle || 'Rally'}`
      }
    }
  }
}
