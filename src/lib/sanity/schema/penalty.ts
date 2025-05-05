
export default {
  name: 'penalty',
  title: 'Penalty',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      description: 'Type of penalty (e.g., "time penalty", "retirement penalty")'
    },
    {
      name: 'timeAdded',
      title: 'Time Added',
      type: 'string',
      description: 'Time added to the team\'s total time due to the penalty (e.g., "+1m 30s")'
    },
    {
      name: 'reason',
      title: 'Reason',
      type: 'string',
      description: 'The reason for the penalty (e.g., "speeding in a control zone")'
    },
    {
      name: 'entry',
      title: 'Entry',
      type: 'reference',
      to: [{ type: 'entry' }],
      description: 'The entry (team) that the penalty applies to'
    },
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{ type: 'stage' }],
      description: 'The stage to which the penalty applies (if applicable)'
    },
    {
      name: 'dateApplied',
      title: 'Date Applied',
      type: 'datetime',
      description: 'The date when the penalty was applied'
    }
  ]
}
