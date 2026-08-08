### LRU缓存

> LRU（The Least Recently Used，最近最久未使用算法）是一种常见的缓存算法，在很多分布式缓存系统（如Redis, Memcached）中都有广泛使用。 
>
> LRU算法的思想是： 如果一个数据在最近一段时间没有被访问到，那么可以认为在将来它被访问的可能性也很小。当有新的缓存加入时，会优先淘汰被访问可能性最小的数据

#### 算法思路分析

##### 思路：

+ 我们可以使用`ArrayList`或`LinkedList`来对缓存数据进行存储。但由于我们需要频繁地交换节点值(每一次加入新的缓存或更新旧的缓存)，使用`ArrayList`每一次移动节点值所需要的开销为`O(n)`，因此我们采用交换效率更高的`LinkedList`
+ 对于缓存中数据的每一次查询，如果线性查询，则每一次查询的开销为`O(n)`，在这里我们使用查询效率更高的`HashMap`

##### 实现细节

+ 用一个双链表`Node`来储存数据
+ 用一个`HashMap`来储存每一个查询的数据

#### 代码实现

```java
class LRUCache {

    private int capacity;

    private Node head, tail;

    private Map<Integer, Node> map;

    public LRUCache(int cap) {
        capacity = cap;

        head = new Node(-1, -1);
        tail = new Node(-1, -1);

        head.next = tail;
        tail.pre = head;

        map = new HashMap<>();
    }
    
    public int get(int key) {
        Node node = map.get(key);

        if (node == null) {
            return -1;
        }

        moveToHead(node, node.val);
        return node.val;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            moveToHead(node, value);
        } else {
            if (map.size() == capacity) {
                Node node = tail.pre;
                delete(node);
                map.remove(node.key);
            }
            Node newNode = new Node(key, value);
            insertToHead(newNode);
            map.put(key, newNode);
        }
    }

    private void moveToHead(Node node, int val) {
        delete(node);
        insertToHead(node);
        node.val = val;
    }

    private void delete(Node node) {
        node.pre.next = node.next;
        node.next.pre = node.pre;
    }

    private void insertToHead(Node node) {
        node.next = head.next;
        node.pre = head;
        head.next.pre = node;
        head.next = node;
    }
}

class Node {
    int key, val;
    Node pre, next;

    public Node (int key, int val) {
        this.key = key;
        this.val = val;
    }
}
```

