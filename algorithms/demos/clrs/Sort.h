//
// Created by sabertazimi on 16-7-31.
//

#ifndef CLRS_SORT_H
#define CLRS_SORT_H

#include <vector>

using namespace std;

template <class T>
static int partition(vector<T> &arr, int lo, int hi) {
    T x = arr[hi];
    T tmp;
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

template <class T>
static int quick_sort(vector<T> &arr, int lo, int hi) {
    int x;
    if (lo < hi) {
        x = partition(arr, lo, hi);
        quick_sort(arr, lo, x - 1);
        quick_sort(arr, x + 1, hi);
    }

    return 1;
}



#endif //CLRS_SORT_H
