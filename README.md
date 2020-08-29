# Simple table manager based on JavaScript

## Used technologies
* Parcel
* Bootstrap
* Font-awesome
* JSON data - [JSONPlaceholder](https://jsonplaceholder.typicode.com)

## Get started
1. Install Parcel `npm i -g parcel`
2. Run Parcel in project directory `parcel index.html`
3. For build project run `parcel build index.html`

### Table options
Import TableManger and create init options

```js
const options = {
      items: arrItems,
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
```

`#table-block` - DOM element for insert table render