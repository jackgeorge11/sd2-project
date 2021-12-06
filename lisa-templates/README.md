# MySQL, PHPMyAdmin and Node.js (ready for Express development)

This will install Mysql and phpmyadmin (including all dependencies to run Phpmyadmin) AND node.js

This receipe is for development - Node.js is run in nodemon mode: changes to files with suffixes specified in the nodemon.json file will trigger a rebuild automatically.

For security, this receipe uses a .env file for credentials.  A sample is provided in the env-sample file. If using these files for a fresh project, copy the env-sample file to a file called .env.  Do NOT commit the changed .env file into your new project for security reasons (in the node package its included in .gitignore so you can't anyway)

In node.js, use the MySQl2 packages (to avoid problems with MySQL8) and the dotenv package to read the environment variables.

Local files are mounted into the container using the 'volumes' directive in the docker-compose.yml for ease of development.

Summary: to start a new project:

0. Ensure Docker is installed (with Docker compose, but on Windows and Mac this is included with the main Docker packages)
1. Copy all the files (including hidden ones ie. those starting wtih a .) into a fresh directory
2. Copy the env-sample file to a file called .env  Change the credentials, and ensure NOT to commit this into your new project
3. Run the docker-compose configuration file:

```bash
docker-compose up -d
```

OR 

```bash
docker-compose up
```
to access the console in the shell

OR

```
docker-compose up --build
```

To rebuild the containers on startup.

4. Visit phphmyadmin at:

http://localhost:8081/

5. visit your express app at:

http://localhost:3000

____

Useful commands:

Get a shell in any of the containers

```bash
docker exec -it <container name> bash -l
```

Once in the database container, you can get a MySQL CLI in the usual way

```bash
mysql -uroot -p<password> 
```
