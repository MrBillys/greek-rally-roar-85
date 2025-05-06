
export default {
  name: 'rallyResult',
  title: 'Rally Result',
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
      name: 'position',
      title: 'Position',
      type: 'number',
      description: 'Final position of the team'
    },
    {
      name: 'totalTime',
      title: 'Total Time',
      type: 'string',
      description: 'Total time taken for the rally (e.g., "2h 30m 45s")'
    },
    {
      name: 'gap',
      title: 'Gap',
      type: 'string',
      description: 'Time difference to the leader (e.g., "+3m 25s")'
    },
    {
      name: 'retired',
      title: 'Retired',
      type: 'boolean',
      description: 'Whether the team retired from the rally'
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
    }
  ],
  initialValue: {
    retired: false
  },
  preview: {
    select: {
      title: 'rally.title',
      subtitle: 'entry.number',
      position: 'position'
    },
    prepare(selection) {
      const { title, subtitle, position } = selection
      return {
        title: `${title || 'Rally'} - Position ${position || 'N/A'}`,
        subtitle: `Car #${subtitle || 'N/A'}`
      }
    }
  }
}
