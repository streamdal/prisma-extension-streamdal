import { PrismaClient } from "@prisma/client";
import { streamdal } from "../src";
import { OperationType, StreamdalConfigs } from "@streamdal/node-sdk";
import * as crypto from "crypto";

const streamdalConfigs: StreamdalConfigs = {
  streamdalUrl: "localhost:8082",
  streamdalToken: "1234",
  serviceName: "test-prisma-service",
  pipelineTimeout: "100",
  stepTimeout: "10",
  dryRun: false,
  quiet: true
};

const consumerAudience = {
  serviceName: "test-prisma-service",
  componentName: "prisma",
  operationType: OperationType.CONSUMER,
  operationName: "prisma-user",
};

const producerAudience = {
  serviceName: "test-prisma-service",
  componentName: "prisma",
  operationType: OperationType.PRODUCER,
  operationName: "prisma-user",
};

const prisma = new PrismaClient().$extends(streamdal(streamdalConfigs));

const create = async () => {
  const ipAddress = "192.0.2.146";
  console.log("inserting user with ipAddress unmasked", ipAddress)
  const result = await prisma.user.create({
    data: {
      email: `user.${crypto.randomUUID()}@streamdal.com`,
      ipAddress
    },
  });

  const user = await prisma.user.findFirst({ where: { id: result.id } });
  console.log("user with ipAddress after insert", user);
}

const createWithPipeline = async () => {
  const ipAddress = "192.0.2.146";
  console.log("inserting user with ipAddress masked", ipAddress)
  const result = await prisma.user.create({
    data: {
      email: `user.${crypto.randomUUID()}@streamdal.com`,
      ipAddress: ipAddress
    },
    streamdalAudience: producerAudience
  });

  const user = await prisma.user.findFirst({ where: { id: result.id } });
  console.log("user with ipAddress after insert", user);
}


const findMany = async () => {
  console.log("fetching all users without masking email");
  const users = await prisma.user.findMany();
  console.log("users", users);
}

const findManyWithPipeline = async () => {
  console.log("fetching all users and mask email");
  const users = await prisma.user.findMany({ streamdalAudience: consumerAudience });
  console.log("users", users);
}

const example = () => {
  setInterval(() => {
    console.log("-----------------------");
    // create();
    createWithPipeline();
    // findMany();
    // findManyWithPipeline();
    console.log("-----------------------");
  }, 2000);
}

example();
