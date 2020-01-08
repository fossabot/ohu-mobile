import * as path from 'path';
import moduleResolve from 'resolve';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as babel from '@babel/core';
import chalk from 'chalk';
import ora from 'ora';
import * as sass from 'node-sass';
import generateScss from './generate-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import * as yargs from 'yargs';
import variables from '../src/_styles/variables';
import * as componentVariables from '../src/_styles/component.variables';

const MATCH_SASS_FILENAME_RE = /\.sass$/;
const MATCH_NODE_MODULE_RE = /^~([a-z0-9]|@).+/i;

function errorLog(...args: any[]) {
  console.log(chalk.redBright(...args));
}

async function compileES(
  file: string,
  babelConfig: string,
) {
  try {
    const result = await babel.transformFileAsync(file, {
      configFile: babelConfig,
      sourceMaps: true,
    });
    if (!result) {
      return;
    }
    return result;
  } catch (error) {
    console.log(chalk.redBright(error));
  }
}

interface CompileScriptOptions {
  // compilerOptions: ts.CompilerOptions;
  babelConfig: string;
  inputPath: string;
  outputPath: string;
}

// compile esnext to es5
async function compileScripts(
  files: string[],
  {
    babelConfig,
  }: CompileScriptOptions,
) {
  const tasks = files.map((file) => {
    return compileES(file, babelConfig)
      .then(async (result) => {
        if (!result) return;
        let { code, map } = result;
        const { dir, name } = path.parse(file);
        if (!await fs.pathExists(dir)) {
          await fs.mkdirp(dir);
        }
        await fs.remove(file);
        const filename = name + '.js';
        if (code) {
          code = code.replace(/(require\(["'].*\.)scss(["']\))/g, (_, m1, m2) => {
            return m1 + 'css' + m2;
          });
          await fs.writeFile(path.join(dir, filename), code);
        }
        if (map) {
          await fs.writeFile(path.join(dir, filename + '.map'), JSON.stringify(map));
        }
      });
  });
  await Promise.all(tasks);
}

// using postcss and sass to compile

function usePostcss(css: string, cssPath: string, useRem = false): Promise<postcss.Result> {
  return new Promise(async (resolve) => {
    const plugins = [
      autoprefixer,
    ];
    if (useRem) {
      plugins.push(
        require('postcss-pxtorem')({
          rootValue: 75,
          propList: ['*', '!border'],
          minPixelValue: 2,
        }),
      );
    }
    postcss(plugins).process(css, { from: cssPath, to: cssPath }).then((result) => {
      resolve(result);
    });
  });
}

function compileSass(file: string): Promise<sass.Result> {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(file);
    sass.render({
      file,
      includePaths: [ 'src/_styles', 'node_modules' ],
      indentedSyntax: MATCH_SASS_FILENAME_RE.test(file),
      data: `${generateScss(variables)}
        ${generateScss(componentVariables)}
        @import "mixins";
        ${fileContent}`,
      sourceMap: true,
      importer: [
        (url, importer, done) => {
          if (!MATCH_NODE_MODULE_RE.test(url)) {
            return null;
          }
          const moduleUrl = url.slice(1);
          const resolveOptions = {
            basedir: path.dirname(importer),
            extensions: ['.scss', '.sass'],
          };

          try {
            done({
              file: moduleResolve.sync(moduleUrl, resolveOptions),
            });
          } catch (err) {
            done({
              file: url,
            });
          }
        },
      ],
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

async function compileStyle(file: string) {
  const sassResult = await compileSass(file);
  return {
    code: sassResult.css,
    map: sassResult.map,
  };
}


async function compileStyles(
  files: string[],
  { inputPath, outputPath, useRem }: {
    inputPath: string;
    outputPath: string;
    useRem?: boolean;
  }) {
  const tasks = files.map((file) => {
    const relativePath = path.relative(inputPath, file);
    const cssPath = path.join(outputPath, relativePath).replace('.scss', '.css');
    spinner.text = 'sass proccessing | 正在转换sass';
    return compileStyle(file)
      .then(async ({ code }) => {
        const { dir } = path.parse(cssPath);
        if (!await fs.pathExists(dir)) {
          await fs.mkdirp(dir);
        }
        await fs.writeFile(cssPath, code.toString());
        spinner.text = 'sass processing succeed, transfer to postcss | sass转换成功，转入postcss处理';
        return cssPath;
      }).then(async (cssPath: string) => {
        const css = await fs.readFile(cssPath, { encoding: 'utf8' });
        const result = await usePostcss(css, cssPath, useRem);
        await fs.writeFile(cssPath, result.css);
        spinner.text = 'postcss proccessing succced!';
      });
  });
  await Promise.all(tasks);
}

interface BuildLibOptions {
  target: string;
  outputDir: string;
  babelConfig: string;
  useRem?: boolean;
  // tsconfig: string;
  // files: string;
}

function transformPath(p: string) {
  if (!path.isAbsolute(p)) {
    return path.join(process.cwd(), p);
  }
  return p;
}

async function main(options: BuildLibOptions) {
  const inputPath = transformPath(options.target);
  const outputPath = transformPath(options.outputDir);
  const babelConfig = transformPath(options.babelConfig);
  const allJsFilePath = path.join(outputPath, '**/*.+(js|jsx)');
  const allStyleFilePath = path.join(inputPath, '**/!(global|mixins).+(sass|scss)');
  const scriptFiles = glob.sync(allJsFilePath);
  spinner.start('start to compile scripts | 开始编译脚本');
  try {
    await compileScripts(scriptFiles, { babelConfig, inputPath, outputPath });
  } catch (error) {
    spinner.fail(error);
  }
  spinner.succeed('script compiled! | 脚本编译成功');
  spinner.start('start to compile scss | 开始编译scss');
  const styleFiles = glob.sync(allStyleFilePath);
  try {
    await compileStyles(styleFiles, { inputPath, outputPath, useRem: options.useRem });
  } catch (error) {
    spinner.fail(error);
  }
  spinner.succeed('scss compiled! | scss编译成功');
  spinner.succeed('compiled success! | 全部编译成功');
  spinner.clear();
}


const options = yargs
  .scriptName('build-lib')
  .options({
    target: {
      alias: 't',
      type: 'string',
      description: 'files to be compiled|待编译的目录',
    },
    // files: {
    //   type: 'string',
    //   description: 'typing files | 其他包含在内的编译文件',
    // },
    outputDir: {
      alias: 'o',
      type: 'string',
      description: 'output directory|输出文件夹',
    },
    babelConfig: {
      alias: 'b',
      type: 'string',
      description: 'babel config file path|babel的配置文件路径',
    },
    useRem: {
      type: 'boolean',
      description: 'using rem?（default is false） | 是否使用rem（默认不使用）'
    },
    // tsconfig: {
    //   alias: 'p',
    //   type: 'string',
    //   description: 'typescript config file path|typescript的配置文件路径',
    // },
  }).help().argv;

const spinner = ora('start compile | 开始编译').start();
main(options as BuildLibOptions);
