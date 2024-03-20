import {
  Audience,
  OperationType,
  SDKResponse,
  Streamdal,
  StreamdalConfigs,
  StreamdalRegistration,
} from "@streamdal/node-sdk";
import { Prisma } from "@prisma/client/extension";

export { Audience, OperationType, StreamdalConfigs };

export type StreamdalArgs = {
  streamdalAudience?: Audience;
};

type StreamdalType = {
  configs: StreamdalConfigs & {
    abortOnError?: boolean;
    disableAutomaticPipelines?: boolean;
  };
  registration: StreamdalRegistration;
};

const register = (
  streamdalConfigs?: StreamdalConfigs,
): StreamdalType | null => {
  if (streamdalConfigs) {
    return {
      configs: streamdalConfigs,
      registration: new Streamdal(streamdalConfigs),
    };
  }

  if (
    process.env.STREAMDAL_URL &&
    process.env.STREAMDAL_TOKEN &&
    process.env.STREAMDAL_SERVICE_NAME
  ) {
    return {
      registration: new Streamdal({
        streamdalUrl: process.env.STREAMDAL_URL,
        streamdalToken: process.env.STREAMDAL_TOKEN,
        serviceName: process.env.STREAMDAL_SERVICE_NAME,
      }),
      configs: {
        streamdalUrl: process.env.STREAMDAL_URL,
        streamdalToken: process.env.STREAMDAL_TOKEN,
        serviceName: process.env.STREAMDAL_SERVICE_NAME,
        abortOnError: !!process.env.STREAMDAL_ABORT_ON_ERROR,
        disableAutomaticPipelines:
          !!process.env.STREAMDAL_DISABLE_AUTOMATIC_PIPELINES,
      },
    };
  }

  return null;
};

export const streamdalExtension = (streamdalConfigs?: StreamdalConfigs) => {
  const streamdal: StreamdalType | null = register(streamdalConfigs);
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const processPipeline = async (data: any, audience: Audience) => {
    if (!streamdal || !streamdal.registration) {
      console.debug(
        "Streamdal is not configured and registered, skipping process pipeline",
      );
      return data;
    }

    const streamdalResult: SDKResponse = await streamdal.registration.process({
      audience,
      data: encoder.encode(JSON.stringify(data)),
    });

    return JSON.parse(decoder.decode(streamdalResult.data));
  };

  return Prisma.defineExtension({
    name: "prisma-extension-streamdal",
    model: {
      $allModels: {
        async create<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "create">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "create">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          const data = await processPipeline(
            rest.data,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `create-${ctx.$name}`,
            },
          );
          return (ctx as any).$parent[ctx.$name as any].create({
            ...rest,
            data,
          });
        },
        async findFirst<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "findFirst">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "findFirst">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};

          const ctx = Prisma.getExtensionContext(this);
          const result = await (ctx as any).$parent[ctx.$name as any].findFirst(
            rest,
          );

          return processPipeline(
            result,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `findFirst-${ctx.$name}`,
            },
          );
        },
        async findFirstOrThrow<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "findFirstOrThrow">> &
            StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "findFirstOrThrow">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};

          const ctx = Prisma.getExtensionContext(this);
          const result = await (ctx as any).$parent[
            ctx.$name as any
          ].findFirstOrThrow(rest);

          return processPipeline(
            result,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `findFirstOrThrow-${ctx.$name}`,
            },
          );
        },
        async findMany<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "findMany">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "findMany">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};

          const ctx = Prisma.getExtensionContext(this);
          const result = await (ctx as any).$parent[ctx.$name as any].findMany(
            rest,
          );

          //
          // TODO: lift and remove n+1 processing
          const mappedResults = await Promise.all(
            result.map(async (data: any) =>
              processPipeline(
                data,
                streamdalAudience ?? {
                  serviceName: streamdal?.configs.serviceName,
                  componentName: "prisma-db",
                  operationType: OperationType.PRODUCER,
                  operationName: `findMany-${ctx.$name}`,
                },
              ),
            ),
          );
          return mappedResults as Prisma.Result<T, A, "findMany">;
        },
        async findUnique<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "findUnique">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "findUnique">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};

          const ctx = Prisma.getExtensionContext(this);
          const result = await (ctx as any).$parent[
            ctx.$name as any
          ].findUnique(rest);

          return processPipeline(
            result,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `findUnique-${ctx.$name}`,
            },
          );
        },
        async findUniqueOrThrow<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "findUniqueOrThrow">> &
            StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "findUniqueOrThrow">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};

          const ctx = Prisma.getExtensionContext(this);
          const result = await (ctx as any).$parent[
            ctx.$name as any
          ].findUniqueOrThrow(rest);

          return processPipeline(
            result,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `findUniqueOrThrow-${ctx.$name}`,
            },
          );
        },
        async update<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "update">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "update">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          const data = await processPipeline(
            rest.data,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `update-${ctx.$name}`,
            },
          );
          return (ctx as any).$parent[ctx.$name as any].update({
            ...rest,
            data,
          });
        },
        async updateMany<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "updateMany">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "updateMany">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          //
          // TODO: lift and remove n+1 processing
          const updateManyPayload = await Promise.all(
            rest.map(async (data: any) =>
              processPipeline(
                data,
                streamdalAudience ?? {
                  serviceName: streamdal?.configs.serviceName,
                  componentName: "prisma-db",
                  operationType: OperationType.PRODUCER,
                  operationName: `updateMany-${ctx.$name}`,
                },
              ),
            ),
          );

          return (ctx as any).$parent[ctx.$name as any].updateMany(
            updateManyPayload,
          );
        },
        async upsert<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "upsert">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "upsert">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          const data = await processPipeline(
            rest.data,
            streamdalAudience ?? {
              serviceName: streamdal?.configs.serviceName,
              componentName: "prisma-db",
              operationType: OperationType.PRODUCER,
              operationName: `upsert-${ctx.$name}`,
            },
          );

          return (ctx as any).$parent[ctx.$name as any].upsert(data);
        },
      },
    },
  });
};
