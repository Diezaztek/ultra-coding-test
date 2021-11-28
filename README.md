<br />
  <h1 align="center">Ultra coding test</h1>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This repository contains the technical challange for a backend position in Ultra.

### Features
* CRUD for Games
* Create a publisher
* Retrieve only publisher information via game API
* Task for deleting old games and disccounts in prices


### Built With

* [NestJS](https://nestjs.com)
* [PostgreSQL](https://www.postgresql.org)
* [Redis](https://redis.io)
* [Docker](https://www.docker.com)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

For running a local copy you need
* [Docker](https://docs.docker.com/engine/install/ubuntu/)

### Installation

1. Clone the repo
   ```sh
   git clone git@github.com:Diezaztek/ultra-coding-test.git
   ```
2. Create a copy of the variables
    ```sh
    cp .env.example .env
    ```
3. Build the docker compose
    ```sh
    docker compose build
    ```
4. Run the containers
    ```
    docker compose up
    ```
5. Enter http://localhost:3000/api


<!-- USAGE EXAMPLES -->
## Usage

For running the endpoints you can use tools such as [postman](https://www.postman.com). 

For testing the functionality you can try the following flow:
1. Create a publisher
2. Create a game
3. Update the game info
4. Get all the games
5. Get single game info
6. Get publisher for a given game info
7. Delete the game
8. Create a game with a releaseDate older than 18 months
9. Create a game with a releaseDate between 12 and 18 months old
10. Run the task for adjusting the games
11. Corroborate the info of the games listing them all again


**NOTE**

Do not forget the api version in the headers of your request (; If you feel lost take a look to the [swagger docs](https://localhost:3000/api)

```sh
curl --location --request GET 'localhost:3000/game' \
--header 'API-VERSION: 1'
```

---


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/Diezaztek/ultra-coding-test/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Francisco Torres - [@pacotorres3](https://www.linkedin.com/in/pacotorres3/) - paco.tcast@gmail.com

Project Link: [https://github.com/Diezaztek/ultra-coding-test](https://github.com/Diezaztek/ultra-coding-test)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)