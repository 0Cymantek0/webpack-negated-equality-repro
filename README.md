# webpack negated equality reproduction

This tests webpack's default production minifier at commit
`d9165100217b0038c0d1dae6c38223fee66d54eb`.
The published `webpack@5.113.0` does not reproduce this input.

## Run

Requires Node.js 18 or newer, Yarn 1, and Git.

```sh
git clone https://github.com/0Cymantek0/webpack-negated-equality-repro.git
cd webpack-negated-equality-repro
yarn install --frozen-lockfile --ignore-scripts
yarn repro
```

The dependency is pinned to the affected webpack source commit, not an npm release.

## Result

```text
source:                          undefined B
production, minimize: false:     undefined B
production, default minimizer:   B B
BUG REPRODUCED: minification changes the output
```

Both builds use production mode. Only `optimization.minimize` changes.
The script also prints the minified bundle and writes both bundles under `dist/`.

`src/index.js` contains the input. The remaining branch should use `a == b`.
Instead, the minifier prints `!a != b`, which JavaScript reads as `(!a) != b`.

AI assisted with preparing and testing this reproduction.
