---
title: In Rails, Count With .size
date: 2013-02-23 23:54 UTC
tags: rails, performance
---

While using the uber-handy [Rails Panel Chrome extension][1] to monitor my pages' query counts, I discovered that [the page on my site that lists authors][2] was making 50 queries. The culprit? I was counting each author's books with `.count`, which performs a SQL `COUNT` query for every author.

READMORE

As [Josh Susser explains][3], there are three methods for counting records in Ruby/Rails:

* **.count**, which performs a SQL `COUNT` query each time it's called.
* **.length**, a Ruby enumerable method, which counts the number of elements in an enumerable that's already been loaded.
* **.size**, which optimally chooses between `.count` and `.length`, depending on whether what's being counted has already been loaded. Better yet, `.size` will automatically detect a counter cache, which is even more performant.

So by using `.size` instead of `.count`, I reduced the page's query count from 50 to 3. I could potentially reduce that number to 1 with a counter cache, although the moment counter caches for `has_many through:` [relations are broken in Rails][4]. A fix is scheduled for Rails 4.0, so I'll write about it then.

[1]: https://github.com/dejan/rails_panel
[2]: http://stevegrossi.com/on/books/by
[3]: http://blog.hasmanythrough.com/2008/2/27/count-length-size
[4]: https://github.com/rails/rails/issues/7630
