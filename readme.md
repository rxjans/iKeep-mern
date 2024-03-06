# iKeep
## Description
iKeep is an elegant and feature-rich blogging platform under active development. Crafted with the latest web technologies including React, Redux Toolkit, and JWT authentication, iKeep offers a seamless and secure user experience. Leveraging MongoDB as its database solution, iKeep ensures efficient data management and scalability.

## Features
- Blogging Platform: Seamlessly create and manage blog posts.
- User Authentication: Secure user authentication mechanism using JWT.
- OAuth Integration: Effortlessly sign in with OAuth for streamlined access.
- React-Based Frontend: Modern and dynamic user interface powered by React.
- Redux Toolkit: Efficient state management with Redux Toolkit.
- MongoDB Database: Utilizes MongoDB for robust and scalable data storage.

## Installation
- Clone the repository:
- git clone https://github.com/rxjans/iKeep-mern

## Install dependencies:

- npm install

# .env file config
To make sure the application runs on your platform
- add .env file to root and client dir
- add MONGO_URI = "your mongodb"
- add JWT_SECRET = "keyword_for_encryption"

# FIREBASE AUTHORIZATION
By default the auth key will fail for authentication, so you need to setup your own firebase storage and authentication. You need to setup the SDK and configuration, head over to /client/src/firebase.js and replace the config with your firebase's config.

## Usage
Start the development server:
- npm run dev (root directory) - starts server
-npm run dev (/client) - starts client

Visit http://localhost:5173 in your preferred web browser to access the iKeep website.

## Contributing
We welcome contributions to enhance the iKeep project! Follow these steps to contribute:

- Fork the repository.
- Create a new branch (git checkout -b develop/my-name/feature).
- Implement your changes.
- Commit your changes (git commit -am 'Add new feature').
- Push to the branch (git push origin develop/my-feature).
- Create a new Pull Request.
