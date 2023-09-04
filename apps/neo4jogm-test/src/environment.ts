/*
 * Copyright: Infosim GmbH & Co. KG Copyright (c) 2000-2023
 * Company: Infosim GmbH & Co. KG,
 *                  Landsteinerstraße 4,
 *                  97074 Wuerzburg, Germany
 *                  www.infosim.net
 */

export const environment = {
  neo4j: {
    password: process.env.NEO_PASSWORD || 'password',
    url: process.env.NEO_URL || 'TODO SET URL',
    user: process.env.NEO_USER || 'neo4j',
  },
  production: false,
  port: Number(process.env.HTTP_PORT || 3333),
};
