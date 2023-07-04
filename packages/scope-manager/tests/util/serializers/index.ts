import { expect, beforeEach } from 'vitest';
// import { addSerializer } from 'jest-specific-snapshot';

import { resetIds } from '../../../src/ID';
import * as DefinitionBase from './DefinitionBase';
import * as Reference from './Reference';
import * as ScopeBase from './ScopeBase';
import * as ScopeManager from './ScopeManager';
import * as TSESTreeNode from './TSESTreeNode';
import * as Variable from './Variable';

const serializers = [
  DefinitionBase.serializer,
  Reference.serializer,
  ScopeBase.serializer,
  ScopeManager.serializer,
  TSESTreeNode.serializer,
  Variable.serializer,
  Variable.implicitLibVarSerializer,
];

for (const serializer of serializers) {
  // the jest types are wrong here
  expect.addSnapshotSerializer(serializer);
}

// make sure the snapshots are isolated from one another
beforeEach(() => {
  resetIds();
});
