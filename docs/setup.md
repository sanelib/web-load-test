# Installation

## Ubuntu 18 Node Latest

SRC: https://github.com/nvm-sh/nvm

``` script

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

#verify export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm in ~/.bash_profile

#verify installation
command -v nvm #should display "nvm"
nvm ls-remote
nvm install node 14.1.0
nvm use node
nvm run node --version

```

## Publishing package to npm

NPM_EMAIL: sunnyrajwadi@gmail.com
NPM_TOKEN: xxxxxxxx-xxxx-xxxxxxxxx-xxxxxxxxxxxx

[https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow]
[https://docs.npmjs.com/creating-and-publishing-an-org-scoped-package]

npm login
npm init --scope=<your_org_name>
npm publish --access public
