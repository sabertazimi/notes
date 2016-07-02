#include "String.h"

int String::strlen(void) {
    int k;

    for (k = 0; s[k] != '\0'; k++);

    return k;
}

String::String(String::chapter t) {
    int k;

    for (k = 0; t[k] != '\0'; k++);

    s = (String::chapter)malloc(k + 1);

    for (k = 0; (s[k] = t[k]) != '\0'; k++);
}

String::~String() {
    // check flag
    if (s == NULL) {
        return;
    }

    free(s);

    // set flag
    s = NULL;
}
