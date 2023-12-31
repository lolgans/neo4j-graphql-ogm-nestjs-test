/*
 * Copyright: Infosim GmbH & Co. KG Copyright (c) 2000-2023
 * Company: Infosim GmbH & Co. KG,
 *                  Landsteinerstraße 4,
 *                  97074 Wuerzburg, Germany
 *                  www.infosim.net
 */

import { Logger, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { environment } from './environment';
import { Neo4jGraphQL } from '@neo4j/graphql';
import * as neo4j from 'neo4j-driver';
import { Driver } from 'neo4j-driver';
import { GraphQLSchema } from 'graphql';
import { generate, OGM } from '@neo4j/graphql-ogm';
import path from 'path';
import { gql } from "graphql-tag";

export interface Context {
  driver: Driver;
  req: any;
  token: any;
}

export const driver = neo4j.driver(
  environment.neo4j.url,
  neo4j.auth.basic(environment.neo4j.user, environment.neo4j.password),
  { disableLosslessIntegers: true }
);

const typeDefs = [
  gql`
  type Pass
    @query(read: true, aggregate: false)
  {
    id: ID! @id
    hashId: ID! @unique @populatedBy(callback: "hashId", operations: [CREATE]) # on create set the hashId randomly
  }
`,
];

export const ogm = new OGM<any>({ typeDefs, driver: driver });

export const neo4jGqlProviderFactory = async () => {
  const neoSchema: Neo4jGraphQL = new Neo4jGraphQL({
    typeDefs,
    resolvers: {},
    driver,
    features: {
      // @populatedBy directive callbacks below
      populatedBy: {
        callbacks: {
          hashId: (_parent: any, _args: any, context: any) =>
            context?.authorization?.jwt?.sub,
        },
      },
    },
  });

  const schema: GraphQLSchema = await neoSchema.getSchema();

  // await generateTypesFromGQLSchema(); // TODO this throws the error
  // await ogm.init(); // TODO this throws the error as well

  // remove old Neo4j constraints
  const session = driver.session();
  await session.run('CALL apoc.schema.assert({}, {})');

  // create Neo4j constraints like @unique [NOTE: req. a driver in neoSchema]
  await neoSchema.assertIndexesAndConstraints({
    options: { create: true },
  });

  return {
    playground: true,
    schema,
    context: ({ req }: any) =>
      ({ driver, req, token: req.headers.authorization } as Context),
  };
};

async function generateTypesFromGQLSchema(): Promise<void> {
  const outFile = path.join(__dirname, 'autogenerated.graphql.schema.ts');
  await generate({ ogm, outFile });
}

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: neo4jGqlProviderFactory,
    }),
  ]
})
export class AppModule {}
