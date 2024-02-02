# openinapp_todo_assignment
## Start server command
- Type $ "npm start" to start server
## Server will be running with the following base url
- The API will be available at http://localhost:3001

## Environment variables required
MONGODB_URL=
MONGO_DB=
JWT_SECRET_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
### Import the postman collection with the postman json file
- Register a user with /register endpoint
- Login with the registered user to get refresh and access tokens
- Start to create task and subtasks with  a POST request to api/task and api/sub-task endpoint
- Get task and sub task with a GET request to api/task and api/sub-task endpoint
- Update a task or a sub task with a PUT request to api/task or api/sub-task endpoint
- Delete a task or a sub-task with a delete request to api/task or api/sub-task endpoint
