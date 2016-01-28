## Commit Message

### format
```html
firstline - <type>(<scope>): <subject>
  (emptyline)
<body>
  (emptyline)
<footer>
```
#### Type values
- (production code change)
    - feat (new feature for the user)
    - fix (bug fix for the user)
    - docs (changes to the documentation)
    - refactor (refactoring production code, e.g. renaming a variable)
- (no production code change)
    - style (formatting, missing semi colons)
    - test (adding missing tests, refactoring tests)
    - chore (updating grunt tasks etc)

#### Scope values
- init
- runner
- watcher
- config
- web-server
- proxy
- empty

#### Subject(firstline)
no more than 50 characters

#### Message body
- uses the imperative, present tense: “change” not “changed” nor “changes”
- includes **motivation** for the change and contrasts with previous behavior

#### Messaga footer
- referencing issues e.g. close #666, #888
- breaking changes 碎片式更改(特别是**用户端**)
e.g.`port-runner` command line option has changed to `runner-port`, so that it is
consistent with the configuration file syntax.
To migrate your project, change all the commands, where you use `--port-runner`
to `--runner-port`.

## Pull Request Work Flow

1. Fork it.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Ensure tests are passing.
4. Commit changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin my-new-feature`).
6. Create new Pull Request.
