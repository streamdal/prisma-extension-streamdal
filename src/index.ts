import { Prisma } from "@prisma/client/extension";
import {
  Audience,
  OperationType,
  SDKResponse,
  Streamdal,
  StreamdalConfigs,
} from "@streamdal/node-sdk";

export { Audience, OperationType, StreamdalConfigs };

export type StreamdalArgs = {
  streamdalAudience?: Audience;
};

export const streamdal = (streamdalConfigs: StreamdalConfigs) => {
  const streamdal = new Streamdal(streamdalConfigs);
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

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

          if (streamdalAudience) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(rest.data)),
            });
            const data = decoder.decode(streamdalResult.data);
            return (ctx as any).$parent[ctx.$name as any].create({
              data: JSON.parse(data),
            });
          }

          return (ctx as any).$parent[ctx.$name as any].create(rest);
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

          if (streamdalAudience && result) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(result)),
            });
            return JSON.parse(decoder.decode(streamdalResult.data));
          }
          return result;
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

          if (streamdalAudience && result) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(result)),
            });
            return JSON.parse(decoder.decode(streamdalResult.data));
          }
          return result;
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

          if (streamdalAudience && result) {
            const mappedResults = await Promise.all(
              result.map(async (r: any) => {
                const streamdalResult: SDKResponse = await streamdal.process({
                  audience: streamdalAudience,
                  data: encoder.encode(JSON.stringify(r)),
                });
                return JSON.parse(decoder.decode(streamdalResult.data));
              }),
            );
            return mappedResults as Prisma.Result<T, A, "findMany">;
          }

          return result;
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

          if (streamdalAudience && result) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(result)),
            });
            return JSON.parse(
              decoder.decode(streamdalResult.data),
            ) as Prisma.Result<T, A, "findUnique">;
          }
          return result;
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

          if (streamdalAudience && result) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(result)),
            });
            return JSON.parse(
              decoder.decode(streamdalResult.data),
            ) as Prisma.Result<T, A, "findUniqueOrThrow">;
          }
          return result;
        },
        async update<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "update">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "update">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          if (streamdalAudience) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(rest)),
            });
            const data = decoder.decode(streamdalResult.data);
            return (ctx as any).$parent[ctx.$name as any].update({
              data: JSON.parse(data),
            });
          }

          return (ctx as any).$parent[ctx.$name as any].update(rest);
        },
        async updateMany<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, "updateMany">> & StreamdalArgs,
        ): Promise<Prisma.Result<T, A, "updateMany">> {
          const { streamdalAudience, ...rest }: any & StreamdalArgs =
            args || {};
          const ctx = Prisma.getExtensionContext(this);

          let updateManyPayload = rest;
          console.log("shit update many payload", updateManyPayload);

          if (streamdalAudience && updateManyPayload) {
            updateManyPayload = await Promise.all(
              updateManyPayload.map(async (r: any) => {
                const streamdalResult: SDKResponse = await streamdal.process({
                  audience: streamdalAudience,
                  data: encoder.encode(JSON.stringify(r)),
                });
                return JSON.parse(decoder.decode(streamdalResult.data));
              }),
            );
          }

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

          if (streamdalAudience) {
            const streamdalResult: SDKResponse = await streamdal.process({
              audience: streamdalAudience,
              data: encoder.encode(JSON.stringify(rest)),
            });
            const data = decoder.decode(streamdalResult.data);
            return (ctx as any).$parent[ctx.$name as any].upsert({
              data: JSON.parse(data),
            });
          }

          return (ctx as any).$parent[ctx.$name as any].upsert(rest);
        },
      },
    },
  });
};
