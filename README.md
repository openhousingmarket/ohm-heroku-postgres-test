ohm-heroku-postgres-test
========================

A simple example showing how to interact with a postgresql instance running on heroku.

Getting started
---------------

You'll need to set up a .env file to tell the code how to talk to your database.
You can copy .env.example to get started. You'll need to find the "URI" of your
database from heroku, which you can get by going to https://data.heroku.com/,
choosing your database, clicking "View Credentials" and copying the URI from the table.

Your .env file should look like:

```
DATABASE_URL=postgres://username:password@hostname:port/database
```

Running the code
----------------

Run

```
node index.js
```

