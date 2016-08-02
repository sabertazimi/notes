#include <iostream>
#include <cstdlib>
#include <cstdio>

using namespace std;

static int partition(int arr[], int lo, int hi) {
    int x = arr[hi];
    int tmp;
    int i = lo - 1;

    for (int j = lo; j < hi; j++) {
        if (arr[j] <= x) {
            i++;
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    tmp = arr[i + 1];
    arr[i + 1] = arr[hi];
    arr[hi] = tmp;

    return  i + 1;
}

static int quick_sort(int arr[], int lo, int hi) {
    int x;
    if (lo < hi) {
        x = partition(arr, lo, hi);
        quick_sort(arr, lo, x - 1);
        quick_sort(arr, x + 1, hi);
    }

    return 1;
}

int main(void) {
    int n, m;
    int lo, hi;
    int cnt = 0;
    scanf("%d %d", &n, &m);
    int *arr = new int[n];

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    quick_sort(arr, 0, n - 1);

    for (int i = 0; i < m; i++) {
        scanf("%d %d", &lo, &hi);
        cnt = 0;
        if (lo <= hi) {
            for (int j = 0; j < n; j++) {
                if (arr[j] >= lo) {
                    for (int k = j; k < n; k++) {
                        if (arr[k] <= hi) {
                            cnt++;
                        } else {
                            break;
                        }
                    }
                    break;
                }
            }
            printf("%d\n", cnt);
        } else {
            printf("0\n");
        }
    }
}