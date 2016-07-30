#include <iostream>
#include "rbtree.h"

using namespace std;

int main(void) {
    RedBlackTree<int> rbtree;
    int value;
    rbtree.insert_key(38);
    rbtree.insert_key(31);
    rbtree.insert_key(12);
    rbtree.insert_key(41);
    rbtree.insert_key(19);
    rbtree.insert_key(8);

    cout<<"root is: "<<rbtree.get_root()->key<<endl;

    cout<<"Inorder walk red black tree: "<<endl;
    rbtree.inorder_tree_walk();

    if(rbtree.get_minmum(value) == 0) {
        cout<<"minmum is: "<<value<<endl;
    }

    if(rbtree.get_maxmum(value) == 0) {
        cout<<"maxmum is: "<<value<<endl;
    }

    if(rbtree.get_successor(41,value) == 0) {
        cout<<"41 successor is: "<<value<<endl;
    }

    if(rbtree.get_predecessor(41,value) == 0) {
        cout<<"41 predecessor is: "<<value<<endl;
    }

    if(rbtree.delete_key(38) == 0) {
        cout<<"delete 38 successfully"<<endl;
    }

    cout<<"root is: "<<rbtree.get_root()->key<<endl;

    cout<<"Inorder walk red black tree:"<<endl;
    rbtree.inorder_tree_walk();
    return 0;
}