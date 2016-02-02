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

## Branch

[经验来源](http://www.zhihu.com/question/20866683/answer/29272967)

1. master类型分支，名为?|master或master，其中?为开发代号
2. develop类型分支，名为?|develop或develop，其中?为开发代号
3. feature类型分支，名为feature/*或?|feature/*，其中*为特征描述
4. release类型分支，名为release-*或?|release-*，其中*为要发布的版本号
5. hotfix类型分支，名为hotfix-*或?|hotfix-*，其中*为要发布的版本号
6. issues类型分支，名为issues/*或?|issues/*，其中*为问题描述
7. trials类型分支，名为？%trials.*，？为此分支的父分支，*为描述的名称（或直接为？%trials）
8. basedOn类型分支，名为basedOn或?|basedOn，?为其来源的master分支的开发代号
9. work类型分支，名为work.***/basedOn-?-*，***代表此描述此work的名称，?为其所基于的分支的开发代号，最后一个*代表其在？|basedOn上所基于的分支的版本号或状态名

下面介绍模型中的约定，并定义gg-*这样的抽象动作来完成约定中的行为

约定： 

1. 每一次的提交都必须有意义：

git在每次提交的时候要求输入对此提交的概括，这个概括不能为空。

正确的提交概括：更新了程序doc
错误的提交概括：我刚才干了些啥？

2. 开发型任务中的master类型与develop类型分支必须成对出现，master分支的推进只能来源与release分支和hotfix分支的合并，禁止在master分支上直接提交。

> master分支上只有我们推送上去的稳定版本的程序，develop分支上的程序一直处于开发状态，不稳定。
在开发型任务中使用gg-init进行版本控制的初始化，建立配套的master～develop分支对。
在使用型任务中使用gg-work-init进行版本控制的初始化，拉取需要使用的稳定版本程序的master分支，并初始化对应的basedOn分支（见9）。

3. feature类型分支满足：
  1. 只能从develop类型分支上创建
  2. 最终必须合并到develop类型分支
  3. 最终分支被删除

> 每当有新特性需要加入的时候，我们应该从develop类型分支上新建一个feature类型分支，完成新特性的开发和测试后将特性合并到develop类型分支上。
在develop类型分支上使用gg-feature-open featureName建立并转向一个名为feature/featureName的新分支
在一个feature类型分支上使用gg-feature-close把这个分支的工作合并到develop类型分支上，删除此分支，完成一个特性的开发

4. release类型分支满足：
  1. 只能从develop类型分支上创建
  2. 最终必须同时合并到master类型分支(发布新的版本)和develop类型分支(基于新版本的进一步开发)
  3. 最终分支被删除

> 每当工作进入到一个较为稳定阶段的时候，我们可以使用gg-release-open versionNum建立并转向一个名为release-versionNum的临时分支，在这个分支上允许进行小的改动（比如修改一下readme文件中的版本号），然后使用gg-release-close将此版本合并（发布）到master类型分支上，同时合并到develop类型分支上，然后删除此分支。

5. hotfix类型分支满足:
  1.  只能从master类型分支上创建
  2.  最终必须同时合并到master类型分支(发布新的热补丁版本)和develop类型分支(基于新版本的进一步开发)
  3.  最终分支被删除

> 当新版本发布后发现必须马上解决的严重bug时，我们应该使用gg-hotfix-open versionNum建立并转向一个名为hotfix-versionNum的临时分支，在这个分支上完成bug的修复，然后使用gg-hotfix-close将此版本合并（发布）到master类型分支上，同时合并到develop类型分支上，然后删除此分支。

6. issues类型分支满足：
  1. 只能从develop类型分支上创建
  2. 最终必须合并到develop类型分支
  3. 最终分支被删除

> 注解：每当有（比较复杂的）问题需要解决的时候，我们应该从develop类型分支上新建一个issues类型分支，完成问题的调试后合并到develop类型分支上。
在develop类型分支上使用gg-issues-open featureName建立并转向一个名为issues/issuesName的新分支
在一个issues类型分支上使用gg-issues-close把这个分支的工作合并到develop类型分支上，然后删除此分支，解决了一个复杂的问题
issues类型和feature类型的实现方式一模一样，仅仅有名字上面的差别。

7. trials类型分支满足：
  1. 可以从除了release类型分支以外的任何类型分支上创建
  2. 在这个分支上请发挥想象力大胆实验
    - 接受实验结果，把实验过程并入父分支，称为good-close
    - 实验结果不理想，放弃实验结果，从实验开始前重新来过，称为bad-close
  3. 最终分支被删除

> 在满足条件的分支A上工作，时不时会冒出一些大胆的想法，这个时候使用gg-trials-open trialsName创建并转向一个名为A/trials.trialsName的实验分支，在这个分支上进行疯狂的实验，然后


8. basedOn类型分支满足:
  1. 从name|master建立并初始化为name|basedOn
  2. 只能从对应的master分支fork到此分支
  3. 禁止在这个分支上提交

> 这个分支是一个为了使工作流程更为清晰的缓存分支，分支上只有从master稳定分支上挑选出来的自己在工作中将要（尝试）使用的稳定版本。在basedOn类型分支上使用gg-select 版本号  从对应的master分支上选出一个稳定版本或使用gg-select-the-latest从对应的master分支上选择最新的版本，fork到这个分支，并加上inUse-versionNum的标签    
从master到此分支的行为是fork，即有可能此分支的log为 (init)v1.0===>v0.9=====>v0.8======>v1.3,这个分支上的commit来源于master，但是其分支提交历史与master分支无关

9. work类型分支满足：
  1. 只能从basedOn类型分支上创建
  2. 可以借助basedOn分支升级

## Pull Request Work Flow

1. Fork it.
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Ensure tests are passing.
4. Commit changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin my-new-feature`).
6. Create new Pull Request.
