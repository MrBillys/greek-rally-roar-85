
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
  ]
}
