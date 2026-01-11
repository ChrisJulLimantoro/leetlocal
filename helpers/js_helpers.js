// Common LeetCode Data Structures (JavaScript)

// Definition for a binary tree node
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Definition for singly-linked list
class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Definition for doubly-linked list
class DLNode {
  constructor(val = 0, prev = null, next = null) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}

// Definition for a graph node
class Node {
  constructor(val = 0, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

module.exports = { TreeNode, ListNode, DLNode, Node };
