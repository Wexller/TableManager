import {TableManger} from './table/TableManger'
import './styles/style.scss'

fetch('https://jsonplaceholder.typicode.com/todos')
  .then(response => response.json())
  .then(json => {
    const options = {
      items: json,
      header: {
        title: {
          userId: 'ID пользователя',
          id: 'ID',
          title: 'Название',
          completed: 'Завершен',
        },
        codes: ['id', 'userId', 'title', 'completed']
      },
      pagination: true,
      itemsPerPage: 10,
      order: {
        codes: ['id', 'userId', 'title'],
        by: {
          id: 'number',
          userId: 'number',
          title: 'text',
          completed: 'text'
        }
      }
    }

    const tableManger = new TableManger('#table-block', options)
  })