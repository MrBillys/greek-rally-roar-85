
export default {
  name: 'stage',
  title: 'Stage',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the stage (e.g., "SS1 Elatia")'
    },
    {
      name: 'distance',
      title: 'Distance',
      type: 'number',
      description: 'Distance of the stage in kilometers'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Upcoming', value: 'upcoming' }
        ]
      },
      description: 'The status of the stage'
    },
    {
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
      description: 'The start time of the stage'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The date of the stage'
    },
    {
      name: 'time',
      title: 'Time',
      type: 'string',
      description: 'The scheduled time of the stage'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally this stage belongs to'
    }
  ]
}
