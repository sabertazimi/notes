//
// Created by sabertazimi on 16-8-3.
//

#ifndef CLRS_DISJOINT_SETS_H
#define CLRS_DISJOINT_SETS_H

// ndoe tree/forest with rank to implement disjoint sets
class DS {
private:
    int *parent;
    int *rank;
    int count;
    int N;

    bool validate(int p) const {
        return (p > 0 && p <= N);
    }

public:
    DS(int N) {
        parent = new int[N];
        rank = new int[N];
        this->N = N;
        count = N;

        for (int i = 0; i < N; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }

    int find(int p) {
        if (!validate(p)) {
            return -1;
        }

        while (p != parent[p]) {
            // path compression
            parent[p] = parent[parent[p]];

            p = parent[p];
        }

        return p;
    }

    int getCount(int p, int q) const {
        return count;
    }

    bool connected(int p, int q) {
        return find(p) == find(q);
    }

    void Union(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);

        if (rootP == rootQ) {
            return;
        }

        if (rank[rootP] < rank[rootQ]) {
            parent[rootP] = rootQ;
        } else if (rank[rootP] > rank[rootQ]) {
            parent[rootQ] = rootP;
        } else {
            parent[rootQ] = rootP;
            rank[rootP]++;
        }

        count--;
    }

    ~DS(void) {
        delete []parent;
        delete []rank;
    }
};


#endif //CLRS_DISJOINT_SETS_H
