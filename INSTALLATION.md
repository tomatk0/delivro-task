npm install in the root of the project
npm install in the backend folder

download docker
create account

docker pull postgres:latest
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
make sure a postgres instance is running after this command

create an .env file in the backend/src folder with the following values:

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=mysecretpassword
PGDATABASE=postgres
PGPORT=5432

run the frontend in the root folder with npm run dev
run the backend in the backend/src folder with ts-node server.ts