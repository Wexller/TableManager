import {TableManger} from './table/TableManger'
import './styles/style.scss'

fetch('https://jsonplaceholder.typicode.com/todos')
  .then(response => response.json())
  .then(json => {
    const options = {
      items: json,
      header: {
        userId: {
          title: 'User ID',
          width: '20%'
        },
        id: {
          title: 'ID',
          width: '10%'
        },
        title: {
          title: 'Название',
          width: '55%'
        },
        completed: {
          title: 'Завершен',
          width: '15%'
        }
      },
      pagination: true,
      itemsPerPage: 10,
      order: {
        id: 'number',
        userId: 'number',
        title: 'text',
        completed: 'text'
      },
      filter: ['id', 'userId', 'title', 'completed']
    }

    const tableManger = new TableManger('#table-block', options)
  })