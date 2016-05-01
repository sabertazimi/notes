public class Solution {
    public int threeSumClosest(int[] nums, int target) {
    	int i, j, k;
    	int closest;
    	Arrays.sort(nums);

    	if (nums==null || nums.length<3) return 0;

    	closest = nums[0] + nums[1] + nums[2];

    	for (i = 0;i < nums.length;i++) {
    		for(j = i+1, k = nums.length-1;j<k;) {
    			int sum = nums[i] + nums[j] + nums[k];
    			if (Math.abs(sum-target)<Math.abs(closest-target)) {
    				closest = sum;
    				if (closest == target) return closest;
    			}

    			if(sum>target) k--;
    			else j++;
    		}
    	}

    	return closest;
    }
}
