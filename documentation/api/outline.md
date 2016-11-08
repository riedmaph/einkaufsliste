# API Endpoints WIP

The following are __suggestions__ how API endpoints might look.   

## List

### Request
#### Method
GET 
#### URL
/list/:listId

#### Request Body
_empty_

### Response
#### Response Body
__Type:__ 
```TypeScript
Array<{
  name: string,
  unit: string,
  amount: number
}>
```

__Example:__
```
[
  {
    "name": "Milch",
    "unit": "L",
    "amount": 3  
  },
]
```