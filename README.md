# install-fonts

A Node.js utility to install fonts.

## Supported platform

- Windows
- Linux
- OSX

## Usage

```javascript
const installFonts = require("install-fonts");

installFonts({
  scope: "system",
  dirs: "/path/to/fonts",
});
```

## Options

### `scope`

- `system`: install fonts for all users on the system
- `user`: install fonts for current user

Defaults to `user`.

### `files`: string | string[]

Install specified font files.

### `dirs`: string | string[]

Install all font files under the specified directories.

### `recurseDirs`: string | string[]

Install all font files under the specified directories and their sub directories.
