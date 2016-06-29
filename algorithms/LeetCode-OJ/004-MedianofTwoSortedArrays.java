/*
* @Author: sabertazimi
* @Date:   2016-05-04 15:04:11
* @Last Modified by:   sabertazimi
* @Last Modified time: 2016-05-04 15:34:33
*/

public class Solution {
	// merge algorithm
	public double findMedianSortedArrays(int[] nums1, int[] nums2) {
		int i = 0;
		int j = 0;
		int k = 0;
		int len1 = nums1.length;
		int len2 = nums2.length;
		int [] nums3 = new int[len1+len2];
		double median = 0;

		while(j < len1 && k < len2) {
			nums3[i++] = (nums1[j] < nums2[k]) ? nums1[j++] : nums2[k++];
		}

		while (j < len1) {
			nums3[i++] = nums1[j++];
		}

		while (k < len2) {
			nums3[i++] = nums2[k++];
		}

		median = i % 2 == 0 ? nums3[i/2 - 1] + nums3[i/2] : 2 * nums3[i/2];
		median /= 2.0;
		return median;
	}
}
