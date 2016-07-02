#include "String.h"

int main(void) {
    String s1("S1"), s2("S2"), s3("S3");

    s1 = s1 + s2;
    s1 += s3;
    s3[0] = 'T';

    cout<<"s1="<<s1<<"\n";
    cout<<"s2="<<s2<<"\n";
    cout<<"s3="<<s3<<"\n";
}
