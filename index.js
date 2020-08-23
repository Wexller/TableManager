import {TableManger} from './table/TableManger'

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
        display: ['userId', 'id', 'title', 'completed']
      }
    }

    const tableManger = new TableManger('#table-block', options)
  })
