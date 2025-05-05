
export default {
  name: 'rally',
  title: 'Rally',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The full name of the rally'
    },
    {
      name: 'shortCode',
      title: 'Short Code',
      type: 'string',
      description: 'A short code for the rally (e.g., "Acropolis2023")'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'The start date of the rally'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'The location or country where the rally takes place'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' }
        ]
      },
      description: 'The status of the rally'
    },
    {
      name: 'organizer',
      title: 'Organizer',
      type: 'string',
      description: 'Name of the organization hosting the event'
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'URL of the official rally website'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Main image for the rally'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description of the rally'
    },
    {
      name: 'championship',
      title: 'Championship',
      type: 'reference',
      to: [{ type: 'championship' }],
      description: 'The championship this rally is part of'
    },
    {
      name: 'specialStages',
      title: 'Special Stages',
      type: 'array',
      of: [{ type: 'object', fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string'
        },
        {
          name: 'distance',
          title: 'Distance',
          type: 'number'
        },
        {
          name: 'status',
          title: 'Status',
          type: 'string'
        },
        {
          name: 'startTime',
          title: 'Start Time',
          type: 'datetime'
        },
        {
          name: 'date',
          title: 'Date',
          type: 'date'
        },
        {
          name: 'time',
          title: 'Time',
          type: 'string'
        }
      ]}],
      description: 'The special stages in this rally'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      description: 'The slug for the rally URL'
    }
  ]
}
