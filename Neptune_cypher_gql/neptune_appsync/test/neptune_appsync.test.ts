import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as NeptuneAppsync from '../lib/neptune_appsync-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new NeptuneAppsync.NeptuneAppsyncStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
