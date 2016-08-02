/**
 * Train in TsingHua OJ
 */
int main(void) {

    int n, m;
    scanf("%d %d\n", &n, &m);

    int* B = new int[n];
    for (int i = 0; i < n; i++) {
    	scanf("%d", &B[i]);
    }

    int A = 1; 			// 入口车厢序列初始化，A为变量
    Stack<int> S(m);	// 中转车厢序列初始化，S为栈

    for (int i = 0; i < n; i++) {

        while (S.top() < B[i]) {
            S.push(A++);
            p = printf("push\n");
        }

        if (m < S.size()) {
            printf("No\n");
            break;
        }

        if (S.pop() == B[i]) {
            p = printf("pop\n");
        } else {
            printf("No\n");
            break;
        }
    }

    return 0;
}
