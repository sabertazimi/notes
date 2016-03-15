/*************************************************************************
	> File Name: machine_code.c
	> Author: sabertazimi 
	> Mail: sabertazimi@gmail.com
    > License: Apache V2
	> Created Time: 2016年03月15日 星期二 17时29分16秒
 ************************************************************************/

#include <stdio.h>
#include <stdio.h>
#include <limits.h>

#define TRUE  1
#define FALSE 0
#define LEN 8

int main(void) {
    int i, j, k = 0;
    int x, y;
    unsigned ux, uy;
    int edges[] = {0, -1, INT_MIN, INT_MAX, 23333, INT_MAX / 23333, INT_MIN + 23333, INT_MAX - 23333};
    int results[1000];

    for (i = 0;i < LEN;i++) {
        x = edges[i];
        ux = x;

        for (j = 0;j < LEN;j++) {
            y = edges[j];
            uy = y;

            // if equal, continue
            if (x * x > 0 || x * x == 0) {
                ;
            } else {
                results[k++] = x;
                results[k++] = y;
            }
        }
    }

    for (i = 0;i < k;i+=2) {
        printf("x = %d, y = %d\n", results[i], results[i + 1]);
    }
}

