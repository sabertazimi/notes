public class Solution {
	// 先给定一个非正数a，然后找出另两个大于它且和为 0 - a的数
    public List<List<Integer>> threeSum(int[] nums) {
    	int i,j,k;
    	List<List<Integer>> res = new ArrayList<List<Integer>>();
    	// 先排好序
    	Arrays.sort(nums);

    	for(i = 0;i < nums.length-2;i++) {
    		// 跳过重复数字
    		if (i > 0 && nums[i] == nums[i -1 ]) continue;
    		// 对于升序数组，此情况下无解
    		if (nums[i]>0) break;

    		for (j = i + 1, k = nums.length-1;j < k;) {
    			if(j > i +1&& nums[j] == nums[j-1]) {
    				j++
    				continue;
    			}
    			if (nums[i]+nums[j]>0) break;

    			if(nums[i] + nums[j] + nums[k] < 0) {
    				j++;
    			} else if(nums[i]+nums[j]+nums[k]>0) {
    				k--;
    			} else {
    				List<Integer> triplets = new ArrayList<Integer>();
    				triplets.add(nums[i]);
    				triplets.add(nums[j]);
    				triplets.add(nums[k]);
    				res.add(triplets);
    				j++;
    				k--;
    			}
    		}
    	}

    	return res;
    }
}
