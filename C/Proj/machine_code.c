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
#include <float.h>

#ifdef TRUE
#undef TRUE
#endif
#ifdef FALSE
#undef FALSE
#endif
#ifdef LEN
#undef LEN
#endif
#ifdef RESULTS_LEN
#undef RESULTS_LEN
#endif
#ifdef DEMENSION
#undef DEMENSION
#endif

#define TRUE  1
#define FALSE 0
#define LEN 8
#define RESULTS_LEN 8
#define DEMENSION 3 

int main(void) {
    int i, j, l, k = 0;
    int x, y, z;
    double dx, dy, dz;
    int edges[] = {0, -1, INT_MIN, INT_MAX, 23333, INT_MAX / 23333, INT_MIN + 23333, INT_MAX - 23333};
    int results[RESULTS_LEN];

    for (i = 0;i < LEN;i++) { 
        x = edges[i];
        dx = x;

        for (j = 0;j < LEN;j++) {
            y = edges[j];
            dy = y;

            for (l = 0;l < LEN;l++) {
                z = edges[l];
                dz = z;

                // write expression to be test down
                if (dx/dx == dy/dy) {
                    ;
                } else {
                    results[k++] = x;
                    results[k++] = y;
                    results[k++] = z;
                }
            }
        }
    }

    for (i = 0;i < k;i += DEMENSION) {
        printf("x = %d, y = %d, z = %d\n", results[i], results[i + 1], results[i + 2]);
    }
}

