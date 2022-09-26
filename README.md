# setup-jarvis

This action sets up the environment to use jarvis by downloading a specified version of jarvis and adding to `PATH`

## Usage

see [action.yml](action.yml)

### example

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: atoscerebro/setup-jarvis@v1
    with:
      version: '1' # The jarvis version to download and use.
  - run: jarvis project docs --check # Check if docs are up to date.
```
