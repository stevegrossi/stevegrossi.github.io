---
title: Writing Clean Functions and Methods
date: 2013-09-16 00:00 EDT
tags:
  - refactoring
---

I've begun reading Robert Martin's [Clean Code: A Handbook of Agile Software Craftsmanship](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882?tag=stevgros-20), and I'm so glad I have. I strongly believe that code is written not for computers but for other programmers (including one's future self), and Martin's book is rich with principles for how to write code with greater transparency of intention and execution.

<!--more-->

His third chapter, on functions, is especially rich, and I want to record just some of what I've learned here. (Since I write primarily in Ruby, where the convention is to call result-producing code "methods" instead of "functions", I'll use the former term from here on out.)

## Use Intention-Revealing Names

This is the most important rule of clean code. Who hasn't had to make a change to a code base and come up against something like this:

```ruby
def get(u, p)
  # ...
end

def fetch(u, p)
  # ...
end
```

There's a lot of unclarity here. What do `u` and `p` stand for? Why are there two methods whose names are synonyms? Much better to err on the side of verbosity by naming methods things like `get_transaction_from_external_api` or `get_random_published_photo_url`. The same goes for variables: for the sake of those who inherit your code, at least avoid single-letter variable names (with the possible exception of `i` for a simple index, since that's pretty conventional). Better still, name variables after what they are. If `@posts` is a collection of posts grouped by month, name it `@posts_by_month`, so someone interacting with that variable elsewhere will know what to expect.

## The Fewer Arguments, the Better

Martin doesn't, but I'd go so far as to say that **method arguments are a code smell**. Of course, they're frequently necessary and not always extraneous, but I can think of plenty of examples where a method is made more clear by removing an argument. Early on, I wrote helper methods like `author_full_name_for(article)` when `article.author_full_name` would have been clearer. The latter makes clear the domain of `author_full_name`—it's a property of articles—whereas the former is opaque as to what type of argument it's expecting.

Another tip is to **avoid flag arguments**. Not only are they opaque (in `format(a, b, true)`, what the heck does `true` do?), requiring future developers to reference the method whenever they need to call it, but they introduce needless complexity. **Methods should do exactly one thing each.** If the third boolean argument in the method above, say, includes an optional wrapper element, the method should be split into `format(a, b)` and `format_with_wrapper(a, b)`, the latter of which calls the former, avoiding duplication. Then there's no ambiguity about their purpose.

More arguments also leads to developer confusion about their proper order. Does the example function `remove(a, b)` remove a from b, or vice versa? Something like `a.remove(b)` clears up that ambiguity. Of course, if for some reason you don't want to add another method on `a`, then consider naming the method something like `remove_item_from_list(a, b)`, indicating that `a` is the item and `b` is the list. In Ruby, and especially Ruby 2.0 with its keyword arguments, favor explicitly named arguments, as with `remove_item_from_list(item: 1, list: 1)`.

## Write Short Methods

Keep your methods short, even if you have to write more of them. Ideally, they should be one line, but at least they should do a single thing. In object-oriented programming, there's something called the **single-responsibility principle**, which holds that a single class should do only one thing, and it should hold all of the logic for doing that one thing within itself. I think the first half of the SRP applies to methods, as well (though as we'll see, in doing so it will likely come into conflict with the second half.)

Long methods are harder to understand, test, and refactor, and they're likely to contain code which is duplicated elsewhere. One of the most rewarding coding habits I've picked up is to preemptively write short methods. Instead of a single, 10-line method which fetches data from an API, parses it, builds records from it, and inserts it into the database, I'll split each of those functions up into its own method and simply call them from the parent method. Not only does this make it more clear what's going on at each step of the way, but it makes debugging easier, and makes it simpler (and thus makes you more likely) to re-use some of these methods in the future.

For more on the subject, I would highly recommend [Clean Code: A Handbook of Agile Software Craftsmanship][1]. Also, Katrina Owen has done a fabulous talk called "Therapeutic Refactoring" ([watch it here](http://confreaks.com/videos/1071-cascadiaruby2012-therapeutic-refactoring)) which walks through refactoring a particularly gnarly method and illustrates many of the principles at work here.
