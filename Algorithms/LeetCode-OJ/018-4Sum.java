/*
* @Author: sabertazimi
* @Date:   2016-05-01 19:49:21
* @Last Modified by:   sabertazimi
* @Last Modified time: 2016-05-01 21:09:51
*/

public class Solution {
    public List<List<Integer>> fourSum(int[] num, int target) {
         List<List<Integer>> ret = new ArrayList<List<Integer>>();
        HashMap<Integer, List<Integer[]>> hm = new HashMap<Integer, List<Integer[]>>();
        int len = num.length;

        Arrays.sort(num);
        // store pair
        for (int i = 0; i < len - 1; ++i) {
            for (int j = i + 1; j < len; ++j) {
                int sum = num[i] + num[j];
                Integer[] tuple = {num[i], i, num[j], j};
                if (!hm.containsKey(sum)) {
                    hm.put(sum, new ArrayList<Integer[]>());
                }
                hm.get(sum).add(tuple);
            }
        }

        Integer[] keys = hm.keySet().toArray(new Integer[hm.size()]);
        for (int key : keys) {
            if (hm.containsKey(key)) {
                if (hm.containsKey(target - key)) {
                    List<Integer[]> first_pairs = hm.get(key);
                    List<Integer[]> second_pairs = hm.get(target - key);

                    for (int i = 0; i < first_pairs.size(); ++i) {
                        Integer[] first = first_pairs.get(i);
                        for (int j = 0; j < second_pairs.size(); ++j) {
                            Integer[] second = second_pairs.get(j);
                            // check
                            if (first[1] != second[1] && first[1] != second[3] &&
                                    first[3] != second[1] && first[3] != second[3]) {
                                List<Integer> ans = Arrays.asList(first[0], first[2], second[0], second[2]);
                                Collections.sort(ans);
                                if (!ret.contains(ans)) {
                                    ret.add(ans);
                                }
                            }
                        }
                    }

                    hm.remove(key);
                    hm.remove(target - key);
                }
            }
        }

        return ret;

    }
}
