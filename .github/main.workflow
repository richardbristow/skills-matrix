workflow "install, lint, test, build" {
  on = "push"
  resolves = [
    "lint",
    "PROD: deploy to netlify",
  ]
}

action "install dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
  runs = "yarn"
}

action "lint" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["install dependencies"]
  runs = "yarn"
  args = "lint"
}

action "test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["install dependencies"]
  runs = "yarn"
  args = "test --coverage"
  env = {
    CI = "true"
  }
}

action "build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["test", "lint"]
  runs = "yarn"
  args = "build"
}

action "check for master branch" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  needs = ["build"]
  args = "branch master"
}

action "PROD: deploy to netlify" {
  uses = "netlify/actions/cli@master"
  needs = ["check for master branch"]
  args = "deploy --prod"
  secrets = ["NETLIFY_SITE_ID", "NETLIFY_AUTH_TOKEN"]
}
