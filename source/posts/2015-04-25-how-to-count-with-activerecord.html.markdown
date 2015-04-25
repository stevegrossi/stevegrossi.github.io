---
title: How to Count With ActiveRecord
date: 2015-04-25 07:41 EDT
tags: rails
---

Counting records returned from the database by ActiveRecord is quite a bit more complicated than you'd expect, but that's the price of Rails’ magic and the invisible efficiency it gives you behind the scenes. ActiveRecord has its own implementation of Ruby's `size`, `any?`, and `empty?` methods which behave differently than their array counterparts. Understanding how each works will help you write more efficient code when dealing with database records.

READMORE

## In General

- When counting the number of results from the database, use `size` unless you know you'll be loading all of the results later on, then use `length`.
- When checking if there are any results from the database, use `any?` or its opposite `empty?` unless you know you'll be loading all of the results later on, then use `present?` or its opposite `blank?`.

To understand why, read on.

## Counting the Number of Records

Rails gives us three ways to count the number of records returned from the database.

### count

When called on an `ActiveRecord::Relation` object, `count` will perform a SQL `COUNT` query, which is very fast, especially on large result sets:

    Post.all.count
    (87.5ms) SELECT COUNT(*) FROM "posts"
    #=> 100000

But `count` is also a plain Ruby method (defined on `Enumerable`) which can be called on arrays:

    Post.all.to_a.count
      (1396.5ms) SELECT "posts".* FROM "posts"
    #=> 100000

Notice that after converting `Post.all` from an `ActiveRecord::Relation` to an array, `count` no longer performs a `COUNT` query. Instead, `to_a` loads all 100,000 records from the database and initializes them as an array of `Post` objects, and `count` calculates the size of that array, which in this case is about 16x slower. The takeaway here is that `ActiveRecord::Relation#count` is much faster than initializing an array of objects and calling `Enumerable#count` on the array.

### length

As mentioned above, `length` is a plain Ruby method which functions like `count` when called on an array. The difference is that ActiveRecord does not define its own `length` method. So if you call `length` on an `ActiveRecord::Relation` object, it will be converted to an array, and will count the array's objects. This is equivalent to the slower `count` method above:

    Post.all.length
      (1372.2ms) SELECT "posts".* FROM "posts"
    #=> 100000

(As an aside, when called on an array, `length` is slightly more efficient than `count`. See [this post](http://batsov.com/articles/2014/02/17/the-elements-of-style-in-ruby-number-13-length-vs-size-vs-count/) for more on that.)

### size

Like `count`, `size` works differently depending on whether you call it on an array or an `ActiveRecord::Relation` object. When called on an array, `size` is identical to `length`: it returns the number of objects in the array. But things get interesting when you call `size` on an `ActiveRecord::Relation`. In this case, it behaves differently depending on whether or not the relation's records have been loaded from the database yet. To test this, lets create an `ActiveRecord::Relation` object `@posts` (as we'd typically do in a controller) and ensure it's not been loaded from the database.

    @posts = Post.all
    @posts.class
    #=> post::ActiveRecord_Relation
    
    @posts.loaded?
    #=> nil

Since `@posts` hasn't been loaded, `size` will perform a `COUNT` query:

    @posts.size
      (82.1ms) SELECT COUNT(*) FROM "posts"
    #=> 100000

Now, if we manually load the posts:

    @posts.load
      (1368.2ms) SELECT "posts".* FROM "posts"
    #=> #<ActiveRecord::Relation [#<Post id: ...
    
    @posts.loaded?
    #=> true

`@posts` contains an array of `Post` objects from the database, so `size` will no longer perform a `COUNT` query, and instead just get the length of the array:

    @posts.size
    #=> 100000

However, `ActiveRecord::Relation#size` has one more trick up its sleeve: it can avoid the `COUNT` query entirely when called on an association with a counter cache. (To learn more about counter caches, [the Rails Guide](http://guides.rubyonrails.org/association_basics.html#counter-cache) is an excelent resource. For now, I'll assume you're familiar with the concept.) Assuming a `User` model with a `posts_count` column and which `has_many :posts, counter_cache: true`:

    user = User.find(1)
    #=> #<User id: 1 ...
    
    @posts = user.posts

    # Look ma, no query! Instead, size returns user.posts_count
    @posts.size
    #=> 100

### `size` Is Your Friend

For this reason, **you should almost always use `size` when counting ActiveRecord relations**. It will usually choose the most efficient way to count: a `length` on the array if you've already loaded the records, a speedy `COUNT` query if you haven't, or simply reading from the available counter cache if you don't need to. The only case where you might not want to use `size` is to avoid the `COUNT` query if you *know* you're going to load the records, but haven't yet (and don't have a counter cache). For example, consider this view code:

    <h2><%= @posts.size %> Posts</h2>
    <ul>
      <%= render @posts %>
    </ul>

Assuming `@posts` hasn't been loaded yet, `@posts.size` is going to perform a `COUNT` query to get the number of posts, and then `render @posts` is going to perform a second query to load all of the posts. Here, you could eliminate the `COUNT` query by using `length` to load all of the posts, since you're going to load them anyway:

    <h2><%= @posts.length %> Posts</h2>
    <ul>
      <%= render @posts %>
    </ul>

So, that's how to count the number of results. But what if we just want to know if there *are* results? We could always just do `if @posts.size > 0`, but there are more elegant ways...

## Checking Whether There Are Any Results

As it does with `count` and `size`, ActiveRecord overrides some of Ruby's array methods in order to more efficiently check whether an `ActiveRecord::Relation` will return any records.

When called on an array, `empty?` returns `true` if the array contains no elements:

    [].empty?
    #=> true

    [1, 2, 3].empty?
    #=> false

However, when called in an `ActiveRecord::Relation` object, `empty?` performs an efficient `COUNT` query to check if there are any records:

    Post.all.empty?
      (80.8ms) SELECT COUNT(*) FROM "posts"
    #=> false

But if the results of the `ActiveRecord::Relation` have already been loaded into an array of `Post` objects, `empty?` skips the `COUNT` query and falls back to its array behavior, just like `size` does:

    @posts = Post.all
    @posts.load
      (1364.5ms) SELECT "posts".* FROM "posts"
    #=> #<ActiveRecord::Relation [#<Post id: ...

    @posts.empty?
    # No superfluous COUNT query
    #=> false

`any?` is effectively the opposite of `empty?` (see note below) and its ActiveRecord version works the same way, performing a `COUNT` query if the records haven't been loaded, and falling back to its array behavior if they have.

    Post.all.any?
      (81.4ms) SELECT COUNT(*) FROM "posts"
    #=> false

    @posts = Post.all
    @posts.load
      (1364.5ms) SELECT "posts".* FROM "posts"
    #=> #<ActiveRecord::Relation [#<Post id: ...

    @posts.any?
    # No superfluous COUNT query
    #=> true

(**Note:** technically `any?`, when called on an array, checks if any of its values evaluate to true, whereas `empty?` just checks if the array has values. So `[false].empty?` is `false` because it contains an element, but `[false].any?` is also `false` because it contains no elements which evaluate to `true`. So `any?` is not quite the opposite of `empty?`, but since ActiveRecord returns arrays containing objects which always evaluate to `true`, in such cases `any?` and `empty?` do function as opposites.)

And like `size`, `any?` and `empty?` can take advantage of an available counter cache in order to efficiently avoid even the `COUNT` query when possible. Assuming the earlier `User` model with a `posts_count` column and which `has_many :posts, counter_cache: true`:

    user = User.find(1)
    #=> #<User id: 1 ...
    
    @posts = user.posts

    # No query! empty? checks whether user.posts_count == 0
    @posts.empty?
    #=> false

    # No query! any? checks whether user.posts_count > 0
    @posts.any?
    #=> true

Because it's smart like `size`, **you'll almost always want to use `any?` and `empty?` in order to check whether records exists in the database**. `any?` and `empty?` will choose the most efficient way: checking the array of results if they've already been loaded, performing a `COUNT` query if they haven't, and checking for a counter cache if the results don't need to be loaded. The exception to this rule is similar to `size`: if you *know* you're going to be loading an array of results but haven't yet (and don't have a counter cache), you'll probably want to avoid the superfluous `COUNT` query. A common example is when checking if there are any posts before rendering them:

    <% if @posts.any? %>
      <h2>All Posts</h2>
      <ul>
        <%= render @posts %>
      </ul>
    <% end %>

Here, `@posts.any?` will perform a `COUNT` query, which is pretty efficient, but if you expect there will almost always be posts you may want to avoid the extra query entirely. In that case, you can preemptively convert the posts to an array (`@posts.to_a.any?`), but I would recommend using ActiveSupport's `present?`, which will convert `@posts` to an array for you:

    <% if @posts.present? %>
      <h2>All Posts</h2>
      <ul>
        <%= render @posts %>
      </ul>
    <% end %>

The reason I recommend `present?` over `to_a.any?` has to do with the note above on the difference between `any?` and `empty?`. `empty?` simply checks whether an array contains elements, while `any?` has to check each individual element in the array to determine whether it evaluates to true. As a result, `empty?` is faster than `any?`, especially with large arrays. ActiveSupport's `present?` method just calls `!blank?`, and `blank?` internally calls `empty?`, so `present?` will always be as fast or faster than `any?`.
