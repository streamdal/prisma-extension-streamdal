<div align="center">

<img src="./assets/streamdal-logo-dark.png#gh-dark-mode-only"><img src="./assets/streamdal-logo-light.png#gh-light-mode-only">

[![GitHub](https://img.shields.io/github/license/streamdal/prisma-extension-streamdal)](https://github.com/streamdal/prisma-extension-streamdal)
[![Discord](https://img.shields.io/badge/Community-Discord-4c57e8.svg)](https://discord.gg/streamdal)

</div>  

# Streamdal Prisma Client Extension 

### Code native data pipelines for Prisma query operations

Use Streamdal's code native data pipelines to observe, transform,
and secure data before it enters or exists the database. 

Read more about Streamdal here: [Streamdal](https://www.streadmdal.com).
Read more about Prisma client extensions here: [Prisma docs](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions).

### Prerequisites

You must have the Streamdal platform running. To bring it up locally, you can use docker compose:

`docker compose up`

Alternatively you can deploy it to your environment, see here for details:
```
https://github.com/streamdal/streamdal/tree/main/docs/install
```


### Install
```
npm install @streamdal/prisma-extension-streamdal
```

### Configure

You can configure the extension via env variables or code. The configuration
variables you provide will point to the Streamdal platform you ran just above.

If your app supports `.env` files, add the following there:

```
STREAMDAL_URL="localhost:8082"
STREAMDAL_TOKEN="1234"
STREAMDAL_SERVICE_NAME="prisma-user-service"
STREAMDAL_QUIET=true
```

Or export them:

```
export STREAMDAL_URL="localhost:8082"
export STREAMDAL_TOKEN="1234"
export STREAMDAL_SERVICE_NAME="prisma-user-service"
```

Or via code: see and uncomment configuration code in the example app:

```
https://github.com/streamdal/streamdal-eamples/blob/main/prisma-extension/index.ts
```

Run your app as normal and all your Prisma operations will be mapped by 
Streamdal automatically and you can view them and pipelines to them 
in the Streamdal console at `http://localhost:8080` or wherever
you installed it in the install step above.


##### Run the Example App

Clone the examples repository:

```shell
git clone git@github.com:streamdal/streamdal-examples.git
```

```shell
cd streamdal/examples/prisma-extension
npm install
npx prisma db push
npm run dev
```

This will fire up the example app running the Streamdal Prisma Extension that inserts and fetches
random users continuously. 

Go to `http://localhost:8080` and you will see the above operations were automatically 
instrumented and you are now able to create and add pipelines to them.

![Console](./console-screenshot.png)




