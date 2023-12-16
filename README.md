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

Install the Streamdal console and server to manage your pipelines 
and send your pipeline rules into the Prisma Streamdal extension:
https://github.com/streamdal/streamdal?tab=readme-ov-file#getting-started


### Install
```
npm install @streamdal/prisma-extension-streamdal
```

### Setup
Add the extension to your existing Prisma connection, pass it the necessary configs.

```typescript
const streamdalConfigs: StreamdalConfigs = {
  streamdalUrl: "localhost:8082",
  streamdalToken: "1234",
  serviceName: "test-prisma-service",
  pipelineTimeout: "100",
  stepTimeout: "10",
  dryRun: false,
  quiet: true
};

const prisma = new PrismaClient().$extends(streamdal(streamdalConfigs));
```

### Use
Pass a Streamdal Audience to any Prisma operation you want to run pipeline rules on. You 
create pipeline rules and attach them to operations in the Streamdal console.

The following assumes you've set up a pipeline in the console to detect and mask
an ipaddress that you've attached this operation. See below for a screenshot of the 
console.

```typescript
const consumerAudience = {
  serviceName: "test-prisma-service",
  componentName: "prisma",
  operationType: OperationType.PRODUCER,
  operationName: "prisma-user",
};

const createWithPipeline = async () => {
  const result = await prisma.user.create({
    data: {
      email: `user.${crypto.randomUUID()}@streamdal.com`,
      ipAddress: "192.0.2.146"
    },
    streamdalAudience: producerAudience
  });

  const user = await prisma.user.findFirst({ where: { id: result.id } });
  console.log("user with ipAddress after insert", user);
}

```
That will output:
```json
{
    id: 57,
    email: 'user.6cae5579-6ec2-4f8e-9ebc-e3335b7e90cd@streamdal.com',
    name: null,
    ipAddress: '19*********'
}
```

Streamdal pipelines can be used on teh following Prisma operations:

```
create
findFirst
findFirstOrThrow
findMany
findUnique
findUniqueOrThrow
update
updateMany
```





