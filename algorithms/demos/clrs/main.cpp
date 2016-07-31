#include <iostream>
#include <vector>

#include "rbtree.h"
#include "Sort.h"

using namespace std;

int main(void) {
    int n[] = {5, 4, 3, 2, 1};
    vector<int> arr(n, n + 5);
    quick_sort(arr, 0, (int)(arr.size() - 1));

    for (int i = 0; i < arr.size(); i++) {
        cout<<arr[i]<<"\n";
    }

    return 0;
}