---
sidebar_position: 1
tags: [Language, Java, Toolchain, Gradle, Maven]
---

# Toolchain

## 编译

```bash
javac name.java
```

## 运行

```bash
java name(无后缀类名)
```

## 反汇编

```bash
javap –c name(无后缀类名)
```

## 打包

```bash
jar {c t x u f} [v m e 0 M i][-c 目录] 文件名
```

解释:

- c: 创建 jar 包
- t: 显示 jar 包内容
- x: 解压 jar 包
- u: 添加文件到 jar 包
- f: 命名 jar 包
- v: 显示详细执行过程报告
- m: 指定 manifest.mf 文件(对 jar 包做相关设置)
- 0: 打包 jar 包是不压缩
- M: 不产生 manifest.mf 文件, 覆盖 m 参数的设置
- i: 创建索引文件
- C: 进入某目录后再执行 jar 命令
- 生成 API 文档: `java doc –d [ ] 类名/包名`.

可选参数:

- -author/-version: 文档中显示作者和版本信息(默认不显示)
- -link superlink 标准类名: 为标准类添加超链接
- -linksourse: 方法/类名转化为超链接, 指向生成的 html 格式的源文件

## Gradle

```bash
sudo apt install gradle

gradle help
gradle tasks

gradle assemble
gradle build
gradle clean
gradle test
gradle jar
gradle javadoc
```

### Build

```groovy
apply plugin: 'java'

jar {
    manifest {
        attributes 'Main-Class': 'com.sabertazimi.tao.Tao'
    }
}
```

## Maven

### Settings

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <!-- 本地仓库 -->
    <localRepository>/Users/yiny/soft/apache-maven-3.8.1/repo</localRepository>

    <!-- 镜像仓库 -->
    <mirrors>
        <mirror>
            <id>aliyun-maven</id>
            <mirrorOf>*</mirrorOf>
            <name>Aliyun Maven</name>
            <url>http://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>

    <!-- 配置文件 -->
    <profiles>
        <profile>
            <id>jdk-22</id>
            <activation>
                <activeByDefault>true</activeByDefault>
                <jdk>22</jdk>
            </activation>
            <properties>
                <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
                <maven.compiler.source>22</maven.compiler.source>
                <maven.compiler.target>22</maven.compiler.target>
                <maven.compiler.compilerVersion>22</maven.compiler.compilerVersion>
            </properties>
        </profile>
    </profiles>
</settings>
```

### Lifecycle

Default lifecycle:
validate -> compile -> test -> package -> verify -> install -> deploy.

```bash
# Generate a new Maven project
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app \
-DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.5 \
-DinteractiveMode=false

# Validate maven settings
mvn validate

# Verify build results
mvn verify

# Install artifact into local repository
mvn install

# Deploy artifact to remote repository
mvn deploy
```

### Dependency

Scope:

- compile: default scope, compile time and runtime dependencies.
- test: test time dependencies, e.g. junit.
- provided: compile time dependencies, but not included in the final package, e.g. servlet-api.
- runtime: runtime dependencies, not compile time, e.g. jdbc driver.
- system: system path dependencies.
- import: import dependencies.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <properties>
        <spring-boot.version>2.7.15</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <version>${spring-boot.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

排除依赖传递:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.7.15</version>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-logging</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

</project>
```

:::tip[Dependency Management]

聚合项目用 `dependencyManagement` 来管理依赖, 依赖不会传递给子项目, 子项目需要显式声明依赖 (此时不用指定版本号).

:::

### Project

`packaging` 为 `pom` 时, 表示该项目是一个聚合项目, 它将包含多个子项目:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.ruoyi</groupId>
    <artifactId>ruoyi</artifactId>
    <version>1.0.0</version>

    <modules>
        <module>ruoyi-admin</module>
        <module>ruoyi-framework</module>
        <module>ruoyi-system</module>
        <module>ruoyi-quartz</module>
        <module>ruoyi-generator</module>
        <module>ruoyi-common</module>
    </modules>
    <packaging>pom</packaging>

</project>
```

此时子项目可以独立运行, 也可以作为聚合项目的一部分运行:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <artifactId>ruoyi-admin</artifactId>

    <parent>
        <groupId>com.ruoyi</groupId>
        <artifactId>ruoyi</artifactId>
        <version>1.0.0</version>
    </parent>
    <packaging>jar</packaging>

</project>
```
