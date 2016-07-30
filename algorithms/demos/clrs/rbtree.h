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