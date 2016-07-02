#include "String.h"

int String::operator>(const String &c) const {
    return strcmp(s, c.s) > 0;
}

int String::operator==(const String &c) const {
    return strcmp(s, c.s) == 0;
}

int String::operator<(const String &c) const {
    return strcmp(s, c.s) < 0;
}

char &String::operator[](int x) {
    return s[x];
}

String::operator const char *() const {
    return s;
}

String String::operator+(const String &c) const {
    char *t = new char[strlen(s)+strlen(c.s)+1];
    String r(strcat(strcpy(t,s), c.s));
    delete []t;
    return r;
}

String &String::operator=(const String &c) {
    delete []s;
    strcpy(s=new char[strlen(c.s)+1], c.s);
    return *this;
}

String &String::operator+=(const String &c) {
    return *this = *this+s;
}

String::String(const char *c) {
    strcpy(s=new char[strlen(c)+1], c);
}

String::String(const String &c) {
    strcpy(s=new char[strlen(c.s)+1], c.s);
}

String::~String(void) {
    if (s) {
        delete []s;
        s = 0;
    }
}

