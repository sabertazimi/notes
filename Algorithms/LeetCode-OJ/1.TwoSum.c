/**
 * Note: The returned array must be malloced, assume caller calls free().
 */

int* twoSum(int* nums, int numsSize, int target) {
    int i, j, k;
    int flag = 0;
    int* arr = (int *)malloc(2 * sizeof(int));

    for (i = 0;i < numsSize - 2;i++) {
        for (j = i + 1;j < numsSize - 1; j++) {
            if (nums[i] + nums[j] == target) {
                arr[0] = i;
                arr[1] = j;
                flag = 1;
            }
        }

        if (flag == 1) break;
    }

    return arr;
}
