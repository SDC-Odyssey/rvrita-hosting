## SDC Project: AirBnB Product detail clone page backend

> Host profile service built based on MERN stack.

<img width="917" alt="SDC AirBnB Host Page" src="https://user-images.githubusercontent.com/3691141/105929511-9c15be00-5ffc-11eb-8712-ad9dde1711b2.png">

Runs the app in development mode.

Open [http://localhost:3006/?id](http://localhost:3006/?id) to view it in the browser.

---

### Related Projects

* https://github.com/FEC-Gai/images-service
* https://github.com/FEC-Gai/Check-In-Service
* https://github.com/FEC-Gai/HomeDescriptionService
* https://github.com/FEC-Gai/header-footer

<img width="872" alt="AirBnB" src="https://user-images.githubusercontent.com/3691141/105929517-9e781800-5ffc-11eb-9be1-d3deda20e7e8.png">

---

### Installation

Requires Node 12.13.1^ & npm 6.12.1^ to run.

• Clone the repo
```
 $ git clone https://github.com/FEC-Gai/HostProfileService.git
```
• From within the root directory run,
```
 $ npm install
```
---

### Local development

First seed the db using,
```
$ npm run seed
```

To run  the server,
```
$ npm start
```

To build the client,
```
$ npm run build

or

$ npm run dev:build
```

To run the tests,
```
$ npm test
```

### Notes

Before seeding,
* If using mongo atlas, make sure the mongoUri in server/db/index.js is pointing to respective server with credentials updated in config file.



## API Endpoints

### Get all resources

```
GET /hostInfo
```
Response:
```
[
  {
    "host_verifications": [
      "Hilton_Ruecker@gmail.com",
      "235-976-7747 x7590",
      "0933"
    ],
    "host_languages": [
      "Tamil",
      "German"
    ],
    "host_url": "http://localhost:3006/users/show/2",
    "host_name": "Jermey",
    "cohost_name": "",
    "host_about": "Recusandae facere nam. Voluptatem et tempore nostrum. Architecto sed magni.",
    "host_messages": "Libero perferendis corrupti quae cumque veniam et.",
    "host_identity_verified": false,
    "host_is_superHost": true,
    "host_has_profile_pic": true,
    "host_has_coHost": false,
    "host_response_time": 99,
    "host_listings_count": 3,
    "createdAt": "2020-10-02T02:01:07.814Z",
    "updatedAt": "2020-10-02T02:01:07.814Z",
    "id": 2
    }, ...
]
```

### Get one resource

```
GET /hostInfo/:hostId
```
Request Params: ```:id``` - id of host

Response:
```
[
  {
    "host_verifications": [
      "Hilton_Ruecker@gmail.com",
      "235-976-7747 x7590",
      "0933"
    ],
    "host_languages": [
      "Tamil",
      "German"
    ],
    "host_url": "http://localhost:3006/users/show/2",
    "host_name": "Jermey",
    "cohost_name": "",
    "host_about": "Recusandae facere nam. Voluptatem et tempore nostrum. Architecto sed magni.",
    "host_messages": "Libero perferendis corrupti quae cumque veniam et.",
    "host_identity_verified": false,
    "host_is_superHost": true,
    "host_has_profile_pic": true,
    "host_has_coHost": false,
    "host_response_time": 99,
    "host_listings_count": 3,
    "createdAt": "2020-10-02T02:01:07.814Z",
    "updatedAt": "2020-10-02T02:01:07.814Z",
    "id": 2
    }
]
```

### Create one resource

```
POST /hostInfo
```
Request Body: 
``` 
{
  "_id": 103,
  "host_url": "http://lorem.ipsum",
  "host_name": "Jessie",
  "cohost_name": "",
  "host_about": "Recusandae facere nam. Voluptatem et tempore nostrum.",
  "host_messages": "Rrchitecto sed magni solut",
  "host_identity_verified": false,
  "host_is_superHost": false,
  "host_has_profile_pic": false,
  "host_has_coHost": false,
  "host_response_time": 75,
  "host_listings_count": 4,
  "host_verifications": "",
  "host_languages": "English"
} 
```

Response:
```
200 - Successfully created new host
```

### Update one resource

```
PUT /hostInfo/:hostId
```
Request Params: ``` :id ``` - id of host to update

Request Body - with fields to update: 
```
{
  "host_name": "John Doe" 
}
```

Response:
```
{
  "message": "Host updated successfully!"
}
```

### Delete one resource

```
DELETE /hostInfo/:hostId
```
Request Params: ``` :id ``` - id of host to delete

Response:
```
{
  "message": "Host was deleted successfully!"
}
```
