/*
* @Author: sabertazimi
* @Date:   2016-05-02 21:54:51
* @Last Modified by:   sabertazimi
* @Last Modified time: 2016-05-03 00:14:09
*/

public class Solution {
	public int lengthOfLongestSubstring(String s) {
		if (s == null || s.length() == 0) {
			return 0;
		}
		HashMap<Character, Integer> map = new HashMap<Character, Integer>();
		int l = 0;
		int len = 0;

		// 最大子串为 2个重复字符间字符串长度 + 1
		for (int i = 0;i < s.length();i++) {
			char cur = s.charAt(i);
			if (map.containsKey(cur)){
				if(l <= map.get(cur)) {
					l = map.get(cur) + 1;
				}
			}

			map.put(cur, i);

			if (len < i - l +1) {
				len = i - l + 1;
			}
		}

		return len;
	}
}
