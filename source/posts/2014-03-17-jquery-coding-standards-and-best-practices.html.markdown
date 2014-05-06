---
title: jQuery Coding Standards and Best Practices
date: 2014-03-17 00:00 EDT
tags: jquery, performance
---

Abhinay Rathore has compiled [a treasure trove of best practices][1] for working with jQuery (and DOM manipulation in general), and best of all it's well-annotated with links to explanations and performance comparisons to back up the recommendations. I learned more than a few tricks to improve performance, like detaching DOM elements before engaging in heavy manipulation, using string concatenation instead of appending elements, and passing an object literal to `$el.attr({attr: value})` instead of chaining multiple `attr()` calls.

READMORE

 [1]: http://lab.abhinayrathore.com/jquery-standards/
