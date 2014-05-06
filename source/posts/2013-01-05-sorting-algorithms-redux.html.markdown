---
title: Sorting Algorithms Redux
date: 2013-01-05 23:40 UTC
tags: computer science
---

[Sorting Algorithms Redux][1]

Without a formal computer science background, I found this YouTube series an accessible introduction to the subjects of time complexity, big-O notation, and sorting algorithms.

**Time complexity** is the relationship between how much time it will take a computer to perform some function on a set of data, and the size of the data set. In other words, it's how a function *scales* as the amount of data it acts upon increases. You might also think of it as one way to measure the efficiency of a function.

**Big-O notation** is a way of describing time complexity. It looks like an uppercase letter "O" followed by parentheses containing some operation on "n", which is the number of things in the data set being operated upon. For example, O(n<sup>2</sup>) describes the time complexity of a function that takes quadratically more work to perform as the number of things it's working on. If performing the function on two things takes 4ms, then performing it on 3 things will take 9ms. This is obviously not as efficient as a function with a time complexity like O(n) which scales linearly, so if performing it on 2 items takes 2ms, then with 3 items it takes 3ms. A function which simply returns "gtfo" no matter how big the data set would have constant time complexity, represented by O(1).

**Sorting algorithms** are a specific type of computational function which acts upon a set of items and puts them in a particular order. For example, given the numbers 1, 4, 2, 5, and 3, a sorting algorithm might return them as 1, 2, 3, 4, and 5. While this seems trivial, there are a bunch of different ways to do this--some intuitive and some definitely not so--and these different approaches vary in terms of time complexity.

While I may never have to write my own sorting algorithm (thank you, Ruby, for `Array.sort`), I find these videos useful for two reasons. First, they're an inspiring inventory of different approaches to a seemingly simple problem. And second, it's opened my eyes to a new type of complexity, something against which to measure my own code to make it more efficient.

[1]: http://www.youtube.com/watch?v=MrUMzthTXOs&list=UUTCvWvqjktIq0uvM3trAHC
