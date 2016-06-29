
#include <malloc.h>

struct String {
    typedef char *chapter;
    chapter s;
    int strlen(void);
    String(chapter);
    ~String();
};
