import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NeptuneCypherGql from '../lib/neptune_cypher_gql-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NeptuneCypherGql.NeptuneCypherGqlStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
