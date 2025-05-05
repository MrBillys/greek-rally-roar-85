
export default {
  name: 'car',
  title: 'Car',
  type: 'document',
  fields: [
    {
      name: 'make',
      title: 'Make',
      type: 'string',
      description: 'Manufacturer (e.g., "Ford", "Toyota")'
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      description: 'Model name (e.g., "Fiesta", "Yaris")'
    },
    {
      name: 'engineCapacity',
      title: 'Engine Capacity',
      type: 'number',
      description: 'Engine size in liters'
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      description: 'The year of manufacture'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'The category or class of the car (e.g., "WRC", "R5")'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Image of the car'
    }
  ]
}
