---
title: 'This Week I Learned #10'
date: 2014-05-10 10:28 EDT
tags: ruby, rails
---

Lots of Ruby learning this week, including two tricks with arrays and why you might want to freeze a value, plus some surprising behavior (and how to work around it) with ActionView's `cycle()` method.

READMORE

## Why You Might Use `String#freeze`

Mat Sadler at Globaldev has [a fantastically detailed look at all of the changes in Ruby 2.1](http://globaldev.co.uk/2014/05/ruby-2-1-in-detail/). There's plenty to learn from it, but I was most glad to finally understand what String#freeze does and why you might want to use it.

Remember that strings in Ruby are mutable, meaning they can always be changed. For this reason, every time Ruby evaluates a string, it has to create a new object. Mat illustrates:

    def env
      'development'
    end

    # returns new String object on each call
    env.object_id   #=> 70329318373020
    env.object_id   #=> 70329318372900

If you're wondering why, consider the following additional method:

    def env!
      env << '!'
    end

If env returned the same string object (`'development'`) each time it was called, then the first time you called `env!` that object would get an exclamation point appended, and after that even calling plain old env would return 'development!'. So it prevents some of unexpected behavior that Ruby creates a new object each time a string is evaluated, however that comes with a cost. All of these new objects clutter up ruby's object space, incerasing RAM usage and requiring more garbage collection to clean them up.

This is where String#freeze steps in. Again, as Mat demonstrates:

    def env
      'development'.freeze
    end

    # returns the same String object on each call
    env.object_id   #=> 70365553080120
    env.object_id   #=> 70365553080120

Freezing 'development' has two handy effects:

1. It lets ruby retain the same internal object each time env is called, eliminating the need for that additional RAM and garbace collection.
2. It raises `RuntimeError: can't modify frozen string` if you accidentally try to modify the string.

I didn't think I'd seen freeze used often, but sure enough once I went looking for it, [here it turned up in Rails](https://github.com/rails/rails/blob/4-0-stable/actionpack/lib/action_dispatch/http/response.rb#L55) for freezing constant values.

## How to Convert a Range to an Array of Integers in Ruby

Earlier this week I needed an array in ruby containing a bunch of sequential integers. `(1..9).to_a` would do the trick, as would `Array 1..9` in one less character, but a quick search pointed me to an interesting use of the multitalented splat operator to instantiate an array from a range:

    [*1..9]
    => [1, 2, 3, 4, 5, 6, 7, 8, 9]

## How to Use Ruby's `Array()` Constructor to Guard Against nil.each

This week's [Ruby Weekly](http://rubyweekly.com/) pointed me to [a useful technique fom the folks at Dockward](http://reefpoints.dockyard.com/2014/05/03/guarding-with-arrays.html) for simplifying code that iterates over an array or hash that might be nil. Your first instinct might be to first check for nil:

    if params[:ids] # make sure it's not nil
      params[:ids].each do |id|
        puts id
      end
    end

But since `Array(nil)` in ruby returns an empty array, you can replace the nil check with:

    Array(params[:ids]).each do |thing|
      ...
    end

## ActionView's `cycle` Method Retains State Across Collections

While rendering out two sets of employees using the same partial in a Rails view, I was surprised to learn that the `cycle` method I was using to add 'even' and 'odd' classes to list items was starting with 'even' in the first set, but with 'odd' in the second.

    # app/views/employees/_employee.html.erb
    <li class="employee <%= cycle('even', 'odd') %>">

I soon realized it was because the first collection had an odd number of employees, and `cycle` in the second rendering was simply picking up where it left off in the first. Fortunately, this can be fixed by giving the cycle a name and manually resetting it after the first render:

    # app/views/employees/_employee.html.erb
    <li class="employee <%= cycle('even', 'odd', name: :employees) %>">

    # app/views/employees/index.html.erb
    <!-- Starts with 'even' -->
    <%= render @special_employees %>
    <% reset_cycle :employees %>

    <!-- Now also starts with 'even' -->
    <%= render @normal_employees %>
