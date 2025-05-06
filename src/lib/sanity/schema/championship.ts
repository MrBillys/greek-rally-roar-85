
export default {
  name: 'championship',
  title: 'Championship',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the championship (e.g., "WRC 2023")'
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'The year of the championship'
    },
    {
      name: 'seasonStart',
      title: 'Season Start',
      type: 'date',
      description: 'The start date of the season'
    },
    {
      name: 'seasonEnd',
      title: 'Season End',
      type: 'date',
      description: 'The end date of the season'
    },
    {
      name: 'rallies',
      title: 'Rallies',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'rally' }]
      }],
      description: 'List of rallies in the championship'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      description: 'The slug for the championship URL'
    }
  ]
}
