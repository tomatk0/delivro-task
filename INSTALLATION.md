npm install in the root of the project
npm install in the backend folder

download docker
create account

docker pull postgres:latest
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

create an .env file in the backend folder with these values

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=mysecretpassword
PGDATABASE=postgres
PGPORT=5432

