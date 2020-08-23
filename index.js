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
        display: ['id', 'userId', 'title', 'completed']
      },
      pagination: true,
      itemsPerPage: 10
    }

    const tableManger = new TableManger('#table-block', options)
  })