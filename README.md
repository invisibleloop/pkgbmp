# pkgbmp

[![npm version](https://badge.fury.io/js/pkgbmp.svg)](https://badge.fury.io/js/pkgbmp)

`pkgbmp` is a command-line tool that helps you check your `package.json` files for outdated packages and bump them up. With `pkgbmp`, you can easily update your dependencies and devDependencies to the latest versions, without having to manually edit your `package.json` file.

## Installation

You can install `pkgbmp` using npm:

```bash
npm install -g pkgbmp
```

This will install `pkgbmp` globally, so you can use it from any directory.

## Usage

To use `pkgbmp`, simply run the `pkgbmp` command in your project directory:

```bash
pkgbmp
```

This will check your `package.json` file for outdated packages and display a table of the packages that need to be updated. You can then select which packages you want to update, and `pkgbmp` will automatically update your `package.json` file with the latest versions.

### Interactive mode

You can use the `-i` or `--interactive` option to enable interactive mode, which lets you select which packages to update using a user-friendly prompt:

```bash
pkgbmp -i
```

### Filter mode

You can use the `-f` or `--filter` option to enable filter mode, which lets you update only the packages that include a specific string in their names. This can be useful if you want to update only a subset of packages, based on their names:

```bash
pkgbmp -f axios
```

This will update only the packages whose names include the string "axios".

### Recursive mode

By default, `pkgbmp` only checks the dependencies in your `package.json` file. However, you can use the `-r` or `--recursive` option to enable recursive mode, which lets you check the dependencies in all subdirectories of your project:

```bash
pkgbmp -r
```

This will check the dependencies in all subdirectories of your project and display a table of the packages that need to be updated. You can then select which packages you want to update, and `pkgbmp` will automatically update your `package.json` files with the latest versions.

Note that recursive mode only works if your subdirectories also have `package.json` files. If a subdirectory does not have a `package.json` file, it will be skipped.

## Contributing

If you encounter any issues or have suggestions for improvement, please feel free to [open an issue](https://github.com/invisibleloop/pkgbmp/issues) or submit a pull request. We welcome contributions of all kinds, from bug reports to code improvements to documentation updates.

Before contributing, please read our [contribution guidelines](https://github.com/invisibleloop/pkgbmp/blob/main/CONTRIBUTING.md) to ensure that your contributions are in line with our goals and expectations.

## License

`pkgbmp` is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html). See the [LICENSE](https://github.com/your-username/pkgbmp/blob/main/LICENSE) file for more details.
