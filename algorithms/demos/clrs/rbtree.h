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
