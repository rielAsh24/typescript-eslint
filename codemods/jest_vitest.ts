export const parser = 'ts';

export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Imports for describe
  var importsRequired: string[] = [];

  // Replace jest.mock with vitest.mock
  const jestMock = root.find(j.MemberExpression, {
    object: {
      name: 'jest',
    },
  });

  // Add imports for vi identifier
  if (jestMock.length > 0) importsRequired.push('vi');

  // Replace jest.* with vi.* definitions
  root
    .find(j.MemberExpression, {
      object: {
        name: 'jest',
      },
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      node.object.name = 'vi';
      return node;
    });

  const describeImp = root.find(j.CallExpression, {
    callee: {
      name: 'describe',
    },
  });

  if (describeImp.length > 0) importsRequired.push('describe');

  // Imports for it
  const itImp = root.find(j.CallExpression, {
    callee: {
      name: 'it',
    },
  });

  if (itImp.length > 0) importsRequired.push('it');

  // Imports for expect
  const expectImp = root.find(j.CallExpression, {
    callee: {
      name: 'expect',
    },
  });

  if (expectImp.length > 0) importsRequired.push('expect');

  // Imports for beforeEach
  const beforeEachImp = root.find(j.CallExpression, {
    callee: {
      name: 'beforeEach',
    },
  });

  if (beforeEachImp.length > 0) importsRequired.push('beforeEach');

  // Imports for afterEach
  const afterEachImp = root.find(j.CallExpression, {
    callee: {
      name: 'afterEach',
    },
  });

  if (afterEachImp.length > 0) importsRequired.push('afterEach');

  // Add imports from imports list

  if (importsRequired.length > 0) {
    root
      .find(j.ImportDeclaration)
      .at(0)
      .insertBefore(
        j.importDeclaration(
          importsRequired.map(imp => j.importSpecifier(j.identifier(imp))),
          j.literal('vitest'),
        ),
      );
  }

  // Replace jest.requireActual with vi.importActual
  root
    .find(j.MemberExpression, {
      object: {
        name: 'vi',
      },
      property: {
        name: 'requireActual',
      },
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      node.property.name = 'importActual';
      return node;
    });

  console.log(fileInfo.path + ' is converted to vitest');
  return root.toSource({
    quote: 'single',
  });
};
