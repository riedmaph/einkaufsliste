# API Endpoints WIP

The following are __suggestions__ how API endpoints might look.   

## Lists

### Request
Get a list of available lists for the user

#### Method
`GET`
#### URL
`/lists`
#### Request Body
__URL parameters:__
- `count?: number` Number of lists to return, _default:_ 20
- `offset?: number` Offset in number of lists, _default:_ 0

### Response
All available lists for the current user

#### Response Body
__Type:__
```TypeScript
Array<{
  uuid: string,
  name: string,
  entry_count: number 
}>
```
__Example:__
```json
[
  {
    "uuid": "hefhjuo-aegfhio-qefhiod",
    "name": "WG",
    "entry_count": 12
  },
  {
    "uuid": "tjzufeg-oixpoqd-qoxjlasd",
    "name": "Party",
    "entry_count": 3
  }
]
```

## Single List

### Request
Get a paginated list by id
#### Method
`GET`
#### URL
`/lists/:listId`
#### Request Body
__URL parameters:__
- `count?: number` Number of entries to return, _default:_ 20
- `offset?: number` Offset in number of entries, _default:_ 0

### Response
_count_ entries, starting with item _offset_

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
```json
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


## Add List-Item
### Request
#### Method
`POST` or `PUT`?
#### URL
`/list/:listId/add`
#### Request Body
__Data:__
- `item: ListItem`

### Response
Success or error message:
#### Status Code
- Success: `200`
- Malformed Request: `405`
- Unauthorized: `403`
#### Response Body
__Type:__
```TypeScript
{
  success: boolean,
  error?: string
}
```
__Example:__
```json
{
  "success": true 
}
```

```json
{
  "success": false,
  "error": "List not found"
}
```


## Delete List-Entry
### Request
#### Method
`DELETE`
#### URL
`/list/:listId/remove`
### Request Body
__Data:__
TODO

### Response
Success or error message:
#### Status Code
- Success: `200`
- Malformed Request: `405`
- Unauthorized: `403`
#### Response Body
__Type:__
```TypeScript
{
  success: boolean,
  error?: string
}
```
__Example:__
```json
{
  "success": true 
}
```

```json
{
  "success": false,
  "error": "List not found"
}
```

## Reorder List
TODO