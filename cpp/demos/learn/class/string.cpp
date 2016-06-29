#include <malloc.h>

struct String {
    typedef char *chapter;
    chapter s;
    int strlen();
    String(chapter);
    ~String();
};

int String::strlen() {
    int k;

    for (k = 0; s[k] != '\0'; k++);

    return k;
}

String::String(chapter t) {
    int k;

    for (k = 0; t[k] != '\0'; k++);

    s = (chapter)malloc(k + 1);

    for (k = 0; (s[k] = t[k]) != '\0'; k++);
}

String::~String() {
    free(s);
}
