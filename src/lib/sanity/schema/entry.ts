
export default {
  name: 'entry',
  title: 'Entry',
  type: 'document',
  fields: [
    {
      name: 'number',
      title: 'Number',
      type: 'number',
      description: 'The entry number of the team'
    },
    {
      name: 'driver',
      title: 'Driver',
      type: 'reference',
      to: [{ type: 'driver' }],
      description: 'The driver\'s information'
    },
    {
      name: 'coDriver',
      title: 'Co-Driver',
      type: 'reference',
      to: [{ type: 'coDriver' }],
      description: 'The co-driver\'s information'
    },
    {
      name: 'carDetails',
      title: 'Car Details',
      type: 'object',
      fields: [
        {
          name: 'make',
          title: 'Make',
          type: 'string',
          description: 'Car manufacturer (e.g., "Ford", "Toyota")'
        },
        {
          name: 'model',
          title: 'Model',
          type: 'string',
          description: 'Car model (e.g., "Fiesta", "Yaris")'
        },
        {
          name: 'category',
          title: 'Category',
          type: 'string',
          description: 'Car category (e.g., "WRC", "R5")'
        },
        {
          name: 'year',
          title: 'Year',
          type: 'number',
          description: 'Year of manufacture'
        }
      ],
      description: 'Details of the car being used'
    },
    {
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
      description: 'The team they represent'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'The car category they compete in (e.g., WRC, R2, etc.)'
    },
    {
      name: 'rally',
      title: 'Rally',
      type: 'reference',
      to: [{ type: 'rally' }],
      description: 'The rally the entry is participating in'
    }
  ],
  preview: {
    select: {
      number: 'number',
      driverName: 'driver.name',
      rallyName: 'rally.title',
      carMake: 'carDetails.make',
      carModel: 'carDetails.model'
    },
    prepare(selection) {
      const { number, driverName, rallyName, carMake, carModel } = selection
      return {
        title: `#${number || 'N/A'} - ${driverName || 'Driver'}`,
        subtitle: `${rallyName || 'Rally'} - ${carMake || ''} ${carModel || ''}`
      }
    }
  }
}
