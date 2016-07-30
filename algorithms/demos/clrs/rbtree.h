#inclue <stack>

static const int RED = 0;
static const int BLACK = 1;

template <class T>
class RedBlackTreeNode {
public:
    /**
     * Node constructor
     */
    RedBlackTreeNode(): key(T()), parent(NULL), left(NULL), right(NULL), color(BLACK) {}

    T key;
    int color;
    RedBlackTreeNode<T> *parent;
    RedBlackTreeNode<T> *left;
    RedBlackTreeNode<T> *right;
};

template <class T>
class RedBlackTree {
public:
    RedBlackTree(void);
    int search(const T &k) const;
    int get_minmum(T &retmin) const;
    int get_maxmum(T &retmax) const;
    int get_successor(const T &k, T &ret) const;
    int get_predecessor(const T &k, T &ret) const;
    int insert_key(const T &k);
    int delete_key(const T &k);
    void inorder_tree_walk(void) const;
    RedBlackTreeNode<T> *get_root(void) const;
    ~RedBlackTree(void);
private:
    RedBlackTreeNode<T> *root;
    static RedBlackTreeNode<T> *NIL;
    RedBlackTreeNode<T> *get_parent(RedBlackTreeNode<T> *pnode) const;
    RedBlackTreeNode<T> *get_left(RedBlackTreeNode<T> *pnode) const;
    RedBlackTreeNode<T> *get_right(RedBlackTreeNode<T> *pnode) const;
    T get_key(RedBlackTreeNode<T> *pnode) const;
    int get_color(RedBlackTreeNode<T> *pnode) const;
    void set_color(RedBlackTreeNode<T> *pnode, int color);
    void left_rotate(RedBlackTreeNode<T> *pnode);
    void right_rotate(RedBlackTreeNode<T> *pnode);
    void rb_insert_fixup(RedBlackTreeNode<T> *pnode);
    void rb_delete_fixup(RedBlackTreeNode<T> *pnode);
    RedBlackTreeNode<T> *get_maxmum(RedBlackTreeNode<T> *root) const;
    RedBlackTreeNode<T> *get_minmum(RedBlackTreeNode<T> *root) const;
    RedBlackTreeNode<T> *get_successor(RedBlackTreeNode<T> *pnode) const;
    RedBlackTreeNode<T> *get_predecessor(RedBlackTreeNode<T> *pnode) const;
    RedBlackTreeNode<T> *search_tree_node(const T &k) const;
    void make_empty(RedBlackTreeNode<T> *root);
};

template <class T>
RedBlackTreeNode<T> *RedBlackTree<T>::NIL = new RedBlackTreeNode<T>;

template <class T>
RedBlackTree<T>::RedBlackTree(void) {
    root = NULL;
}

template <class T>
int RedBlackTree<T>::search(const T &k) const {
    return (NIL != search_tree_node(k));
}

template <class T>
int RedBlackTree<T>::get_minmum(T &retmin) const {
    if (root) {
        retmin = get_minmum(root)->key;
        return 0;
    }

    return -1;
}


template <class T>
int RedBlackTree<T>::get_maxmum(T& retmax) const  {
    if (root) {
        retmax = get_maxmum(root)->key;
        return 0;
    }

    return -1;
}

template <class T>
int RedBlackTree<T>::get_successor(const T& k,T& ret) const {
    RedBlackTreeNode<T>* pnode = search_tree_node(k);

    if (pnode != NIL) {
        pnode = get_successor(pnode);

        if (pnode != NIL) {
            ret = pnode->key;
            return 0;
        }

        return -1;
    }

    return -1;
}
template <class T>
int RedBlackTree<T>::get_predecessor(const T& k,T& ret) const {
    RedBlackTreeNode<T>* pnode = search_tree_node(k);

    if (pnode != NIL) {
        pnode = get_predecessor(pnode);

        if (pnode != NIL) {
            ret = pnode->key;
            return 0;
        }

        return -1;
    }

    return -1;
}

template <class T>
int RedBlackTree<T>::insert_key(const T &k) {
    RedBlackTreeNode<T> *newnode = new RedBlackTreeNode<T>;
    newnode->key = k;
    newnode->color = RED;
    newnode->left = NIL;
    newnode->right = NIL;
    newnode->parent = NIL;

    if (NULL == root) {
        root = newnode;
    } else {
        RedBlackTreeNode<T> *pnode = root;
        RedBlackTreeNode<T> *qnode;

        while (pnode != NIL) {
            qnode = pnode;

            if (pnode->key > newnode->key) {
                pnode = pnode->left;
            } else {
                pnode = pnode->right;
            }

            newnode->parent = qnode;
            if (qnode->key > newnode->key) {
                qnode->left = newnode;
            } else {
                qnode->right = newnode;
            }
        }
    }

    rb_insert_fixup(newnode);

    return 0;

}

template <class T>
int RedBlackTree<T>::delete_key(const T &k) {

}

template <class T>
RedBlackTree<T>::~RedBlackTree(void) {
    make_empty(root);
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>:: get_root() const {
    return root;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_parent(RedBlackTreeNode<T>* pnode) const {
    return pnode->parent;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_left(RedBlackTreeNode<T>* pnode) const {
    return pnode->left;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_right(RedBlackTreeNode<T>* pnode) const {
    return pnode->right;
}

template <class T>
T RedBlackTree<T>::get_key(RedBlackTreeNode<T>* pnode) const {
    return pnode->key;
}

template <class T>
int RedBlackTree<T>::get_color(RedBlackTreeNode<T>* pnode) const {
    return pnode->color;
}

template <class T>
void RedBlackTree<T>::set_color(RedBlackTreeNode<T>* pnode,int color) {
    pnode->color = color;
}

template <class T>
void RedBlackTree<T>::left_rotate(RedBlackTreeNode<T> *pnode) {
    RedBlackTreeNode<T> *rightnode = pnode->right;

    /*
     * three steps:
     * 1. move rightnode's left-child, establish link between pnode and left-child
     * 2. move rightnode to pnode, establish link between parent and rightnode
     * 3. establish link between pnode and rightnode
     */

    pnode->right = rightnode->left;
    if (rightnode->left != NIL) {
        rightnode->left->parent = pnode;
    }

    rightnode->parent = pnode->parent;
    if (pnode->parent == NIL) {
        root = rightnode;
    } else if (pnode->parent->left == pnode) {
        pnode->parent->left = rightnode;
    } else {
        pnode->parent->right = rightnode;
    }

    rightnode->left = pnode;
    pnode->parent = rightnode;
}

template <class T>
void RedBlackTree<T>::right_rotate(RedBlackTreeNode<T> *pnode) {
    RedBlackTreeNode<T> *leftnode = pnode->left;

    /**
     * the same to left_rotate
     */

    pnode->left = leftnode->right;
    if (leftnode->right != NIL) {
        leftnode->right->parent = pnode;
    }

    leftnode->parent = pnode->parent;
    if (pnode->parent == NIL) {
        root = leftnode;
    } else if (pnode->parent->left == pnode) {
        pnode->parent->left = leftnode;
    } else {
        pnode->parent->right = leftnode;
    }

    leftnode->left = pnode;
    pnode->parent = leftnode;
}

template <class T>
void RedBlackTree<T>::rb_insert_fixup(RedBlackTreeNode<T> *pnode) {
    RedBlackTreeNode<T> *qnode, *tnode;

    // nature 4
    while  (get_color(get_parent(pnode)) == RED) {
        qnode = get_parent(get_parent(pnode));  // grandparent

        // left case
        if (get_parent(pnode) == get_left(qnode)) {
            tnode = get_right(qnode);   // uncle

            if (get_color(tnode) == RED) {
                // method: repaint
                // filp color to grandparent
                set_color(get_parent(pnode), BLACK);
                set_color(tnode, BLACK);
                set_Color(qnode, RED);

                // up 2 floors
                pnode = qnode;
            } else {
                if (pnode == get_right(get_parent(pnode))) {
                    // transform case 2 to case 3
                    // method: rotate
                    // update  pnode
                    pnode = get_parent(pnode);
                    left_rotate(pnode);
                }

                // case 3: pnode is left-child
                // method: repaint and rotate
                set_color(get_parent(pnode), BLACK);
                qnode = get_parent(get_parent(pnode));
                set_color(qnode, RED);
                right_rotate(qnode);
            }
        } else {
        // right case: the same to left case
            tnode = get_left(qnode);    // uncle

            if (get_color(tnode) == RED) {
                set_color(get_parent(pnode),BLACK);
                set_color(tnode,BLACK);
                set_color(qnode,RED);
                pnode = qnode;
            } else {
                if (pnode == get_left(get_parent(pnode))) {
                    pnode = get_parent(pnode);
                    right_rotate(pnode);
                }

                set_color(get_parent(pnode),BLACK);
                qnode = get_parent(get_parent(pnode));
                set_color(qnode,RED);
                left_rotate(qnode);
            }
        }
    }

    set_color(root, BLACK);
}

template <class T>
void RedBlackTree<T>::rb_delete_fixup(RedBlackTreeNode<T> *pnode) {

}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_maxmum(RedBlackTreeNode<T> *root) const {
    RedBlackTreeNode<T> *pnode = root;

    while (pnode->right != NIL) {
        pnode = pnode->right;
    }

    return pnode;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_minmum(RedBlackTreeNode<T> *root) const {
    RedBlackTreeNode<T> *pnode = root;

    while (pnode->left != NIL) {
        pnode = pnode->left;
    }

    return pnode;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>:: get_successor(RedBlackTreeNode<T> *pnode) const {
    if (pnode->right != NIL) {
        return get_minmum(pnode->right);
    }

    RedBlackTreeNode<T>* parentnode = get_parent(pnode);

    while (parentnode != NIL && get_right(parentnode) == pnode) {
        pnode = parentnode;
        parentnode = get_parent(pnode);
    }

    return parentnode;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>::get_predecessor(RedBlackTreeNode<T> *pnode) const  {
    if (pnode->left != NIL) {
        return get_maxmum(pnode->left);
    }

    RedBlackTreeNode<T>* parentnode = get_parent(pnode);

    while (parentnode != NIL && get_left(parentnode) == pnode) {
        pnode = parentnode;
        parentnode = get_parent(pnode);
    }

    return parentnode;
}

template <class T>
RedBlackTreeNode<T>* RedBlackTree<T>:: search_tree_node(const T& k)const  {
    RedBlackTreeNode<T>* pnode = root;

    while (pnode != NIL) {
        if (pnode->key == k) {
            break;
        }
        else if (pnode->key > k) {
            pnode = pnode->left;
        }
        else {
            pnode = pnode->right;
        }
    }

    return pnode;
}

template <class T>
void RedBlackTree<T>::make_empty(RedBlackTreeNode<T>* root) {
    if (root) {
        RedBlackTreeNode<T> *pleft = root->left;
        RedBlackTreeNode<T>* pright = root->right;
        delete root;

        if (pleft != NIL) {
            make_empty(pleft);
        }

        if (pright != NIL) {
            make_empty(pright);
        }
    }
}

template <class T>
void RedBlackTree<T>::inorder_tree_walk()const {
    if (NULL != root) {
        stack<RedBlackTreeNode<T>* > s;
        RedBlackTreeNode<T> *ptmpnode;
        ptmpnode = root;

        while (NIL != ptmpnode || !s.empty()) {
            if (NIL != ptmpnode) {
                s.push(ptmpnode);
                ptmpnode = ptmpnode->left;
            } else {
                ptmpnode = s.top();
                s.pop();
                cout<<ptmpnode->key<<":";

                if (ptmpnode->color == BLACK) {
                    cout<<"Black"<<endl;
                } else {
                    cout<<"Red"<<endl;
                }

                ptmpnode = ptmpnode->right;
            }
        }
    }
}
