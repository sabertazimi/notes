/*
 * @Author: sabertazimi
 * @Date:   2016-05-04 15:37:09
 * @Last Modified by:   sabertazimi
 * @Last Modified time: 2016-05-04 15:58:43
 */

public class Solution {
    // 动态规划
    public String longestPalindrome(String s) {
        int n = s.length();
        int longestBegin = 0;
        int maxLen = 1;
        bool table[1000][1000] = {false};

        for (int i = 0; i < n; i++) {

            table[i][i] = true;   //前期的初始化
        }

        for (int i = 0; i < n-1; i++) {

            if (s[i] == s[i+1]) {
                table[i][i+1] = true; //前期的初始化
                longestBegin = i;
                maxLen = 2;
            }
        }

        for (int len = 3; len <= n; len++) {

            for (int i = 0; i < n-len+1; i++) {

                int j = i+len-1;

                if (s[i] == s[j] && table[i+1][j-1]) {
                    table[i][j] = true;
                    longestBegin = i;
                    maxLen = len;
                }
            }
        }

        return s.substr(longestBegin, maxLen);
    }
}
