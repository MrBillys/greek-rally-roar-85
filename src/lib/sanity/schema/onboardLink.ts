
export default {
  name: 'onboardLink',
  title: 'Onboard Link',
  type: 'document',
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'URL of the onboard video'
    },
    {
      name: 'driver',
      title: 'Driver',
      type: 'reference',
      to: [{ type: 'driver' }],
      description: 'The driver associated with the onboard video'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally in which the video was captured'
    },
    {
      name: 'stage',
      title: 'Stage',
      type: 'reference',
      to: [{ type: 'stage' }],
      description: 'The stage in which the video was captured'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Date when the video was captured'
    }
  ]
}
