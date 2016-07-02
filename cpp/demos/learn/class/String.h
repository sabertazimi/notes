#include <iostream>
#include <malloc.h>
#include <string.h>

using namespace std;

/**
 *
 * Demos for operator overload:
 *  comparsion: < == >
 *  getter: []
 *  typecast: (const char *)
 *  contact: +
 *  assign: = +=
 */

/**
 * Notes:
 *  普通函数成员 与 析构函数 全部定义为虚函数
 *  不改变对象实例的函数 全部定义为 const 函数
 *  被改变参数/返回值 全部定义为 引用类型
 *  深拷贝(赋值)函数参数/返回值 全部定义为 引用类型
 */

class String {
    char *s;
public:
    virtual int operator>(const String &c) const;
    virtual int operator==(const String &c) const;
    virtual int operator<(const String &c) const;
    virtual char &operator[](int x);
    virtual operator const char *() const;
    virtual String operator+(const String &c) const;
    virtual String &operator=(const String &c);
    virtual String &operator+=(const String &c);
    String(const char *c);
    String(const String &c);
    virtual ~String();
};
