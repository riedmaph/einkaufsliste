# API Endpoints WIP

The following are __suggestions__ how API endpoints might look.   

## List

### Request
Get a list by id

#### Method
GET
#### URL
/list/:listId

#### Request Body
_empty_

### Response
All items on the list

#### Response Body
__Type:__
```TypeScript
Array<{
  name: string,
  unit?: string,
  amount?: number
}>
```

__Example:__
```
[
  {
    "name": "Milch",
    "unit": "l",
    "amount": 3  
  },
  {
    "name": "Zucker"
  }
]
```
