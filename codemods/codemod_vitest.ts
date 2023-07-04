import fs from 'fs';

export default (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Add imports for viteConfig
  root
    .find(j.ExpressionStatement, {
      expression: {
        value: 'use strict',
      },
    })
    .replaceWith([
      j.importDeclaration(
        [j.importSpecifier(j.identifier('defineConfig'))],
        j.literal('vitest/config'),
      ),
      j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier('vitestConfigBase'))],
        j.literal('../../vitest.config.base'),
      ),
    ]);

  // Remove baseConfig variable declaration
  const ifbaseConfig = root.find(j.VariableDeclaration);
  if (ifbaseConfig.length > 0) ifbaseConfig.remove();

  // Replace module.exports with export default defineConfig
  root.find(j.AssignmentExpression).replaceWith(nodePath => {
    const node = j.exportDefaultDeclaration(
      j.callExpression(j.identifier('defineConfig'), [
        j.objectExpression([
          j.property('init', j.identifier('test'), nodePath.node.right),
        ]),
      ]),
    );
    return node;
  });

  // Replace BaseConfig Spread
  root
    .find(j.SpreadElement, {
      argument: {
        name: 'baseConfig',
      },
    })
    .replaceWith(nodePath => {
      return [
        j.spreadElement(
          j.memberExpression(
            j.identifier('vitestConfigBase'),
            j.identifier('test'),
          ),
        ),
        // j.property(
        //   'init',
        //   j.identifier('globals'),
        //   j.literal(true)
        // )
      ];
    });

  // Replace require baseConfig
  root
    .find(j.SpreadElement, {
      argument: {
        callee: {
          name: 'require',
        },
      },
    })
    .replaceWith(nodePath => {
      return [
        j.spreadElement(
          j.memberExpression(
            j.identifier('vitestConfigBase'),
            j.identifier('test'),
          ),
        ),
        // j.property(
        //   'init',
        //   j.identifier('globals'),
        //   j.literal(true)
        // )
      ];
    });

  // Replace Coverage Enabled
  root
    .find(j.Property, {
      key: {
        name: 'collectCoverage',
      },
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      return j.property(
        'init',
        j.identifier('coverage'),
        j.objectExpression([
          j.spreadElement(
            j.memberExpression(
              j.memberExpression(
                j.identifier('vitestConfigBase'),
                j.identifier('test'),
              ),
              j.identifier('coverage'),
            ),
          ),
          j.property(
            'init',
            j.identifier('enabled'),
            j.literal(node.value.value),
          ),
        ]),
      );
    });

  // Replace coveragePathIgnorePatterns with excludes
  root
    .find(j.Property, {
      key: {
        name: 'coveragePathIgnorePatterns',
      },
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      node.key.name = 'exclude';
      return node;
    });

  // Replace testRegex with includes
  const testRegexfind = root.find(j.Property, {
    key: {
      name: 'testRegex',
    },
  });

  if (testRegexfind.length > 0) {
    testRegexfind.replaceWith(nodePath => {
      const { node } = nodePath;
      if (Array.isArray(node.value.elements))
        return j.property('init', j.identifier('include'), node.value);
      else
        return j.property(
          'init',
          j.identifier('include'),
          j.arrayExpression([node.value]),
        );
    });
  }

  // Replace setupFilesAfterEnv
  root
    .find(j.Property, {
      key: {
        name: 'setupFilesAfterEnv',
      },
    })
    .replaceWith(nodePath => {
      const { node } = nodePath;
      node.key.name = 'setupFiles';
      const firstElement = j.spreadElement(
        j.memberExpression(
          j.memberExpression(
            j.identifier('vitestConfigBase'),
            j.identifier('test'),
          ),
          j.identifier('setupFiles'),
        ),
      );
      node.value.elements[0] = firstElement;
      return node;
    });

  // Write to ./**/vitest.config.ts
  fileInfo.path = fileInfo.path.replace('jest.config.js', 'vitest.config.ts');
  fs.writeFile(fileInfo.path, root.toSource({ quote: 'single' }), err => {
    if (err) console.log(err);
    else console.log(fileInfo.path + ' was saved!');
  });

  // fileInfo.path = fileInfo.path.replace(/\.js$/, '.ts');
  // return root.toSource({
  //   quote: 'single',
  //   trailingComma: false
  // });
};
