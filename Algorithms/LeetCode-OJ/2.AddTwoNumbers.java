/*
 * @Author: sabertazimi
 * @Date:   2016-05-01 21:19:04
 * @Last Modified by:   sabertazimi
 * @Last Modified time: 2016-05-01 22:02:59
 */

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
public class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode c1 = l1;
        ListNode c2 = l2;
        ListNode pre = new ListNode(0); // set pre head
        ListNode d = pre;
        int sum = 0; // the sum of two nodes
        while (c1 != null || c2 != null) { // traverse longer list
            if (c1 != null) { // add one list
                sum += c1.val;
                c1 = c1.next; // move on
            }
            if (c2 != null) { // add another list
                sum += c2.val;
                c2 = c2.next; // move on
            }
            // build next node
            d.next = new ListNode(sum % 10); // digit for current node
            sum /= 10; // carry
            d = d.next;
        }
        if (sum == 1) d.next = new ListNode(1); // note that can have carry at the last digit
        return pre.next;
    }
}
