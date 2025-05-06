
export default {
  name: 'retirement',
  title: 'Retirement',
  type: 'document',
  fields: [
    {
      name: 'reason',
      title: 'Reason',
      type: 'string',
      description: 'Reason for retirement (e.g., "engine failure", "accident")'
    },
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{ type: 'stage' }],
      description: 'The stage during which the team retired'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally during which the team retired'
    },
    {
      name: 'entry',
      title: 'Entry',
      type: 'reference',
      to: [{ type: 'entry' }],
      description: 'The entry (team) that retired'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Date when the retirement occurred'
    }
  ],
  preview: {
    select: {
      title: 'entry.number',
      subtitle: 'reason',
      rally: 'rally.title',
      stage: 'stage.name'
    },
    prepare(selection) {
      const { title, subtitle, rally, stage } = selection
      return {
        title: `Car #${title || 'N/A'} - ${subtitle || 'Retired'}`,
        subtitle: `${rally || 'Rally'} - ${stage || 'Stage'}`
      }
    }
  }
}
